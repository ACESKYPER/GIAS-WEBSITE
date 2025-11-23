terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.20"
    }
  }

  backend "s3" {
    bucket         = "gias-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "gias-terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Environment = var.environment
      Project     = "GIAS"
      ManagedBy   = "Terraform"
    }
  }
}

# EKS Cluster
resource "aws_eks_cluster" "gias" {
  name            = "gias-${var.environment}"
  version         = "1.27"
  role_arn        = aws_iam_role.eks_cluster_role.arn
  
  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = true
    endpoint_public_access  = var.environment != "prod"
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]

  tags = {
    Name = "gias-${var.environment}"
  }
}

# EKS Node Group
resource "aws_eks_node_group" "gias" {
  cluster_name    = aws_eks_cluster.gias.name
  node_group_name = "gias-nodes-${var.environment}"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = var.subnet_ids
  version         = "1.27"

  scaling_config {
    desired_size = 3
    max_size     = 10
    min_size     = 3
  }

  instance_types = var.node_instance_types

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry_policy,
  ]

  tags = {
    Name = "gias-node-group"
  }
}

# RDS PostgreSQL Database
resource "aws_db_instance" "gias" {
  identifier     = "gias-db-${var.environment}"
  engine         = "postgres"
  engine_version = "15.3"
  instance_class = var.db_instance_class
  
  allocated_storage     = 100
  max_allocated_storage = 500
  storage_encrypted     = true
  
  db_name  = "gias_db"
  username = "gias_admin"
  password = random_password.db_password.result
  
  db_subnet_group_name   = aws_db_subnet_group.gias.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  
  skip_final_snapshot       = false
  final_snapshot_identifier = "gias-db-${var.environment}-final-snapshot-${formatdate("YYYY-MM-DD-hhmm", timestamp())}"
  
  backup_retention_period = 30
  backup_window           = "03:00-04:00"
  maintenance_window      = "sun:04:00-sun:05:00"
  
  multi_az               = var.environment == "prod"
  publicly_accessible    = false
  
  enable_cloudwatch_logs_exports = ["postgresql"]

  tags = {
    Name = "gias-db-${var.environment}"
  }
}

# S3 Bucket for Evidence Storage
resource "aws_s3_bucket" "evidence" {
  bucket = "gias-evidence-${var.environment}-${data.aws_caller_identity.current.account_id}"
}

resource "aws_s3_bucket_versioning" "evidence" {
  bucket = aws_s3_bucket.evidence.id
  
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "evidence" {
  bucket = aws_s3_bucket.evidence.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "evidence" {
  bucket = aws_s3_bucket.evidence.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Secrets Manager for sensitive data
resource "aws_secretsmanager_secret" "gias_secrets" {
  name = "gias/${var.environment}/secrets"

  tags = {
    Name = "gias-secrets"
  }
}

resource "aws_secretsmanager_secret_version" "gias_secrets" {
  secret_id = aws_secretsmanager_secret.gias_secrets.id
  secret_string = jsonencode({
    db_password       = random_password.db_password.result
    secret_key        = random_password.secret_key.result
    jwt_secret        = random_password.jwt_secret.result
    s3_access_key     = aws_iam_access_key.s3_user.id
    s3_secret_key     = aws_iam_access_key.s3_user.secret
  })
}

# CloudWatch Log Group
resource "aws_cloudwatch_log_group" "gias_api" {
  name              = "/aws/eks/gias-api-${var.environment}"
  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "gias_web" {
  name              = "/aws/eks/gias-web-${var.environment}"
  retention_in_days = 30
}

# Random passwords
resource "random_password" "db_password" {
  length  = 32
  special = true
}

resource "random_password" "secret_key" {
  length  = 32
  special = true
}

resource "random_password" "jwt_secret" {
  length  = 32
  special = true
}

# Data source
data "aws_caller_identity" "current" {}

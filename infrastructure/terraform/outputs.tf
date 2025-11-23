output "eks_cluster_name" {
  description = "EKS cluster name"
  value       = aws_eks_cluster.gias.name
}

output "eks_cluster_endpoint" {
  description = "EKS cluster API endpoint"
  value       = aws_eks_cluster.gias.endpoint
}

output "rds_endpoint" {
  description = "RDS database endpoint"
  value       = aws_db_instance.gias.endpoint
  sensitive   = true
}

output "s3_bucket_name" {
  description = "S3 bucket for evidence storage"
  value       = aws_s3_bucket.evidence.id
}

output "secrets_manager_arn" {
  description = "Secrets Manager secret ARN"
  value       = aws_secretsmanager_secret.gias_secrets.arn
}

#!/bin/bash
# GIAS MVP Integration Test Script
# Tests key flows: auth, validation, scoring, attestation

echo "🧪 GIAS MVP Integration Test"
echo "=============================="

API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

echo ""
echo "1️⃣  Testing Backend Health..."
curl -s "$API_URL/health" | jq . || echo "❌ Backend not responding"

echo ""
echo "2️⃣  Testing Auth Login..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "enterprise@example.com",
    "password": "password123"
  }')

echo "$LOGIN_RESPONSE" | jq .

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty')

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to obtain token"
  exit 1
fi

echo "✅ Token obtained: ${TOKEN:0:20}..."

echo ""
echo "3️⃣  Testing Evidence Validation..."
VALIDATION_RESPONSE=$(curl -s -X POST "$API_URL/api/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "evidence": {
      "model_name": "Fraud Detection System",
      "model_version": "1.2.0",
      "data_governance": {
        "data_sources": ["transactions", "labels"],
        "data_lineage_documented": true,
        "consent_obtained": true,
        "retention_policy_days": 730
      },
      "explainability": {
        "feature_importance_available": true,
        "model_cards_documented": true,
        "interpretability_methods": ["SHAP", "LIME"]
      },
      "robustness": {
        "adversarial_testing_performed": true,
        "bias_audit_score": 85,
        "performance_on_minority_groups": 82
      },
      "operational": {
        "monitoring_enabled": true,
        "incident_response_plan": true,
        "model_degradation_threshold": 0.05
      },
      "alignment": {
        "privacy_controls": true,
        "fairness_commitments": true,
        "human_oversight": true
      }
    }
  }')

echo "$VALIDATION_RESPONSE" | jq .

echo ""
echo "4️⃣  Testing Certification Scoring..."
SCORING_RESPONSE=$(curl -s -X POST "$API_URL/api/certification/score" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"evidence\": {
      \"model_name\": \"Fraud Detection System\",
      \"model_version\": \"1.2.0\",
      \"data_governance\": {
        \"data_sources\": [\"transactions\", \"labels\"],
        \"data_lineage_documented\": true,
        \"consent_obtained\": true,
        \"retention_policy_days\": 730
      },
      \"explainability\": {
        \"feature_importance_available\": true,
        \"model_cards_documented\": true,
        \"interpretability_methods\": [\"SHAP\", \"LIME\"]
      },
      \"robustness\": {
        \"adversarial_testing_performed\": true,
        \"bias_audit_score\": 85,
        \"performance_on_minority_groups\": 82
      },
      \"operational\": {
        \"monitoring_enabled\": true,
        \"incident_response_plan\": true,
        \"model_degradation_threshold\": 0.05
      },
      \"alignment\": {
        \"privacy_controls\": true,
        \"fairness_commitments\": true,
        \"human_oversight\": true
      }
    },
    \"validation_result\": {
      \"valid\": true,
      \"errors\": [],
      \"warnings\": [],
      \"timestamp\": \"2025-01-15T10:00:00Z\"
    }
  }"
)

echo "$SCORING_RESPONSE" | jq .

SCORES=$(echo "$SCORING_RESPONSE" | jq '.overall_score // empty')
if [ ! -z "$SCORES" ]; then
  echo "✅ Certification Score: $SCORES/100"
fi

echo ""
echo "5️⃣  Testing Attestation Issuance..."
ATTESTATION_RESPONSE=$(curl -s -X POST "$API_URL/api/attestation/issue" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"evidence\": {
      \"model_name\": \"Fraud Detection System\",
      \"model_version\": \"1.2.0\"
    },
    \"scores\": $SCORING_RESPONSE,
    \"organization_id\": \"org-001\"
  }")

echo "$ATTESTATION_RESPONSE" | jq .

ATTESTATION_ID=$(echo "$ATTESTATION_RESPONSE" | jq -r '.id // empty')

if [ ! -z "$ATTESTATION_ID" ]; then
  echo "✅ Attestation issued: $ATTESTATION_ID"
  
  echo ""
  echo "6️⃣  Testing Attestation Verification (Public)..."
  VERIFY_RESPONSE=$(curl -s -X GET "$API_URL/api/verify/$ATTESTATION_ID")
  echo "$VERIFY_RESPONSE" | jq .
  
  VERIFY_STATUS=$(echo "$VERIFY_RESPONSE" | jq -r '.valid // empty')
  if [ "$VERIFY_STATUS" = "true" ]; then
    echo "✅ Attestation verified successfully"
  fi
fi

echo ""
echo "7️⃣  Testing Frontend Routes..."
echo "- Homepage: $FRONTEND_URL"
echo "- Sign In: $FRONTEND_URL/auth/signin"
echo "- Dashboard: $FRONTEND_URL/dashboard"
echo "- Evidence: $FRONTEND_URL/evidence"
echo "- Explorer: $FRONTEND_URL/explorer"

echo ""
echo "✅ Integration Test Complete!"

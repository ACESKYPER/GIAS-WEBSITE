"""
Evidence validation service - validates evidence bundles against GIAS-MIF schema.
"""
from datetime import datetime
from typing import List
from app.models.certification import (
    EvidenceBundleData,
    ValidationResult,
    ValidationError,
)

def validate_evidence_bundle(evidence: EvidenceBundleData) -> ValidationResult:
    """
    Validate evidence bundle against GIAS-MIF schema.
    Returns validation results with any errors or warnings found.
    """
    errors: List[ValidationError] = []
    warnings: List[ValidationError] = []

    # Required fields validation
    if not evidence.model_name or len(evidence.model_name.strip()) == 0:
        errors.append(ValidationError(
            field="model_name",
            message="Model name is required and cannot be empty",
            severity="error"
        ))

    if not evidence.model_version or len(evidence.model_version.strip()) == 0:
        errors.append(ValidationError(
            field="model_version",
            message="Model version is required and cannot be empty",
            severity="error"
        ))

    # Validate data governance
    if evidence.data_governance:
        dg = evidence.data_governance
        
        # Data sources validation
        data_sources = dg.get("data_sources", [])
        if not isinstance(data_sources, list):
            errors.append(ValidationError(
                field="data_governance.data_sources",
                message="Data sources must be a list",
                severity="error"
            ))
        elif len(data_sources) == 0:
            warnings.append(ValidationError(
                field="data_governance.data_sources",
                message="No data sources documented - add for better compliance",
                severity="warning"
            ))

        # Lineage validation
        if not dg.get("data_lineage_documented"):
            warnings.append(ValidationError(
                field="data_governance.data_lineage_documented",
                message="Data lineage not documented - important for transparency",
                severity="warning"
            ))

        # Consent validation
        if not dg.get("consent_obtained"):
            warnings.append(ValidationError(
                field="data_governance.consent_obtained",
                message="Data consent not documented - required for some jurisdictions",
                severity="warning"
            ))

        # Retention policy validation
        retention = dg.get("retention_policy_days", 0)
        if not isinstance(retention, (int, float)) or retention < 30:
            errors.append(ValidationError(
                field="data_governance.retention_policy_days",
                message="Retention policy must be at least 30 days",
                severity="error"
            ))
        elif retention > 3650:
            warnings.append(ValidationError(
                field="data_governance.retention_policy_days",
                message="Retention policy exceeds 10 years - consider shortening",
                severity="warning"
            ))

    # Validate explainability
    if evidence.explainability:
        exp = evidence.explainability
        
        if not exp.get("feature_importance_available"):
            warnings.append(ValidationError(
                field="explainability.feature_importance_available",
                message="Feature importance not available - add for transparency",
                severity="warning"
            ))

        if not exp.get("model_cards_documented"):
            warnings.append(ValidationError(
                field="explainability.model_cards_documented",
                message="Model cards not documented - important documentation missing",
                severity="warning"
            ))

        methods = exp.get("interpretability_methods", [])
        if not isinstance(methods, list) or len(methods) == 0:
            warnings.append(ValidationError(
                field="explainability.interpretability_methods",
                message="No interpretability methods specified",
                severity="warning"
            ))

    # Validate robustness
    if evidence.robustness:
        rob = evidence.robustness
        
        if not rob.get("adversarial_testing_performed"):
            warnings.append(ValidationError(
                field="robustness.adversarial_testing_performed",
                message="Adversarial testing not performed - important for security",
                severity="warning"
            ))

        bias_score = rob.get("bias_audit_score", 0)
        if not isinstance(bias_score, (int, float)) or not (0 <= bias_score <= 100):
            errors.append(ValidationError(
                field="robustness.bias_audit_score",
                message="Bias audit score must be between 0 and 100",
                severity="error"
            ))
        elif bias_score < 70:
            warnings.append(ValidationError(
                field="robustness.bias_audit_score",
                message="Bias audit score is below recommended threshold of 70",
                severity="warning"
            ))

        minority_perf = rob.get("performance_on_minority_groups", 0)
        if not isinstance(minority_perf, (int, float)) or not (0 <= minority_perf <= 100):
            errors.append(ValidationError(
                field="robustness.performance_on_minority_groups",
                message="Performance on minority groups must be between 0 and 100",
                severity="error"
            ))
        elif minority_perf < 70:
            warnings.append(ValidationError(
                field="robustness.performance_on_minority_groups",
                message="Performance on minority groups is below acceptable level",
                severity="warning"
            ))

    # Validate operational
    if evidence.operational:
        op = evidence.operational
        
        if not op.get("monitoring_enabled"):
            warnings.append(ValidationError(
                field="operational.monitoring_enabled",
                message="Monitoring not enabled - critical for operational safety",
                severity="warning"
            ))

        if not op.get("incident_response_plan"):
            warnings.append(ValidationError(
                field="operational.incident_response_plan",
                message="No incident response plan documented",
                severity="warning"
            ))

        threshold = op.get("model_degradation_threshold", 0.5)
        if not isinstance(threshold, (int, float)) or not (0 < threshold < 1):
            warnings.append(ValidationError(
                field="operational.model_degradation_threshold",
                message="Model degradation threshold should be between 0 and 1",
                severity="warning"
            ))

    # Validate alignment
    if evidence.alignment:
        align = evidence.alignment
        
        if not align.get("privacy_controls"):
            warnings.append(ValidationError(
                field="alignment.privacy_controls",
                message="Privacy controls not documented",
                severity="warning"
            ))

        if not align.get("fairness_commitments"):
            warnings.append(ValidationError(
                field="alignment.fairness_commitments",
                message="Fairness commitments not documented",
                severity="warning"
            ))

        if not align.get("human_oversight"):
            warnings.append(ValidationError(
                field="alignment.human_oversight",
                message="Human oversight not implemented",
                severity="warning"
            ))

    # Determine validity: valid if no errors (warnings are OK)
    is_valid = len(errors) == 0

    return ValidationResult(
        valid=is_valid,
        errors=errors,
        warnings=warnings,
        timestamp=datetime.utcnow().isoformat() + "Z"
    )

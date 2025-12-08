"""
Certification scoring engine - 5-axis MVP implementation.
"""
from typing import List
from app.models.certification import (
    CertificationScore,
    CertificationLevel,
    EvidenceBundleData,
    ValidationResult,
)

def calculate_alignment_score(evidence: EvidenceBundleData) -> float:
    """
    Calculate alignment score (0-100).
    Measures: Privacy controls, fairness commitments, human oversight
    """
    if not evidence.alignment:
        return 0.0
    
    alignment = evidence.alignment
    score = 0.0
    max_points = 3
    points = 0

    if alignment.get("privacy_controls"):
        points += 1
    if alignment.get("fairness_commitments"):
        points += 1
    if alignment.get("human_oversight"):
        points += 1

    score = (points / max_points) * 100
    return round(score, 2)

def calculate_robustness_score(evidence: EvidenceBundleData) -> float:
    """
    Calculate robustness score (0-100).
    Measures: Adversarial testing, bias audits, minority group performance
    """
    if not evidence.robustness:
        return 0.0

    robustness = evidence.robustness
    scores = []

    # Adversarial testing: boolean (0-30 points)
    adversarial = 30.0 if robustness.get("adversarial_testing_performed") else 0.0
    scores.append(adversarial)

    # Bias audit score: 0-100 (0-30 points)
    bias_audit = robustness.get("bias_audit_score", 0) * 0.3
    scores.append(bias_audit)

    # Minority group performance: 0-100 (0-40 points)
    minority_perf = robustness.get("performance_on_minority_groups", 0) * 0.4
    scores.append(minority_perf)

    total_score = sum(scores)
    return round(total_score, 2)

def calculate_data_governance_score(evidence: EvidenceBundleData) -> float:
    """
    Calculate data governance score (0-100).
    Measures: Data lineage, consent, retention policies, data sources
    """
    if not evidence.data_governance:
        return 0.0

    data_gov = evidence.data_governance
    score = 0.0
    max_points = 4
    points = 0

    # Data sources documented
    if data_gov.get("data_sources") and len(data_gov.get("data_sources", [])) > 0:
        points += 1

    # Lineage documented
    if data_gov.get("data_lineage_documented"):
        points += 1

    # Consent obtained
    if data_gov.get("consent_obtained"):
        points += 1

    # Retention policy (must be reasonable: 30-2555 days)
    retention = data_gov.get("retention_policy_days", 0)
    if 30 <= retention <= 2555:
        points += 1

    score = (points / max_points) * 100
    return round(score, 2)

def calculate_explainability_score(evidence: EvidenceBundleData) -> float:
    """
    Calculate explainability score (0-100).
    Measures: Feature importance, model cards, interpretability methods
    """
    if not evidence.explainability:
        return 0.0

    explain = evidence.explainability
    score = 0.0
    max_points = 3
    points = 0

    if explain.get("feature_importance_available"):
        points += 1

    if explain.get("model_cards_documented"):
        points += 1

    methods = explain.get("interpretability_methods", [])
    if isinstance(methods, list) and len(methods) > 0:
        points += 1

    score = (points / max_points) * 100
    return round(score, 2)

def calculate_operational_risk_score(evidence: EvidenceBundleData) -> float:
    """
    Calculate operational risk score (0-100).
    Measures: Monitoring, incident response, degradation thresholds
    """
    if not evidence.operational:
        return 0.0

    operational = evidence.operational
    score = 0.0
    max_points = 3
    points = 0

    if operational.get("monitoring_enabled"):
        points += 1

    if operational.get("incident_response_plan"):
        points += 1

    # Degradation threshold (should be < 0.1 for good practices)
    threshold = operational.get("model_degradation_threshold", 1.0)
    if threshold < 0.1:
        points += 1

    score = (points / max_points) * 100
    return round(score, 2)

def determine_certification_level(overall_score: float) -> CertificationLevel:
    """Determine certification level based on overall score."""
    if overall_score >= 90:
        return CertificationLevel.PLATINUM
    elif overall_score >= 80:
        return CertificationLevel.GOLD
    elif overall_score >= 70:
        return CertificationLevel.SILVER
    elif overall_score >= 50:
        return CertificationLevel.BRONZE
    else:
        return CertificationLevel.FAILED

def generate_recommendations(scores: CertificationScore, evidence: EvidenceBundleData) -> List[str]:
    """Generate actionable recommendations based on scores."""
    recommendations = []

    if scores.alignment_score < 80:
        recommendations.append("Strengthen privacy controls and fairness commitments")

    if scores.robustness_score < 80:
        recommendations.append("Increase adversarial testing coverage and bias audit scores")

    if scores.data_governance_score < 80:
        recommendations.append("Improve data lineage documentation and consent mechanisms")

    if scores.explainability_score < 80:
        recommendations.append("Add feature importance analysis and model cards")

    if scores.operational_risk_score < 80:
        recommendations.append("Enable comprehensive monitoring and incident response planning")

    if scores.overall_score >= 80:
        recommendations.append("Maintain current certification through annual audits")

    return recommendations

def calculate_certification_scores(
    evidence: EvidenceBundleData,
    validation_result: ValidationResult
) -> CertificationScore:
    """
    Calculate 5-axis certification scores.
    Returns complete CertificationScore with recommendations.
    """
    # If validation failed with errors, return low scores
    if not validation_result.valid and validation_result.errors:
        return CertificationScore(
            alignment_score=0.0,
            robustness_score=0.0,
            data_governance_score=0.0,
            explainability_score=0.0,
            operational_risk_score=0.0,
            overall_score=0.0,
            certification_level=CertificationLevel.FAILED,
            recommendations=["Fix validation errors before certification"],
        )

    # Calculate individual axis scores
    alignment = calculate_alignment_score(evidence)
    robustness = calculate_robustness_score(evidence)
    data_governance = calculate_data_governance_score(evidence)
    explainability = calculate_explainability_score(evidence)
    operational = calculate_operational_risk_score(evidence)

    # Calculate overall (average of all axes, weighted slightly toward robustness)
    overall = (
        alignment * 0.15 +
        robustness * 0.25 +
        data_governance * 0.2 +
        explainability * 0.2 +
        operational * 0.2
    )

    overall = round(overall, 2)

    # Determine certification level
    level = determine_certification_level(overall)

    # Generate recommendations
    scores = CertificationScore(
        alignment_score=alignment,
        robustness_score=robustness,
        data_governance_score=data_governance,
        explainability_score=explainability,
        operational_risk_score=operational,
        overall_score=overall,
        certification_level=level,
        recommendations=[],
    )

    scores.recommendations = generate_recommendations(scores, evidence)

    return scores

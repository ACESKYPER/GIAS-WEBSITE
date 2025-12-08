'use client'

import React from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { CertificationScore } from '@/types/certification'

interface ScoreRadarProps {
  scores: CertificationScore
}

export function ScoreRadar({ scores }: ScoreRadarProps) {
  const data = [
    {
      axis: 'Alignment',
      value: scores.alignment_score,
    },
    {
      axis: 'Robustness',
      value: scores.robustness_score,
    },
    {
      axis: 'Data Governance',
      value: scores.data_governance_score,
    },
    {
      axis: 'Explainability',
      value: scores.explainability_score,
    },
    {
      axis: 'Operational Risk',
      value: scores.operational_risk_score,
    },
  ]

  const getCertificationColor = (level: string) => {
    switch (level) {
      case 'platinum':
        return '#fbbf24' // Amber/gold
      case 'gold':
        return '#f59e0b' // Orange
      case 'silver':
        return '#9ca3af' // Gray
      case 'bronze':
        return '#d97706' // Orange-brown
      default:
        return '#ef4444' // Red
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-8">
        <div className="text-center">
          <div className={`text-5xl font-bold ${scores.overall_score >= 80 ? 'text-green-600' : scores.overall_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {scores.overall_score.toFixed(1)}
          </div>
          <p className="mt-1 text-sm text-gray-600">Overall Score</p>
        </div>

        <div className="text-center">
          <div
            className="rounded-full px-6 py-2 text-center font-bold text-white"
            style={{ backgroundColor: getCertificationColor(scores.certification_level) }}
          >
            {scores.certification_level.toUpperCase()}
          </div>
          <p className="mt-1 text-sm text-gray-600">Certification Level</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip formatter={(value: any) => `${Number(value).toFixed(1)}`} />
        </RadarChart>
      </ResponsiveContainer>

      {scores.recommendations.length > 0 && (
        <div className="w-full rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h4 className="mb-2 font-semibold text-blue-900">Recommendations</h4>
          <ul className="space-y-1 text-sm text-blue-800">
            {scores.recommendations.map((rec, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

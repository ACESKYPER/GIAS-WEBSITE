'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import type { EvidenceBundle, ValidationResult, CertificationScore } from '@/types/certification'
import { useGiasApi } from '@/lib/api/gias'
import { ScoreRadar } from '@/components/ScoreRadar'

interface EvidenceUploadState {
  evidence: EvidenceBundle | null
  validationResult: ValidationResult | null
  scores: CertificationScore | null
  error: string | null
  isLoading: boolean
  step: 'upload' | 'validating' | 'scoring' | 'complete'
}

export function EvidenceUpload() {
  const [state, setState] = useState<EvidenceUploadState>({
    evidence: null,
    validationResult: null,
    scores: null,
    error: null,
    isLoading: false,
    step: 'upload',
  })

  const api = useGiasApi()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return

      const file = acceptedFiles[0]

      try {
        setState((prev) => ({
          ...prev,
          isLoading: true,
          error: null,
          step: 'validating',
        }))

        const text = await file.text()
        const evidence: EvidenceBundle = JSON.parse(text)

        // Validate evidence
        const validationResult = await api.validateEvidence(evidence)

        if (!validationResult.valid && validationResult.errors.length > 0) {
          setState((prev) => ({
            ...prev,
            evidence,
            validationResult,
            error: 'Validation failed. Please review errors below.',
            step: 'upload',
            isLoading: false,
          }))
          return
        }

        // Get certification scores
        setState((prev) => ({
          ...prev,
          evidence,
          validationResult,
          step: 'scoring',
        }))

        const scores = await api.getCertificationScores(evidence, validationResult)

        setState((prev) => ({
          ...prev,
          scores,
          step: 'complete',
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
          step: 'upload',
          isLoading: false,
        }))
      }
    },
    [api]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/json': ['.json'],
    },
    multiple: false,
  })

  const handleReset = () => {
    setState({
      evidence: null,
      validationResult: null,
      scores: null,
      error: null,
      isLoading: false,
      step: 'upload',
    })
  }

  return (
    <div className="space-y-8">
      {state.step !== 'complete' && (
        <div
          {...getRootProps()}
          className={`rounded-lg border-2 border-dashed px-8 py-12 text-center transition-colors ${
            isDragActive
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <input {...getInputProps()} />
          <svg
            className="mx-auto mb-4 h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V16z"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 20h40M24 12v16m-6-6l6 6 6-6"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isDragActive ? (
            <p className="text-blue-600 font-medium">Drop evidence bundle here...</p>
          ) : (
            <>
              <p className="text-gray-700 font-medium">
                Drag evidence bundle here or click to select
              </p>
              <p className="mt-1 text-sm text-gray-500">
                JSON file with model metadata, data governance, explainability, robustness, and operational details
              </p>
            </>
          )}
        </div>
      )}

      {state.isLoading && (
        <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-300 border-t-blue-600"></div>
            <div>
              <p className="font-medium text-blue-900">
                {state.step === 'validating' && 'Validating evidence...'}
                {state.step === 'scoring' && 'Calculating certification scores...'}
              </p>
              <p className="mt-1 text-sm text-blue-700">
                This may take a moment
              </p>
            </div>
          </div>
        </div>
      )}

      {state.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <h3 className="font-semibold text-red-900 mb-2">Validation Failed</h3>
          <p className="text-red-700 text-sm mb-4">{state.error}</p>
          {state.validationResult && state.validationResult.errors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-red-900">Errors:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                {state.validationResult.errors.map((err, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-red-500">•</span>
                    <span>
                      <strong>{err.field}:</strong> {err.message}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {state.validationResult && !state.validationResult.valid && state.validationResult.warnings.length > 0 && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">Warnings</h3>
          <ul className="space-y-1 text-sm text-yellow-700">
            {state.validationResult.warnings.map((warn, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="mt-0.5 text-yellow-600">⚠</span>
                <span>
                  <strong>{warn.field}:</strong> {warn.message}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {state.scores && (
        <div className="space-y-6">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <h3 className="font-semibold text-green-900">Certification Successful! 🎉</h3>
            <p className="mt-1 text-sm text-green-700">
              Your model has been evaluated and certified. Below are your certification scores.
            </p>
          </div>

          <ScoreRadar scores={state.scores} />

          <div className="flex gap-4">
            <button
              onClick={handleReset}
              className="flex-1 rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-800 hover:bg-gray-300 transition-colors"
            >
              Upload Another
            </button>
            <button
              className="flex-1 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Issue Attestation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

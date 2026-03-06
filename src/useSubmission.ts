import { useState, useRef } from 'react';
import { submitForm, SubmissionData, ApiResponse } from './api';

export type SubmissionState = 'idle' | 'pending' | 'success' | 'error';

interface UseSubmissionResult {
  state: SubmissionState;
  error: string | null;
  submit: (data: SubmissionData) => Promise<void>;
  reset: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

export function useSubmission(): UseSubmissionResult {
  const [state, setState] = useState<SubmissionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const pendingSubmission = useRef<string | null>(null);

  const submit = async (data: SubmissionData) => {
    const submissionId = `${data.email}_${data.amount}_${Date.now()}`;
    
    if (pendingSubmission.current) {
      return;
    }

    pendingSubmission.current = submissionId;
    setState('pending');
    setError(null);

    let attempts = 0;
    
    while (attempts < MAX_RETRIES) {
      try {
        await submitForm(data);
        setState('success');
        pendingSubmission.current = null;
        return;
      } catch (err) {
        attempts++;
        
        if (attempts >= MAX_RETRIES) {
          setState('error');
          setError('Failed after multiple attempts. Please try again.');
          pendingSubmission.current = null;
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempts));
      }
    }
  };

  const reset = () => {
    setState('idle');
    setError(null);
    pendingSubmission.current = null;
  };

  return { state, error, submit, reset };
}

export interface SubmissionData {
  email: string;
  amount: number;
}

export interface ApiResponse {
  success: boolean;
  id: string;
  data: SubmissionData;
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function submitForm(data: SubmissionData): Promise<ApiResponse> {
  const random = Math.random();
  
  if (random < 0.3) {
    await delay(Math.random() * 1000 + 500);
    throw new Error('Service temporarily unavailable');
  }
  
  if (random < 0.6) {
    await delay(Math.random() * 5000 + 5000);
  } else {
    await delay(Math.random() * 1000 + 500);
  }
  
  return {
    success: true,
    id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    data
  };
}

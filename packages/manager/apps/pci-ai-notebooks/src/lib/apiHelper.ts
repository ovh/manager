import { AIError } from '@/data/api';

export function getAIApiErrorMessage(err: AIError): string {
  if (err.response.data.details?.message) {
    return err.response.data.details.message;
  }
  if (err.response.data.message) {
    return err.response.data.message;
  }
  return 'unknown error';
}

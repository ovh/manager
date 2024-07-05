import { CdbError } from '@/data/api/database';

export function getCdbApiErrorMessage(err: CdbError): string {
  if (err.response.data.details?.message) {
    return err.response.data.details.message;
  }
  if (err.response.data.message) {
    return err.response.data.message;
  }
  return 'unknown error';
}

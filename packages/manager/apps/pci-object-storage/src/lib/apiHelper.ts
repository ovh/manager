import { ObjStoError } from '@/data/api';

export function getObjectStoreApiErrorMessage(err: ObjStoError): string {
  if (err.response.data.details?.message) {
    return err.response.data.details.message;
  }
  if (err.response.data.message) {
    return err.response.data.message;
  }
  return 'unknown error';
}

import { OkmsCredential } from '@/types/okmsCredential.type';

export const getCredentialTypeLabel = (credential: OkmsCredential) =>
  credential.certificateType === 'EC' ? 'ECDSA' : credential.certificateType;

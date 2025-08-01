/*
 * CREDENTIAL
 */
export type OkmsCredential = {
  createdAt: string;
  id: string;
  name: string;
  certificatePEM?: string;
  description?: string;
  expiredAt: string;
  fromCSR: boolean;
  identityURNs: string[];
  status: OkmsCredentialStatus;
  privateKeyPEM?: string;
  certificateType: CertificateType;
};

/*
CREDENTIAL STATUS
*/
export enum OkmsCredentialStatus {
  creating = 'CREATING',
  deleting = 'DELETING',
  error = 'ERROR',
  expired = 'EXPIRED',
  ready = 'READY',
}

export type CertificateType = 'ECDSA' | 'RSA';

export type OkmsCredentialCreation = {
  name: string;
  identityURNs: string[];
  description?: string | null;
  validity?: number;
  csr?: string;
  certificateType?: CertificateType;
};

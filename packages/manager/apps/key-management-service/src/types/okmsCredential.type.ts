/*
 * CREDENTIAL
 */
export type OkmsCredential = {
  createdAt: string;
  id: string;
  name?: string;
  certificatePEM?: string;
  description?: string;
  expiredAt: number;
  fromCSR: boolean;
  identityURNs: string[];
  status: OkmsCredentialStatus;
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

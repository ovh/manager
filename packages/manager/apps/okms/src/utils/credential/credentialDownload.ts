import {
  OkmsCredential,
  OkmsCredentialStatus,
} from '@/types/okmsCredential.type';

export const isDownloadCredentialDisabled = (
  credentialStatus: OkmsCredential['status'],
) => {
  return (
    credentialStatus === OkmsCredentialStatus.creating ||
    credentialStatus === OkmsCredentialStatus.deleting
  );
};

export const getDownloadCredentialParameters = (credential: OkmsCredential) => {
  return {
    href: credential.certificatePEM
      ? `data:text/plain;charset=utf-8,${encodeURIComponent(
          credential.certificatePEM.replace(/\n/g, '\r\n'),
        )}`
      : undefined,
    filename: `${credential.id}_certificate.pem`,
    isDisabled: isDownloadCredentialDisabled(credential.status),
  };
};

import { ColumnSort } from '@ovhcloud/manager-components';
import apiClient from '@ovh-ux/manager-core-api';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { sortCredentials } from '@/utils/credential/credentialDatagridSort';

/**
 *  Get okms Credential list
 */

export const getOkmsCredentials = async (
  okmsId: string,
): Promise<{ data: OkmsCredential[] }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential`);
};

export const getOkmsCredentialsQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/credential`,
];

export const sortOkmscredentials = (
  credentials: OkmsCredential[],
  sorting: ColumnSort,
): OkmsCredential[] => {
  const data = [...credentials];

  if (sorting) {
    const { id: sortKey, desc } = sorting;

    data.sort(sortCredentials(sortKey as keyof OkmsCredential));
    if (desc) {
      data.reverse();
    }
  }

  return data;
};

/**
 *  Get okms Credential
 */

export const getOkmsCredentialQueryKey = ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => [`get/okms/resource/${okmsId}/credential/${credentialId}`];

export const getOkmsCredential = async ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}): Promise<{ data: OkmsCredential }> => {
  return apiClient.v2.get(`okms/resource/${okmsId}/credential/${credentialId}`);
};

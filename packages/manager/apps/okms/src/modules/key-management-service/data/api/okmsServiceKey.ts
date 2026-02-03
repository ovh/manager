import {
  OkmsServiceKey,
  OkmsServiceKeyPostPayload,
  OkmsServiceKeyPutPayload,
  OkmsServiceKeyWithData,
} from '@key-management-service/types/okmsServiceKey.type';

import apiClient from '@ovh-ux/manager-core-api';

/**
 *  Get okms ServiceKey list
 */

export const getListingOkmsServiceKey = async (okmsId: string): Promise<OkmsServiceKey[]> => {
  const { data } = await apiClient.v2.get<OkmsServiceKey[]>(`okms/resource/${okmsId}/serviceKey`);
  return data;
};

export const getOkmsServiceKeyResourceListQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/serviceKey`,
];

/**
 *  Get okms ServiceKey
 */

export const getOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`get/okms/resource/${okmsId}/serviceKey/${keyId}?format=JWK`];

export const getOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}): Promise<OkmsServiceKeyWithData> => {
  const { data } = await apiClient.v2.get<OkmsServiceKeyWithData>(
    `okms/resource/${okmsId}/serviceKey/${keyId}?format=JWK`,
  );
  return data;
};

/**
 *  update okms Servicekey
 */

export const updateOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`put/okms/resource/${okmsId}/serviceKey/${keyId}/editName`];

export const updateOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
  data,
}: {
  okmsId: string;
  keyId: string;
  data: OkmsServiceKeyPutPayload;
}) => {
  await apiClient.v2.put(`okms/resource/${okmsId}/serviceKey/${keyId}`, data);
};

/**
 *  Delete okms ServiceKey
 */

export const deleteOkmsServiceKeyResourceQueryKey = ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => [`okms/resource/${okmsId}/serviceKey/${keyId}/delete`];

export const deleteOkmsServiceKeyResource = async ({
  okmsId,
  keyId,
}: {
  okmsId: string;
  keyId: string;
}) => {
  await apiClient.v2.delete(`okms/resource/${okmsId}/serviceKey/${keyId}`);
};

/**
 *  create okms Servicekey
 */

export const createOkmsServiceKeyResourceQueryKey = ({ okmsId }: { okmsId: string }) => [
  `put/okms/resource/${okmsId}/serviceKey/create`,
];

export const createOkmsServiceKeyResource = async ({
  okmsId,
  data,
}: {
  okmsId: string;
  data: OkmsServiceKeyPostPayload;
}) => {
  const { data: response } = await apiClient.v2.post<OkmsServiceKey>(
    `okms/resource/${okmsId}/serviceKey`,
    data,
  );
  return response;
};

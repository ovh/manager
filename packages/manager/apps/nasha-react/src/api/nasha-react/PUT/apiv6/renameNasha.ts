import apiClient from '@ovh-ux/manager-core-api';
/*
type PostData = {
  customName: string;
};
*/
// to fix type { QueryFunctionContext } from '@tanstack/react-query'
// eslint-disable-next-line
export default async function renameNasha({ queryKey }: any) {
  const { serviceName, data } = queryKey[1];
  const response = await apiClient.v6.put(
    `/dedicated/nasha/${serviceName}`,
    data,
  );
  return response.data;
}

import { getmeTaskDomainId } from '@/data/api/web-domain-dns-ongoing-operations';

export const useGetDomainData = async (id: string) => {
  const response = await getmeTaskDomainId(id);
  return response.data;
};

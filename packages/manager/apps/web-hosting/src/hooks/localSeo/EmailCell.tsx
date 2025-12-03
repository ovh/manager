import { useGetHostingLocalSeoAccount } from '@/data/hooks/webHostingLocalSeo/useWebHostingLocalSeo';

export const EmailCell = ({
  serviceName,
  accountId,
}: {
  serviceName: string;
  accountId: string;
}) => {
  const { data } = useGetHostingLocalSeoAccount(serviceName, accountId);
  return <div>{data?.email}</div>;
};

import { fetchIcebergV2 } from "@ovh-ux/manager-core-api";

type IamResource = {
  id: string;
  urn: string;
  name: string;
  displayName: string;
  type: string;
  owner: string;
};

export const fetchAccountUrn = async (): Promise<string> => {
  const { data } = await fetchIcebergV2<IamResource>({
    route: '/iam/resource?resourceType=account',
  });
  /*
  const { data } = await v2.get(
    '/iam/resource?resourceType=account',
    { adapter: 'fetch',fetchOptions: { priority: 'low' } },
  );
   */
  return data[0]?.urn;
};

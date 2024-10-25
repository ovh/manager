import { fetchIcebergV6, FilterComparator } from "@ovh-ux/manager-core-api";

const fetchAgreementsUpdates = async () => {
  const { data } = await fetchIcebergV6({
    route: '/me/agreements',
    filters: [{ key: 'agreed', comparator: FilterComparator.IsIn, value: ['todo', 'ko'] }],
  });
  return data;
};

export default fetchAgreementsUpdates;

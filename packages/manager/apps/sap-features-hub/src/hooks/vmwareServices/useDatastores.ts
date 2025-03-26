import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  TGetClusterParams,
  getDatastores,
  getVsanDatastores,
} from '@/data/api/vmwareServices';
import { FormattedDatastore } from '@/types/datastore.type';
import { formatDatastore } from '@/utils/formatDatastore';

export const useDatastores = ({
  serviceName,
  datacenterId,
  clusterId,
}: TGetClusterParams): UseQueryResult<FormattedDatastore[], Error> =>
  useQuery({
    queryKey: [
      'vmwareServices',
      serviceName,
      'datacentres',
      datacenterId,
      'datastores',
    ],
    queryFn: async () => {
      const [datastores, vsanDatastores] = await Promise.all([
        getDatastores({ serviceName, datacenterId }),
        getVsanDatastores({ serviceName, datacenterId, clusterId }),
      ]);

      return [...datastores.data, ...vsanDatastores.data].map((datastore) =>
        formatDatastore(datastore),
      );
    },
  });

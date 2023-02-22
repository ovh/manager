import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Heading } from '@chakra-ui/react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import {
  fetchNashaDetails,
  fetchNashaPartition,
  fetchNashaServiceInfos,
  renameNasha,
  createNashaPartition,
} from '../../../api/nasha-react';

const queryClient = new QueryClient();

function Partition(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['partitions', { serviceName }],
    fetchNashaPartition,
  );
  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }
  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
    </>
  );
}

function Informations(props: { serviceName: string }) {
  const { serviceName } = props;
  const [serviceRename, setServiceRename] = useState(serviceName);
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    fetchNashaDetails,
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }

  const handleClickRename = async () => {
    try {
      const response = await renameNasha({
        queryKey: [
          'renameService',
          {
            serviceName,
            data: { customName: serviceRename },
          },
        ],
      });

      // handle successful response here
      // eslint-disable-next-line
      console.log('Service renamed:', response);
    } catch (error) {
      // handle error here
      // eslint-disable-next-line
      console.error('Error renaming service:', error);
    }
  };

  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
      <ul>
        <input
          type="text"
          value={serviceRename}
          onChange={(e) => setServiceRename(e.target.value)}
        />
        <button onClick={handleClickRename}>Modifier</button>
      </ul>
    </>
  );
}

function Configuration(props: { serviceName: string }) {
  const { serviceName } = props;
  type PostData = {
    partitionDescription: string | null;
    partitionName: string;
    size: number;
    protocol: string;
  };
  const [partitionData, setPartitionData] = useState<PostData>({
    partitionDescription: '',
    partitionName: 'partition-name',
    size: 10,
    protocol: 'NFS',
  });
  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    fetchNashaDetails,
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }

  const handleClickPartition = async () => {
    try {
      const response = await createNashaPartition({
        queryKey: [
          'createPartition',
          {
            serviceName,
            data: partitionData,
          },
        ],
      });
      // handle successful response here
      // eslint-disable-next-line
      console.log('creating partition:', response);
    } catch (error) {
      // handle error here
      // eslint-disable-next-line
      console.error('Error creating partition:', error);
    }
  };

  return (
    <>
      <ul>
        {data.use.used.value} / {data.use.size.value} {data.use.size.unit}
      </ul>
      <ul>
        <input
          type="text"
          value={partitionData.partitionName}
          onChange={(e) =>
            setPartitionData({
              ...partitionData,
              partitionName: e.target.value,
            })
          }
        />
        <input
          type="text"
          value={partitionData.partitionDescription}
          onChange={(e) =>
            setPartitionData({
              ...partitionData,
              partitionDescription: e.target.value,
            })
          }
        />
        <input
          type="text"
          value={partitionData.size}
          onChange={(e) =>
            setPartitionData({ ...partitionData, size: Number(e.target.value) })
          }
        />
        <input
          type="text"
          value={partitionData.protocol}
          onChange={(e) =>
            setPartitionData({ ...partitionData, protocol: e.target.value })
          }
        />
        <button onClick={handleClickPartition}>Créer</button>
      </ul>
    </>
  );
}

function Abonnement(props: { serviceName: string }) {
  const { serviceName } = props;
  const { isLoading, isError, data } = useQuery(
    ['serviceInfos', { serviceName }],
    fetchNashaServiceInfos,
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error...</span>;
  }

  const count = data?.length;
  if (count === 0) {
    return <></>;
  }
  return (
    <>
      <ul>{JSON.stringify(data)}</ul>
      <ul>
        <button>Configurer le renouvellement</button>
        <button>Anticiper le paiement</button>
        <button>Configurer le renouvellement</button>
      </ul>
    </>
  );
}

export default function NashaReactDashboard() {
  const { t } = useTranslation('nasha-react/details/dashboard');
  const { serviceName } = useParams();

  return (
    <div>
      <Heading as="h3" size="sm">
        {t('title')}
      </Heading>
      <QueryClientProvider client={queryClient}>
        <hr />
        <h2>Informations générales</h2>
        <div>
          <h3>Partitions</h3>
          <Partition serviceName={serviceName} />
          <h3>Informations</h3>
          <Informations serviceName={serviceName} />
          <h3>Configuration</h3>
          <Configuration serviceName={serviceName} />
          <h3>Abonnement</h3>
          <Abonnement serviceName={serviceName} />
        </div>
      </QueryClientProvider>
    </div>
  );
}

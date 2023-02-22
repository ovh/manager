import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchNashaDetails,
  createNashaPartition,
} from '../../../api/nasha-react';

function Configurations(props: { serviceName: string }) {
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

export default Configurations;

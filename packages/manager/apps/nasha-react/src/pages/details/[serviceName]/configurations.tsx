import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { service, createNashaPartition } from '../../../api/nasha-react';

function Configurations(props: any) {
  const { serviceName } = props;
  const [partitionData, setPartitionData] = useState({
    partitionDescription: '',
    partitionName: 'partition-name',
    size: 10,
    protocol: 'NFS',
  });

  const { isLoading, isError, data } = useQuery(
    ['informations', { serviceName }],
    service,
  );

  if (isLoading) return <span>Loading...</span>;
  if (isError) return <span>Error...</span>;
  if (data?.length === 0) return <></>;

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
      console.log('creating partition:', response);
      // handle successful response here
    } catch (error) {
      console.error('Error creating partition:', error);
      // handle error here
    }
  };

  return (
    <>
      <div className="element">
        {data.use.used.value} / {data.use.size.value} {data.use.size.unit}
      </div>
      <div className="element">
        <div>
          <osds-input
            type="text"
            value={partitionData.partitionName}
            onChange={(e) =>
              setPartitionData({
                ...partitionData,
                partitionName: e.target.value,
              })
            }
          />
          <osds-input
            type="text"
            value={partitionData.partitionDescription}
            onChange={(e) =>
              setPartitionData({
                ...partitionData,
                partitionDescription: e.target.value,
              })
            }
          />
          <osds-input
            type="text"
            value={partitionData.size}
            onChange={(e) =>
              setPartitionData({
                ...partitionData,
                size: Number(e.target.value),
              })
            }
          />
          <osds-input
            type="text"
            value={partitionData.protocol}
            onChange={(e) =>
              setPartitionData({ ...partitionData, protocol: e.target.value })
            }
          />
        </div>
        <osds-link
          color="primary"
          href=""
          rel=""
          target="_self"
          class="hydrated"
          onClick={handleClickPartition}
        >
          <span slot="start"></span>
          Créer une partition
          <span slot="end">
            <osds-icon
              name="arrow-right"
              size="xs"
              color="primary"
              aria-hidden=""
              alt=""
              aria-name=""
              class="hydrated"
            ></osds-icon>
          </span>
        </osds-link>
      </div>
    </>
  );
}

export default Configurations;

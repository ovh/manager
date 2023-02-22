import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNashaDetails, renameNasha } from '../../../api/nasha-react';

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

export default Informations;

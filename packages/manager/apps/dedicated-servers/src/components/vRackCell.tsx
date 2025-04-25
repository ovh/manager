import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useGetVrack } from '@/hooks/useGetVrack';
import { SkeletonCell } from './skeletonCell';
import { DedicatedServer } from '@/data/types/server.type';

export const DSVrack = (server: DedicatedServer) => {
  const { vrack, isLoading, error } = useGetVrack({ server: server.name });

  return (
    <SkeletonCell isLoading={isLoading} error={error}>
      {vrack?.[0] ? <DataGridTextCell>{vrack[0]}</DataGridTextCell> : <>-</>}
    </SkeletonCell>
  );
};

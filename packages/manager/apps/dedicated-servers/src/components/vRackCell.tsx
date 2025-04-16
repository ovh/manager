import React from 'react';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { useGetVrack } from '@/hooks/useGetVrack';
import { SkeletonCell } from './skeletonCell';

export type VrackProps = {
  server: string;
};

export const DSVrack = ({ server }: VrackProps) => {
  const { vrack, isLoading, error } = useGetVrack({ server });

  return (
    <SkeletonCell isLoading={isLoading} error={error}>
      {vrack?.[0] ? <DataGridTextCell>{vrack[0]}</DataGridTextCell> : <>-</>}
    </SkeletonCell>
  );
};

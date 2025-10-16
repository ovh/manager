import React from 'react';
import { OdsLink } from '@ovhcloud/ods-components/react';
import { SkeletonCell } from './skeletonCell';
import { useGetVrack } from '@/hooks/useGetVrack';
import { useVrackUrl } from '@/hooks/useVrackUrl';
import type { DedicatedServer } from '@/data/types/server.type';

export const DSVrack = ({name}: DedicatedServer) => {
  const { vrack = [], isLoading, error } = useGetVrack({ server: name });
  const vrackUrl = useVrackUrl(vrack[0]);
  return (
    <SkeletonCell isLoading={isLoading} error={error}>
      {vrack[0] ? (
        <OdsLink color="primary" label={vrack[0]} href={vrackUrl} />
      ) : (
        <>-</>
      )}
    </SkeletonCell>
  );
};

import React from 'react';
import { SkeletonCell } from '../skeletonCell';
import { useGetTemplateInfos } from '@/hooks/useGetTemplateInfo';
import { DedicatedServer } from '@/data/types/server.type';

export const OsCell = (server: DedicatedServer) => {
  const { templateList, isLoading, error } = useGetTemplateInfos();
  const osTemplate =
    templateList &&
    templateList.find((item) => item.templateName === server.os);
  const osName = osTemplate ? osTemplate.description : server.os;
  return (
    templateList && (
      <SkeletonCell isLoading={isLoading} error={error}>
        {templateList ? osName : <>-</>}
      </SkeletonCell>
    )
  );
};

export default OsCell;

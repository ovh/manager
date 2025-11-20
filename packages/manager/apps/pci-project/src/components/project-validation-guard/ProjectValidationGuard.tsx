import { ReactNode } from 'react';

import { UseQueryResult } from '@tanstack/react-query';

import { useProject } from '@ovh-ux/manager-pci-common';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';

import { urls } from '@/routes/routes.constant';
import { ResponseAPIError, TProject } from '@/types/pci-common.types';

export function ProjectValidationGuard({ children }: { children: ReactNode }) {
  const { isLoading, isError } = (
    useProject as unknown as () => UseQueryResult<TProject, ResponseAPIError>
  )();
  return (
    <>
      <RedirectionGuard condition={isError} isLoading={isLoading} route={urls.root}>
        {children}
      </RedirectionGuard>
    </>
  );
}

import { ReactNode } from 'react';
import { useProject } from '@ovh-ux/manager-pci-common';
import { RedirectionGuard } from '@ovh-ux/manager-react-components';
import { urls } from '@/routes/routes.constant';

export function ProjectValidationGuard({ children }: { children: ReactNode }) {
  const { isLoading, isError } = useProject();
  return (
    <>
      <RedirectionGuard
        condition={isError}
        isLoading={isLoading}
        route={urls.root}
      >
        {children}
      </RedirectionGuard>
    </>
  );
}

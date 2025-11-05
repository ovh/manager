import { PropsWithChildren, useContext, useEffect } from 'react';

import { useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export function ProjectValidationGuard({ children }: PropsWithChildren) {
  const { navigation } = useContext(ShellContext).shell;
  const { isLoading, isError } = useProject();
  useEffect(() => {
    if (isLoading || !isError) {
      return;
    }
    navigation.navigateTo('public-cloud', '/pci/projects', {});
  }, [navigation, isLoading, isError]);

  return <>{children}</>;
}

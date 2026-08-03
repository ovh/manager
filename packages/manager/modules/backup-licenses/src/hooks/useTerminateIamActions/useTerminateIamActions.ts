import { useContext, useMemo } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { getTerminateIamActions } from '@/utils/iam.constants';

export const useTerminateIamActions = (): string[] => {
  // `getUser` is absent from the ShellContext default value, so the call has to stay optional.
  const ovhSubsidiary = useContext(ShellContext)?.environment?.getUser?.()?.ovhSubsidiary;

  return useMemo(() => getTerminateIamActions(ovhSubsidiary), [ovhSubsidiary]);
};

import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useEnvironmentRegion = (): string => useContext(ShellContext).environment.region.toLowerCase();

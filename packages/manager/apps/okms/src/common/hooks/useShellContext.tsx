import { useContext } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useShellContext = () => useContext(ShellContext);

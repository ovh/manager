import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useEnvironment = () => useContext(ShellContext).environment;

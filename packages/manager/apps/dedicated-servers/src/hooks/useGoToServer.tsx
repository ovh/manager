import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React from 'react';
import { DedicatedServer } from '@/data/types/server.type';

const useGoToServer = (server: DedicatedServer): (() => void) => {
  const { shell } = React.useContext(ShellContext);
  return () => {
    shell.navigation.navigateTo('dedicated', `#/server/${server.name}`, {});
  };
};

export default useGoToServer;

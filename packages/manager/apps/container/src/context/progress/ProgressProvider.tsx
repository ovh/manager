import React, { useEffect, useState } from 'react';

import ProgressContext from './progress.context';

import { useShell } from '@/context';

type Props = {
  children: JSX.Element | JSX.Element[];
  isStarted?: boolean;
};

export const ProgressProvider = ({
  isStarted: defaultStarted = false,
  children = null,
}: Props): JSX.Element => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');

  const [isStarted, setIsStarted] = useState(defaultStarted);

  useEffect(() => {
    uxPlugin.onProgressStart(() => {
      setIsStarted(true);
    });
    uxPlugin.onProgressStop(() => {
      setIsStarted(false);
    });
  }, []);

  const context = {
    isStarted,
  };

  return (
    <ProgressContext.Provider value={context}>
      {children}
    </ProgressContext.Provider>
  );
};

export default ProgressProvider;

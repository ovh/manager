import React, { useEffect, useState } from 'react';

import ModalsContext, { ModalsContextType, ModalTypes } from './modals.context';

import { useShell } from '@/context';

type Props = {
  children: JSX.Element | JSX.Element[];
};

export const ModalsProvider = ({ children = null }: Props): JSX.Element => {
  const shell = useShell();
  const uxPlugin = shell.getPlugin('ux');
  const [current, setCurrent] = useState<ModalTypes>(ModalTypes.kyc);

  useEffect(() => {
    uxPlugin.registerModalActionDoneListener(() => {
        setCurrent((previous) => {
          if (previous === null) {
            return null;
          }
          return (previous < ModalTypes.agreements) ? (previous + 1 as ModalTypes) : null;
        });
      });
  }, []);

  const modalsContext: ModalsContextType = {
    current,
  };

  return (
    <ModalsContext.Provider value={modalsContext}>
      {children}
    </ModalsContext.Provider>
  );
};

export default ModalsProvider;

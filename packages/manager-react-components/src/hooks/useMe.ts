import { useContext, useEffect, useState } from 'react';
import { ManagerReactComponentContext } from '../context/ManagerReactComponentsContext';

export interface IMe {
  ovhSubsidiary: string;
  currency: {
    code: string;
  };
}

export const useMe = () => {
  const mrcContext = useContext(ManagerReactComponentContext);
  const { shellContext } = mrcContext;
  const context = useContext(shellContext);
  const [me, setMe] = useState<IMe>(null);

  useEffect(() => {
    setMe(context?.environment?.getUser());
  }, [context?.environment]);

  return { me };
};

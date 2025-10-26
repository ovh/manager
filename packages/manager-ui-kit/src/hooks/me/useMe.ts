import { useContext, useEffect, useState } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { IMe } from '@/hooks/me/IMe.type';

export const useMe = () => {
  const context = useContext(ShellContext);
  const [me, setMe] = useState<IMe | null>(null);

  useEffect(() => {
    setMe(context?.environment?.getUser());
  }, [context?.environment]);

  return { me };
};

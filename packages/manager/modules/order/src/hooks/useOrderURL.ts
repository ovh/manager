import React from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ORDER_URLS } from '../order.constant';

type Environment = {
  getRegion: () => keyof typeof ORDER_URLS; // "EU" | "CA" | "US"
  getUser: () => { ovhSubsidiary: string };
};

export const useOrderURL = (product: keyof typeof ORDER_URLS.EU) => {
  const { environment } = React.useContext(ShellContext) as { environment: Environment };

  const region = environment.getRegion();
  const user = environment.getUser();

  return ORDER_URLS[region]?.[product]?.[user.ovhSubsidiary] ?? '';
};

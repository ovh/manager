import React from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ORDER_URLS } from '../order.constant';

export const useOrderURL = (product: keyof typeof ORDER_URLS.EU) => {
  const { environment } = React.useContext(ShellContext);
  const region = environment.getRegion();
  const user = environment.getUser();

  return (ORDER_URLS[region]?.[product]?.[user.ovhSubsidiary] as string) || '';
};

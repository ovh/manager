import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useCatalogIps } from './useCatalogIps';

export const useAvailableGeolocationFromPlanCode = (planCode: string) => {
  const { environment } = React.useContext(ShellContext);
  const { data, ...query } = useCatalogIps(environment.user.ovhSubsidiary);
  const selectedPlan = data?.data?.plans?.find(
    (plan) => plan.planCode === planCode,
  );

  return {
    ...query,
    geolocations: selectedPlan?.details.product.configurations
      .find((config) => config.name === 'country')
      ?.values.map((v) => v.toLowerCase()),
  };
};

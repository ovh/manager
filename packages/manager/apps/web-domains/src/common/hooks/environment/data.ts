import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useGetEnvironmentData = () => {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();

  return { region, ovhSubsidiary };
};

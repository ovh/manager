import { Subsidiary } from '@ovh-ux/manager-config';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

export const useGetUser = (): { ovhSubsidiary: Subsidiary } => {
  const environment = useEnvironment();
  return environment.getUser();
};

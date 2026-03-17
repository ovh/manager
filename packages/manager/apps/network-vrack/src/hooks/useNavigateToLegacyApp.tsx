import { useShell } from '@ovh-ux/manager-react-shell-client';

export const useNavigateToLegacyApp = () => {
  const shellContext = useShell();
  return (serviceName?: string) =>
    serviceName
      ? shellContext.navigation.navigateTo('dedicated', '#/vrack/:serviceName', { serviceName })
      : shellContext.navigation.navigateTo('dedicated', '#/vrack', {});
};

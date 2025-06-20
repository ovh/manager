import { useServiceDetails } from '@ovh-ux/manager-react-components';

export const useOkmsServiceDetails = (okmsId: string) => {
  const {
    data: okmsService,
    isLoading: isOkmsServiceLoading,
    isError: isOkmsServiceError,
  } = useServiceDetails({ resourceName: okmsId });

  return {
    okmsService: okmsService?.data,
    isOkmsServiceLoading,
    isOkmsServiceError,
    // Some users may not have access to the services endpoint
    // And IAM permission for this is not yet implemented
    // So we handle this case by using the isError state
    hasServicesPermissions: !isOkmsServiceError,
  };
};

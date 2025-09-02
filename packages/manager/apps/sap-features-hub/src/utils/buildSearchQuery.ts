import { urls } from '@/routes/routes.constant';

export const buildSearchQuery = (
  params: Record<string, string | number | boolean>,
): string => {
  const definedParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = `${value}`;
    }
    return acc;
  }, {} as Record<string, string>);

  return Object.keys(definedParams).length
    ? `?${new URLSearchParams(definedParams)}`
    : '';
};

export const buildViewInstallationRedirectUrl = ({
  serviceName,
  taskId,
}: {
  serviceName: string;
  taskId: string;
}) =>
  serviceName && taskId
    ? `${urls.installationReport}${buildSearchQuery({ serviceName, taskId })}`
    : urls.listing;

export const buildDeleteInstallationUrl = ({
  serviceName,
  taskId,
}: {
  serviceName: string;
  taskId: string;
}) =>
  serviceName && taskId
    ? `${urls.deleteInstallation}${buildSearchQuery({ serviceName, taskId })}`
    : urls.listing;

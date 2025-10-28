import {
  generatePath,
  LoaderFunction,
  matchPath,
  PathMatch,
  redirect,
} from 'react-router-dom';
import { validate as uuidValidate } from 'uuid';

type RedirectPattern = {
  expectedPath: string;
  redirectPath: string;
  queryParams?: string[];
};

const REDIRECT_ROUTES: RedirectPattern[] = [
  {
    expectedPath: '/pci/projects/:projectId/instances/:instanceId',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId',
  },
  {
    expectedPath:
      '/pci/projects/:projectId/instances/:instanceId/billing/monthly/activate',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId/billing/monthly/activate',
  },
  {
    expectedPath: '/pci/projects/:projectId/instances/:instanceId/rescue/start',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId/rescue/start',
  },
  {
    expectedPath: '/pci/projects/:projectId/instances/:instanceId/rescue/end',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId/rescue/end',
  },
  {
    expectedPath: '/pci/projects/:projectId/instances/:instanceId/:action',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId/:action',
  },
  // use this regex to migrate listing actions if necessary
  // {expectedPath: "/pci/projects/:projectId/instances/:action", redirectPath: "/pci/projects/:projectId/instances/region/:region/:action", queryParams: ['instanceId']},
  // We sort by size to get the more precise first
].sort((a, b) => b.expectedPath.length - a.expectedPath.length);

const PARAMS_REGEX = /\/:([\w-]+)(\?)?/g;

const validateInstanceId = (match: PathMatch) => {
  if ('instanceId' in match.params) {
    return (
      typeof match.params.instanceId === 'string' &&
      uuidValidate(match.params.instanceId)
    );
  }

  return true;
};

export const instanceLegacyRedirectionLoader: LoaderFunction = ({
  request,
}) => {
  const { pathname, searchParams } = new URL(request.url);

  const matchedRoute = REDIRECT_ROUTES.find(({ expectedPath }) => {
    const match = matchPath(expectedPath, pathname);
    return match !== null && validateInstanceId(match);
  });

  if (matchedRoute) {
    const { expectedPath, redirectPath, queryParams } = matchedRoute;
    const match = matchPath(expectedPath, pathname);

    const redirectAvailableParams = {
      // Set all required parameters to null by default
      ...Object.fromEntries(
        [...redirectPath.matchAll(PARAMS_REGEX)].map(
          ([, paramName]) => [paramName, 'null'] as [string, string],
        ),
      ),
      // If available from search params we use it
      ...Object.fromEntries(searchParams.entries()),
      // Match params has the bigger priority
      ...((match as PathMatch).params as Record<string, string>),
    };

    const search = new URLSearchParams(
      queryParams
        ?.map((param) => [param, redirectAvailableParams[param]])
        .filter((param): param is [string, string] => !!param[1]),
    );
    const redirectUrl = generatePath(
      redirectPath,
      redirectAvailableParams,
    ).concat(search.size > 0 ? `?${search.toString()}` : '');

    return redirect(redirectUrl);
  }

  return null;
};

import {
  generatePath,
  LoaderFunction,
  matchPath,
  redirect,
} from 'react-router-dom';

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
    expectedPath: '/pci/projects/:projectId/instances/:instanceId/:action',
    redirectPath:
      '/pci/projects/:projectId/instances/region/:region/instance/:instanceId/:action',
  },
  // use this regex to migrate listing actions if necessary
  // {expectedPath: "/pci/projects/:projectId/instances/:action", redirectPath: "/pci/projects/:projectId/instances/region/:region/:action", queryParams: ['instanceId']},
  // We sort by size to get the more precise first
].sort((a, b) => b.expectedPath.length - a.expectedPath.length);

const PARAMS_REGEX = /\/:([\w-]+)(\?)?/g;

export const instanceLegacyRedirectionLoader: LoaderFunction = ({
  request,
}) => {
  const { pathname, searchParams } = new URL(request.url);

  for (let i = 0; i < REDIRECT_ROUTES.length; i += 1) {
    const { expectedPath, redirectPath, queryParams } = REDIRECT_ROUTES[i];

    const match = matchPath(expectedPath, pathname);

    if (match !== null) {
      const redirectAvailableParams = {
        // Set all required parameters to null by default
        ...Object.fromEntries(
          [...redirectPath.matchAll(PARAMS_REGEX)]
            .map(([, paramName]) => paramName)
            .map((paramName) => [paramName, 'null']),
        ),
        // If available from search params we use it
        ...Object.fromEntries(searchParams.entries()),
        // Match params has the bigger priority
        ...(match.params as Record<string, string>),
      };

      const search = new URLSearchParams(
        queryParams?.map((param) => [param, redirectAvailableParams[param]]),
      );
      const redirectUrl = generatePath(
        redirectPath,
        redirectAvailableParams,
      ).concat(search.size > 0 ? `?${search.toString()}` : '');

      return redirect(redirectUrl);
    }
  }

  return null;
};

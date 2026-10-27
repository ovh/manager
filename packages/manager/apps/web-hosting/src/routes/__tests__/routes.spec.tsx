import { createRoutesFromElements, matchRoutes } from 'react-router-dom';

import { describe, expect, it } from 'vitest';

import Routes from '@/routes/routes';
import { subRoutes, urls } from '@/routes/routes.constants';
import {
  ASSOCIATE_GIT,
  DELETE_GIT,
  DELETE_MODULE,
  DELETE_SITE,
  DEPLOYE_GIT,
  LAST_DEPLOYEMENT_GIT,
} from '@/utils/tracking.constants';

const routes = createRoutesFromElements(Routes);

// a website directory can be named like any static segment of the app (e.g. "modify-cdn")
const staticSegments = [
  ...new Set(
    Object.values(urls)
      .flatMap((url) => url.split('/'))
      .filter((segment) => segment && !segment.startsWith(':') && segment !== subRoutes.path),
  ),
];
const directories = ['bacasable/public', '/www', '/www/multisite', '.', ...staticSegments];

describe('website path routes', () => {
  it.each([
    [ASSOCIATE_GIT, urls.associateGit],
    [DELETE_GIT, urls.deleteGit],
    [DEPLOYE_GIT, urls.deployeGit],
    [LAST_DEPLOYEMENT_GIT, urls.lastDeploymentGit],
    [DELETE_SITE, urls.deleteSite],
    [DELETE_MODULE, urls.deleteModule],
  ])('should match %s whatever the website directory is', (routeId, url) => {
    const matched = directories.map((directory) => {
      const pathname = url
        .replace(subRoutes.serviceName, 'test-service')
        .replace(subRoutes.path, directory);
      const match = matchRoutes(routes, pathname)?.pop();
      return [match?.route.id, match?.params['*']];
    });

    expect(matched).toEqual(directories.map((directory) => [routeId, directory]));
  });
});

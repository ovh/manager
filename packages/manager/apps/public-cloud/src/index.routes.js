import { kebabCase } from 'lodash';
import { LINK_PREFIX } from './index.constants';
import { useDeepLinks } from './index.links';
import links from './links.json';

export default /* @ngInject */ (
  $stateProvider,
  $urlRouterProvider,
  ovhShell,
) => {
  $stateProvider.state('app', {
    url: '/',
    redirectTo: 'app.redirect',
    resolve: {
      rootState: () => 'app',
    },
  });

  /* --------------------------- Deep linking set up -------------------------- */

  useDeepLinks({ $stateProvider, ovhShell }).register({
    links,
    params: {
      project: /* @ngInject */ ($q, publicCloud) => {
        return $q
          .all([
            publicCloud.getDiscoveryProject(),
            publicCloud.getDefaultProject(),
            publicCloud.getUnpaidProjects(),
          ])
          .then(([discoveryProject, defaultProject, unPaidProjects]) => {
            if (
              unPaidProjects.length > 0 ||
              (!discoveryProject && !defaultProject)
            ) {
              throw new Error();
            }
            return discoveryProject || defaultProject;
          });
      },
    },
    options: {
      stateName: ({ link }) => kebabCase(`${LINK_PREFIX}-${link.public.path}`),
    },
    otherwise: 'app.redirect',
  });

  /**
   * Using redirectTo and using future states, this triggers the lazy loading mechanism which will,
   * once the state is loaded, execute a retry on the transition (https://github.com/ui-router/core/blob/master/src/hooks/lazyLoad.ts#L32-L67 )
   *
   * If we have some API calls in the redirectTo, calls are repeated.
   * We can't use resolvables on the state that use redirectTo because resolves are executed once the state is entered, which is not the case.
   *
   * So this is a sort of hack : create an isolated state (without children), and in his resolves we use $state.go.
   * This state shouldn't have sub states or you should override `redirect` resolve.
   */
  $stateProvider.state('app.redirect', {
    url: '?onboarding',
    resolve: {
      redirect: /* @ngInject */ ($state) =>
        $state.go('pci.projects.onboarding'),
    },
  });

  $urlRouterProvider.otherwise('/');
};

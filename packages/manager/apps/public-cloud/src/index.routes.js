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

  /* -------------------------------------------------------------------------- */
  /*                                DEV / QA ONLY                               */
  /* -------------------------------------------------------------------------- */

  $stateProvider.state('test-links', {
    url: '/test-links',
    controller: class {
      /* @ngInject */
      constructor($scope) {
        $scope.publicURL = [];
        $scope.links = links;
        $scope.links.forEach((link, i) => {
          ovhShell.navigation
            .getURL(link.public.application, link.public.path)
            .then((url) => {
              $scope.publicURL[i] = url;
            });
        });
      }
    },
    template: `
      <div class="h-100 p-3" style="overflow: scroll;">
        <table class="oui-table oui-table-responsive" style="width: 1px;">
          <thead>
            <tr>
              <th class="oui-table__header p-2">Product</th>
              <th class="oui-table__header p-2">Link</th>
            </tr>
          </thead>
          <tbody>
            <tr class="oui-table__row" ng-repeat="(index, link) in links">
              <td class="oui-table__cell p-2">
                {{ link.public.path.split('-').slice(1).join(' ') }}
              </td>
              <td class="oui-table__cell p-2">
                <oui-spinner ng-if="!publicURL[index]" size="s" />
                <a ng-if="publicURL[index]" ng-href="{{ publicURL[index] }}" target="_blank">{{ publicURL[index] }}</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
  });

  /* -------------------------------------------------------------------------- */
  /*                                DEV / QA ONLY                               */
  /* -------------------------------------------------------------------------- */

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

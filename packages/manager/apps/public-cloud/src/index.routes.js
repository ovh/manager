import { DEFAULT_PROJECT_KEY, LINKS } from './index.constants';
import { getRedirectPath, useDeepLinks } from './index.links';

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

  const registerLinks = useDeepLinks({ $stateProvider, ovhShell });

  /**
   * @type {import('./index.links').LinkParams}
   */
  const linkParams = {
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
  };

  registerLinks({
    links: LINKS,
    otherwise: 'app.redirect',
    params: linkParams,
  });

  /* -------------------------------------------------------------------------- */
  /*                                DEV / QA ONLY                               */
  /* -------------------------------------------------------------------------- */

  $stateProvider.state('link-test', {
    url: '/link-test',
    controller: class {
      /* @ngInject */
      constructor($scope, $transition$) {
        $scope.LINKS = LINKS;
        $scope.publicURL = [];
        $scope.redirectUrl = [];
        LINKS.forEach((link, i) => {
          ovhShell.navigation
            .getURL(link.public.application, link.public.path)
            .then((url) => {
              $scope.publicURL[i] = url;
            });
          $scope.publicURL[i] = getRedirectPath({
            transition: $transition$,
            link,
            params: linkParams,
          }).then((path) => {
            ovhShell.navigation
              .getURL(link.redirect.application, path)
              .then((url) => {
                $scope.redirectUrl[i] = url;
              })
              .catch(() => {
                $scope.redirectUrl[i] = 'N/A';
              });
          });
        });
      }
    },
    template: `
      <div class="h-100" style="overflow: scroll;">
        <table class="oui-table oui-table-responsive">
          <thead>
            <tr>
              <th class="oui-table__header p-3 sticky-top">Deep Links</th>
            </tr>
          </thead>
          <tbody>
            <tr class="oui-table__row" ng-repeat="(index, link) in LINKS">
              <td class="oui-table__cell p-3">
                {{ link.public.path.split('-').slice(1).join(' ') }} public URL
                <br />
                <oui-spinner ng-if="!publicURL[index]" size="s" />
                <a ng-if="publicURL[index]" ng-href="{{ publicURL[index] }}">{{ publicURL[index] }}</a>
                <br /> 
                {{ link.public.path.split('-').slice(1).join(' ') }} resulting URL
                <br />
                <oui-spinner ng-if="!redirectUrl[index]" size="s" />
                <a ng-if="redirectUrl[index]" ng-href="{{ redirectUrl[index] }}">{{ redirectUrl[index] }}</a>
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

  $stateProvider.state('redirect-kube', {
    url: '/pci/projects/default/kubernetes/new',
    redirectTo: (trans) => {
      const ovhUserPref = trans.injector().get('ovhUserPref');
      const publicCloud = trans.injector().get('publicCloud');

      return publicCloud
        .getProjects([
          {
            field: 'status',
            comparator: 'in',
            reference: ['creating', 'ok'],
          },
        ])
        .then((projects) => {
          if (projects.length > 0) {
            return ovhUserPref
              .getValue(DEFAULT_PROJECT_KEY)
              .then(({ projectId }) => ({
                state: 'pci.projects.project.kubernetes.add',
                params: {
                  projectId,
                },
              }))
              .catch(({ status }) => {
                if (status === 404) {
                  // No project is defined as favorite
                  // Go on the first one :)
                  return {
                    state: 'pci.projects.project.kubernetes.add',
                    params: {
                      projectId: projects[0].project_id,
                    },
                  };
                }
                // [TODO] Go to error page
                return null;
              });
          }
          return { state: 'pci.projects.onboarding' };
        });
    },
  });

  $urlRouterProvider.otherwise('/');
};

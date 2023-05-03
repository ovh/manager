import createPolicy from './createPolicy.route';
import deletePolicy from './deletePolicy.route';
import deleteIdentity from './deleteIdentity.route';
import editPolicy from './editPolicy.route';
import iam from './iam.route';
import policyIdentities from './policyIdentities.route';
import policies from './policies.route';
import policy from './policy.route';
import resourceGroups from './resourceGroups.route';
import deleteResourceGroup from './deleteResourceGroup.route';
import onboarding from './onboarding.route';

export default [
  {
    route: iam,
    children: [
      {
        route: policy,
        children: [
          {
            route: policies,
            children: [
              {
                route: deletePolicy,
              },
            ],
          },
          {
            route: {
              name: 'identitiesRedirection',
              state: () => ({
                url: '/identities',
                resolve: {
                  redirect: /* @ngInject */ (shellClient) =>
                    shellClient.navigation.navigateTo(
                      'dedicated',
                      '#/useraccount/users',
                    ),
                },
              }),
            },
          },
          {
            route: resourceGroups,
            children: [
              {
                route: deleteResourceGroup,
              },
            ],
          },
        ],
      },
      {
        route: createPolicy,
      },
      {
        route: editPolicy,
      },
      {
        route: policyIdentities,
        children: [
          {
            route: deleteIdentity,
          },
        ],
      },
      {
        route: onboarding,
      },
    ],
  },
];

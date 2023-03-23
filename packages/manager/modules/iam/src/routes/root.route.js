import createPolicy from './createPolicy.route';
import deletePolicy from './deletePolicy.route';
import deleteIdentity from './deleteIdentity.route';
import iam from './iam.route';
import policyIdentities from './policyIdentities.route';
import policies from './policies.route';
import policy from './policy.route';
import resourceGroup from './resourceGroup.route';
import deleteResourceGroup from './deleteResourceGroup.route';

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
            route: resourceGroup,
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
        route: policyIdentities,
        children: [
          {
            route: deleteIdentity,
          },
        ],
      },
    ],
  },
];

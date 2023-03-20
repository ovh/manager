import createPolicy from './createPolicy.route';
import deletePolicy from './deletePolicy.route';
import deleteIdentity from './deleteIdentity.route';
import iam from './iam.route';
import policyIdentities from './policyIdentities.route';
import policies from './policies.route';
import policy from './policy.route';

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

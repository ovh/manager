import createPolicy from './createPolicy.route';
import deletePolicy from './deletePolicy.route';
import iam from './iam.route';
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
    ],
  },
];

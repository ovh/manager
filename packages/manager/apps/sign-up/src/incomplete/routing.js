import component from './component';

import { NIC_STATUS_ENUM } from '../constants';

import hourglassImg from './assets/img/hourglass.png';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('sign-up.incomplete', {
    url: 'incomplete',
    views: {
      '@': {
        component: component.name,
      },
    },
    redirectTo: (transition) => {
      const mePromise = transition.injector().getAsync('me');
      return mePromise.then(({ state }) => {
        if (state !== NIC_STATUS_ENUM.INCOMPLETE) {
          return transition.router.stateService.target('sign-up', {}, {
            reload: true,
          });
        }

        return null;
      });
    },
    resolve: {
      finishHref: /* @ngInject */ $state => $state.href('sign-up'),

      hourglassImg: () => hourglassImg,
    },
  });
};

import angular from 'angular';

import get from 'lodash/get';

import confirmTerminate from '../confirm-terminate';
import dashboard from '../dashboard/dashboard.module';
import datacenters from '../datacenters';
import dedicatedCloudComponent from '../../components/dedicated-cloud';
import license from '../license';
import operation from '../operation';
import routing from './managed-baremetal.routing';
import security from '../security';
import servicePackUpgrade from '../service-pack/upgrade';
import user from '../users';

const moduleName = 'managedBaremetalModule';

angular
  .module(moduleName, [
    confirmTerminate,
    dashboard,
    datacenters,
    dedicatedCloudComponent,
    license,
    operation,
    security,
    servicePackUpgrade,
    user,
  ])
  .config(routing)
  .run(
    /* @ngInject */ ($state, $transitions) => {
      $transitions.onError({}, (transition) => {
        const error = transition.error();
        if (get(error, 'detail.code') === 460) {
          error.handled = true;
          $state.go('app.expired', {
            error,
            product: 'expired-managedBaremetal',
          });
        }
      });
    },
  );

export default moduleName;

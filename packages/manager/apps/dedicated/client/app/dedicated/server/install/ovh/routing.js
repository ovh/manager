import component from './component';
import templateComponent from './components/template/component';
import raidComponent from './components/raid/component';
import partitionComponent from './components/partition/component';
import rtmComponent from './components/rtm/component';
import optionsComponent from '../components/options/component';

import DedicatedServerInstallOvhModel from './models/ovh-install.model.class';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('app.dedicated.server.install.ovh', {
    url: '/ovh',
    views: {
      '': component.name,

      'template@app.dedicated.server.install.ovh': templateComponent.name,

      'raid@app.dedicated.server.install.ovh': {
        componentProvider: /* @ngInject */ (raidProfile) =>
          raidProfile ? raidComponent.name : null,
      },

      'partition@app.dedicated.server.install.ovh': partitionComponent.name,

      'rtm@app.dedicated.server.install.ovh': rtmComponent.name,

      'options@app.dedicated.server.install.ovh': optionsComponent.name,
    },
    resolve: {
      model: () => new DedicatedServerInstallOvhModel(),

      raidProfile: /* @ngInject */ ($q, dedicatedServerInstallOvh, server) =>
        dedicatedServerInstallOvh
          .getHardwareRaidProfile(server)
          .catch((error) => {
            if (error.status === 403) {
              return null;
            }

            return $q.reject(error);
          }),

      hardwareSpecifications: /* @ngInject */ (
        dedicatedServerInstallOvh,
        server,
      ) => dedicatedServerInstallOvh.getHardwareSpecifications(server),

      sshKeys: /* @ngInject */ (dedicatedServerInstallOvh) =>
        dedicatedServerInstallOvh.getSshKeys(),

      /* ----------  Templates loading  ----------*/

      templatesFamilies: /* @ngInject */ (dedicatedServerInstallOvh) =>
        dedicatedServerInstallOvh.getTemplatesFamilies(),

      compatibleTemplates: /* @ngInject */ (
        dedicatedServerInstallOvh,
        server,
      ) => dedicatedServerInstallOvh.getCompatibleOvhTemplates(server.name),
    },
  });
};

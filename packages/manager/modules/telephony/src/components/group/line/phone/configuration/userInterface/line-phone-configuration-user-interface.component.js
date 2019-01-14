import _ from 'lodash';
import template from './line-phone-configuration-user-interface.html';

export default {
  require: {
    configForm: '^form',
  },
  bindings: {
    configGroup: '=linePhoneConfigurationGroup',
    editMode: '=linePhoneConfigurationEditMode',
    expertMode: '=linePhoneConfigurationExpertMode',
  },
  template,
  controller() {
    const self = this;

    self.screenPages = [];
    self.fakeConfigGroup = null;
    self.currentScreenPage = 0;

    /*= ==============================
          =            HELPERS            =
          =============================== */

    self.getKeyIndex = function getKeyIndex(index) {
      return {
        number: index + (self.currentScreenPage * self.configGroup.keysPerScreen) + 1,
      };
    };

    /* -----  End of HELPERS  ------*/

    /*= =====================================
          =            INITIALIZATION            =
          ====================================== */

    self.$onInit = function $onInit() {
      const keys = _.filter(self.configGroup.configs, config => _.startsWith(config.name, 'KeyLabel')).sort((configA, configB) => {
        const matchA = parseInt(configA.name.match(/\d+/g)[0], 10);
        const matchB = parseInt(configB.name.match(/\d+/g)[0], 10);

        if (matchA < matchB) {
          return -1;
        } if (matchA > matchB) {
          return 1;
        }
        return 0;
      });
      self.screenPages = _.chunk(keys, self.configGroup.keysPerScreen);

      // build fake config group if some
      if (keys.length < self.configGroup.configs.length) {
        self.fakeConfigGroup = {
          name: [self.configGroup.name, 'fake'].join('-'),
          configs: _.filter(self.configGroup.configs, config => !_.startsWith(config.name, 'KeyLabel')),
        };
        self.fakeConfigGroup.isExpertOnly = _.every(self.fakeConfigGroup.configs, {
          level: 'expert',
        });
      }
    };

    /* -----  End of INITIALIZATION  ------*/
  },
};

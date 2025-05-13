import chunk from 'lodash/chunk';
import find from 'lodash/find';
import filter from 'lodash/filter';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';

export default /* @ngInject */ function controller(
  $scope,
  TelephonyGroupLinePhoneConfiguration,
) {
  const self = this;

  const keyConfigModel = {
    maxlength: 15,
    value: '',
    name: 'ExtLabel',
    default: '',
    description: 'Ext label',
    group: 'ExtensionKeyModule',
    level: null,
    rangeValue: null,
    enum: null,
    type: 'string',
  };

  self.modules = [];
  self.configs = null;
  self.extensionKeyModuleConfig = null;
  self.model = {
    moduleIndex: 0,
    pageIndex: 0,
  };

  /*= ==============================
        =            HELPERS            =
        =============================== */

  /**
   *  Helps to group coniguration array into module.
   *  A module is represented by an item of pagesPerModule pages arrays
   *  of keysPerPage items array.
   *
   *  @param  {Array} configs Configs list to group
   *
   *  @return {Array} Sorted list of configs grouped by modules
   */
  function groupConfigs(configs) {
    return chunk(
      chunk(
        sortBy(
          filter(configs, (config) => config.name !== 'ExtensionKeyModule'),
          (config) => parseInt(config.name.match(/\d+/g)[0], 10),
        ),
        self.configGroup.keysPerPage,
      ),
      self.configGroup.pagesPerModule,
    );
  }

  function createDynamicConfigs(moduleNumberToAdd, existingModulesCount) {
    const dynamicConfigs = [];
    let dynamicConfig;
    const startKeyNumber =
      existingModulesCount *
      self.configGroup.pagesPerModule *
      self.configGroup.keysPerPage;
    const keysNumberToAdd =
      moduleNumberToAdd *
      self.configGroup.pagesPerModule *
      self.configGroup.keysPerPage;

    for (let i = 0; i < keysNumberToAdd; i += 1) {
      dynamicConfig = angular.copy(keyConfigModel);
      dynamicConfig.name = [dynamicConfig.name, startKeyNumber + i + 1].join(
        '',
      );
      dynamicConfigs.push(
        new TelephonyGroupLinePhoneConfiguration(dynamicConfig),
      );
    }

    return dynamicConfigs;
  }

  self.getKeyIndex = function getKeyIndex(index) {
    return {
      number:
        index +
        self.model.moduleIndex * self.configGroup.keysPerPage +
        (self.model.moduleIndex * self.configGroup.keysPerPage +
          self.model.pageIndex * self.configGroup.keysPerPage) +
        1,
    };
  };

  /* -----  End of HELPERS  ------*/

  /*= =============================
      =            EVENTS            =
      ============================== */

  self.onModuleNumberChange = function onModuleNumberChange() {
    const existingModules = groupConfigs(self.configGroup.configs);

    if (self.extensionKeyModuleConfig.value > existingModules.length) {
      self.configGroup.dynamicConfigs = createDynamicConfigs(
        self.extensionKeyModuleConfig.value - existingModules.length,
        existingModules.length,
      );
      self.modules = existingModules.concat(
        groupConfigs(self.configGroup.dynamicConfigs),
      );
    } else {
      self.configGroup.dynamicConfigs = null;
      self.modules = take(existingModules, self.extensionKeyModuleConfig.value);
    }

    if (self.model.moduleIndex >= self.modules.length) {
      if (self.model.moduleIndex > 0) {
        self.model.moduleIndex -= 1;
      }
      self.model.pageIndex = 0;
    }
  };

  /* -----  End of EVENTS  ------*/

  /*= =====================================
        =            INITIALIZATION            =
        ====================================== */

  $scope.$watch('$ctrl.editMode', (curValue, prevValue) => {
    if (prevValue && !curValue) {
      // be sure modules are still visually up to date !
      self.onModuleNumberChange();
    }
  });

  self.$onInit = function $onInit() {
    self.extensionKeyModuleConfig = find(self.configGroup.configs, {
      name: 'ExtensionKeyModule',
    });

    // modules is an array representing extension key module with their pages
    self.modules = groupConfigs(self.configGroup.configs);
  };

  /* -----  End of INITIALIZATION  ------*/
}

import angular from 'angular';
import provider from './config.provider';

const moduleName = 'coreConfig';

export const registerConfigModule = (environment) => {
  angular
    .module(moduleName, [])
    .provider('coreConfig', provider)
    .config(
      /* @ngInject */ (coreConfigProvider) => {
        coreConfigProvider.setEnvironment(environment);
      },
    );
  return moduleName;
};

export default moduleName;

import angular from 'angular';
import '@ovh-ux/ui-kit';

const moduleName = 'ovhManagerCoreOuiAngularConfiguration';

angular.module(moduleName, ['oui']).config(
  /* @ngInject */ (ouiPaginationConfigurationProvider) => {
    ouiPaginationConfigurationProvider.setPageSizeList([10, 25, 50, 100, 300]);
  },
);

export default moduleName;

import angular from 'angular';
import 'ovh-ui-angular';

const moduleName = 'ovhManagerCoreOuiAngularConfiguration';

angular.module(moduleName, ['oui']).config(
  /* @ngInject */ (ouiPaginationConfigurationProvider) => {
    ouiPaginationConfigurationProvider.setPageSizeList([10, 25, 50, 100, 300]);
  },
);

export default moduleName;

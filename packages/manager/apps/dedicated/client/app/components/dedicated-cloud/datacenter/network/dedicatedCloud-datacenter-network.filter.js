import { capitalize } from 'lodash';

const moduleName = 'ovhManagerDedicatedCloudDatacenterNetworkFilter';

angular.module(moduleName, []).filter('capitalize', () => {
  return (input) => {
    if (!input) return '';
    return capitalize(input);
  };
});

export default moduleName;

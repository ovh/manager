import tile from './tile.component';

const moduleName = 'ovhManagerHubTileError';

angular
  .module(moduleName, ['oui'])
  .component('hubTileError', tile)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;

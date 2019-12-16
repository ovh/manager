import privateSqlActivation from './private-sql-activation.component';
import privateSqlActivationRouting from './private-sql-activation.routing';

const moduleName = 'ovhManagerPrivateSqlActivationModule';

angular
  .module(moduleName, [
  ])
  .component('privateSqlActivation', privateSqlActivation)
  .config(privateSqlActivationRouting)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;

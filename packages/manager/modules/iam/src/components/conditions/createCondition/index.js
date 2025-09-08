import component, { name } from './createCondition.component';
import createConditionModal from '../createConditionModal';

const moduleName = 'ovhManagerIAMCreateCondition';

angular
  .module(moduleName, [createConditionModal])
  .component(name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;

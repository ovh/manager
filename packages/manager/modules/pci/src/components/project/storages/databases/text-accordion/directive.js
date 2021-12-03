import template from './template.html';

export default /* @ngInject */ () => {
  return {
    restrict: 'E',
    controller: 'textAccordionController',
    controllerAs: 'textAccordionCtrl',
    bindToController: {
      value: '<',
    },
    template,
  };
};

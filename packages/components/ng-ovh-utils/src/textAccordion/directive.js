import template from './template.html';

export default /* @ngInject */ () => {
  return {
    restrict: 'E',
    transclude: true,
    controller: 'textAccordionController',
    controllerAs: 'ctrl',
    bindToController: {
      value: '<?',
    },
    template,
  };
};

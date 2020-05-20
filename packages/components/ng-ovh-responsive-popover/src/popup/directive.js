import template from './template.html';

export default function() {
  return {
    replace: true,
    scope: {
      uibTitle: '@',
      contentExp: '&',
      placement: '@',
      popupClass: '@',
      animation: '&',
      isOpen: '&',
      originScope: '&',
    },
    template,
  };
}

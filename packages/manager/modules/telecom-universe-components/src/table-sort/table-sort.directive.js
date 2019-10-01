import set from 'lodash/set';

export default () => ({
  restrict: 'A',
  scope: {
    tucTableSort: '&',
  },
  link(scope) {
    set(scope, '$parent.sort', {
      fieldName: null,
      descending: null,
    });
    set(scope, '$parent.tucTableSort', scope.tucTableSort);
  },
});

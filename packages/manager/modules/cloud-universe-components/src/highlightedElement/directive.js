import angular from 'angular';

export default () => ({
  restrict: 'A',
  link($scope, $elem, $attrs) {
    let ids = [];

    $attrs.$observe('cucHighlightedElement', (_ids) => {
      ids = _ids ? _ids.split(',') : [];
    });

    $scope.$on('cuc-highlighted-element.show', (e, _ids) => {
      if (!_ids || !ids.length) {
        $elem.addClass('cuc-highlighted-element-active');
      } else {
        // eslint-disable-next-line no-param-reassign
        _ids = _ids.split(',');
        angular.forEach(_ids, (item) => {
          if (~ids.indexOf(item.trim())) {
            $elem.addClass('cuc-highlighted-element-active');
          }
        });
      }
    });

    $scope.$on('cuc-highlighted-element.hide', (e, _ids) => {
      if (!_ids || !ids.length) {
        $elem.removeClass('cuc-highlighted-element-active');
      } else {
        // eslint-disable-next-line no-param-reassign
        _ids = _ids.split(',');
        angular.forEach(_ids, (item) => {
          if (~ids.indexOf(item.trim())) {
            $elem.removeClass('cuc-highlighted-element-active');
          }
        });
      }
    });
  },
});

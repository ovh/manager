angular.module('managerApp').directive('hterm', ($interval) => ({
  restrict: 'EA',
  scope: {
    sendData: '&',
    sendConfig: '&',
    term: '=',
  },
  link: (scope, element) => {
    Terminal.applyAddon(fit);
    const term = scope.term || new Terminal();

    term.on('data', (data) => {
      scope.sendData({ data });
    });

    term.on('resize', (size) =>
      scope.sendConfig({
        config: {
          columns: size.cols,
          rows: size.rows,
        },
      }),
    );

    term.open(element.context);

    const interval = $interval(() => {
      term.fit();
    }, 600);
    scope.$on('$destroy', () => {
      if (interval) {
        interval.cancel();
      }
    });
  },
}));

import angular from 'angular';

export default () => ({
  restrict: 'A',
  controller: 'TucJsplumbConnectionCtrl',
  controllerAs: '$ctrl',
  require: ['^^tucJsplumb', '^^tucJsplumbEndpoint', 'tucJsplumbConnection'],
  scope: {
    options: '=tucJsplumbConnection',
    target: '@tucJsplumbConnectionTarget',
  },
  bindToController: true,
  link(iScope, iElement, iAttrs, $ctrl) {
    const jsplumbCtrl = $ctrl[0];
    const endpointCtrl = $ctrl[1];
    const connectionCtrl = $ctrl[2];

    jsplumbCtrl.instance.setSuspendDrawing(true);

    connectionCtrl.connection = jsplumbCtrl.instance.connect(
      angular.extend(
        {
          uuids: [endpointCtrl.uuid, connectionCtrl.target],
          deleteEndpointsOnDetach: false,
        },
        connectionCtrl.options || {},
      ),
    );

    jsplumbCtrl.instance.customRepaint();

    /**
     *  Directive destroy management. Detach connection from instance.
     */
    iScope.$on('$destroy', () => {
      try {
        if (jsplumbCtrl.instance) {
          jsplumbCtrl.instance.deleteConnection(connectionCtrl.connection);
          jsplumbCtrl.instance.customRepaint();
        }
      } finally {
        /* continue regardless of error */
      }
    });

    iScope.$watch('$ctrl.target', (newTarget, oldTarget) => {
      if (oldTarget && oldTarget !== newTarget) {
        jsplumbCtrl.instance.setSuspendDrawing(true);

        // recreate connection
        connectionCtrl.connection = jsplumbCtrl.instance.connect({
          uuids: [endpointCtrl.uuid, newTarget],
        });

        jsplumbCtrl.instance.customRepaint();
      }
    });

    iScope.$watch('$ctrl.options.cssClass', (newClass, oldClass) => {
      if (newClass || oldClass) {
        if (newClass === oldClass) {
          connectionCtrl.connection.addClass(newClass);
        } else {
          connectionCtrl.connection.updateClasses(newClass, oldClass);
        }
      }
    });
  },
});

import angular from 'angular';
import debounce from 'lodash/debounce';
import filter from 'lodash/filter';
import find from 'lodash/find';
import remove from 'lodash/remove';

export default /* @ngInject */ function ($scope, $timeout, $window) {
  const self = this;

  this.getInstance = function getInstance() {
    return $scope.instance;
  };

  this.connectionForecast = [];

  // Make a connection between 2 endpoints
  this.connectEndpoints = function connectEndpoints(sourceId, targetId) {
    // If source endpoint is disabled, temporary re-enable it
    let deactiveSourceAfterConnect = false;
    if (!$scope.instance.isSourceEnabled(sourceId)) {
      deactiveSourceAfterConnect = true;
      $scope.instance.setSourceEnabled(sourceId, true);
    }

    // If target endpoint is disabled, temporary re-enable it
    let deactiveTargetAfterConnect = false;
    if (!$scope.instance.isTargetEnabled(targetId)) {
      deactiveTargetAfterConnect = true;
      $scope.instance.setTargetEnabled(targetId, true);
    }

    // If already linked (ex: temporary/dashed connection): disconnect it
    if (self.connectionExists(sourceId, targetId)) {
      self.disconnectEndpoints(sourceId, targetId);
    }

    // Let's connect!
    const connection = $scope.instance.connect({
      source: sourceId,
      target: targetId,
    });

    // Re-disable target endpoint, if it was disabled
    if (deactiveTargetAfterConnect) {
      $scope.instance.setTargetEnabled(targetId, false);
    }

    // Re-disable source endpoint, if it was disabled
    if (deactiveSourceAfterConnect) {
      $scope.instance.setSourceEnabled(sourceId, false);
    }

    return connection;
  };

  // Detach connection between 2 endpoints
  this.disconnectEndpoints = function disconnectEndpoints(
    sourceIdOrConnection,
    targetId,
  ) {
    let sourceId = sourceIdOrConnection;
    let connection = sourceIdOrConnection;
    if (!targetId) {
      // 1st param is a connection; so we need to get IDs
      sourceId = sourceIdOrConnection.sourceId; // eslint-disable-line
      targetId = sourceIdOrConnection.targetId; // eslint-disable-line
    } else {
      // Else, we have IDs, so get connection
      connection = self.getConnection(sourceId, targetId);
    }

    remove(self.connectionForecast, { sourceId, targetId });

    if (connection) {
      // If source endpoint is disabled, temporary re-enable it
      let deactiveSourceAfterConnect = false;
      if (!$scope.instance.isSourceEnabled(sourceId)) {
        deactiveSourceAfterConnect = true;
        $scope.instance.setSourceEnabled(sourceId, true);
      }

      // If target endpoint is disabled, temporary re-enable it
      let deactiveTargetAfterConnect = false;
      if (!$scope.instance.isTargetEnabled(targetId)) {
        deactiveTargetAfterConnect = true;
        $scope.instance.setTargetEnabled(targetId, true);
      }

      // Let's disconnect!
      $scope.instance.deleteConnection(connection);

      // Re-disable target endpoint, if it was disabled
      if (deactiveTargetAfterConnect) {
        $scope.instance.setTargetEnabled(targetId, false);
      }

      // Re-disable source endpoint, if it was disabled
      if (deactiveSourceAfterConnect) {
        $scope.instance.setSourceEnabled(sourceId, false);
      }
    }
    return connection;
  };

  function checkConnections(endpointId, endpointConnectionIds) {
    const targetList = [];

    // check if source is already linked to instance and find already created targets
    if ($scope.instance.isSource(endpointId)) {
      angular.forEach(endpointConnectionIds, (endpointConnectionId) => {
        if ($scope.instance.isTarget(endpointConnectionId)) {
          targetList.push(endpointConnectionId);
        }
      });
    }

    return targetList;
  }

  this.connectEndpointsMultiple = function connectEndpointsMultiple(
    sourceId,
    targetListParam,
  ) {
    let targetList = targetListParam;
    // forecast this connection
    targetList.forEach((id) => {
      if (!find(self.connectionForecast, { sourceId, targetId: id })) {
        self.connectionForecast.push({ sourceId, targetId: id });
      }
    });

    // filter target endpoints to be sure that they are already created by jsplumb
    // and that connection does not exists yet
    targetList = checkConnections(sourceId, targetList);

    // connect filtered endpoint target
    if (targetList.length) {
      angular.forEach(targetList, (targetId) => {
        // Let's connect!
        self.connectEndpoints(sourceId, targetId);
      });
    }
  };

  this.disconnectEndpointsMultiple = function disconnectEndpointsMultiple(
    sourceId,
    targetList,
  ) {
    angular.forEach(targetList, (targetId) => {
      // Let's disconnect!
      self.disconnectEndpoints(sourceId, targetId);
    });
  };

  this.getConnection = function getConnection(sourceId, targetId) {
    const connections = $scope.instance.getAllConnections();
    return (
      find(connections, { sourceId, targetId }) ||
      find(connections, { sourceId: targetId, targetId: sourceId })
    );
  };

  this.getConnections = function getConnections(id) {
    const connections = $scope.instance.getAllConnections();
    return filter(
      connections,
      (conn) => conn.sourceId === id || conn.targetId === id,
    );
  };

  this.connectionExists = function connectionExists(sourceId, targetId) {
    return !!self.getConnection(sourceId, targetId);
  };

  $scope.$on('jsplumb.endpoint.idChanged', (evt, newId, oldId) => {
    // remove old connections
    if (oldId && oldId !== newId) {
      self.getConnections(oldId).forEach((conn) => {
        self.disconnectEndpoints(conn.sourceId, conn.targetId);
      });
    }

    // Create new connections
    self.connectionForecast
      .filter((conn) => conn.sourceId === newId || conn.targetId === newId)
      .forEach((conn) => {
        $scope.instance.connect({
          source: conn.sourceId,
          target: conn.targetId,
        });
      });
  });

  $scope.$on(
    'jsplumb.endpoint.created',
    (evt, endpointId, endpointConnectionIds) => {
      self.connectEndpointsMultiple(endpointId, endpointConnectionIds);
    },
  );

  const onResizePage = debounce(() => {
    $timeout(() => {
      if ($scope.instance) {
        $scope.instance.revalidateEverything();
      }
    });
  }, 33);

  $scope.$on('$destroy', () => {
    if ($scope.instance) {
      $(window).off('resize', onResizePage);
      $scope.instance.reset();
    }
    $scope.instance = null;
  });

  $(window).on('resize', onResizePage);

  /**
   * window.on("resize") is not triggered when scrollbar appears and might cause a display bug.
   * We need to watch the window element to handle the scrollbar display. We also need to keep
   * the window.on("resize") binding because it will be triggered as soon as window is resized.
   */
  const windowElt = angular.element($window);
  $scope.$watch(
    () => ({
      h: windowElt.height(),
      w: windowElt.width(),
    }),
    onResizePage,
    true,
  );

  $scope.$on('jsplumb.endpoint.created', onResizePage);
}

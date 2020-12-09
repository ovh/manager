import forEach from 'lodash/forEach';
import isEmpty from 'lodash/isEmpty';
import mapValues from 'lodash/mapValues';
import omit from 'lodash/omit';

export default /* @ngInject */ function ($rootScope, $q, OvhApiXdsl, Poller) {
  const self = this;

  this.capabilities = {
    canBeManagedByOvh: true,
  };
  this.tasks = {};
  this.info = {};

  const pollModem = function pollModem(namespace, serviceName, callbackError) {
    function success(results) {
      self.capabilities = results.capabilities.data;

      // throw rising tasks
      forEach(results.current.data, (state, key) => {
        if (state && !self.tasks[key]) {
          self.raiseTask(key, true, true);
        }
      });

      // throw falling tasks
      forEach(self.tasks, (state, key) => {
        if (state && !results.current.data[key]) {
          self.raiseTask(key, false, true);
        }
      });
    }

    function error(err) {
      if (!isEmpty(err)) {
        callbackError(err);
      }
    }

    OvhApiXdsl.Modem()
      .Aapi()
      .poll(null, {
        xdslId: serviceName,
        namespace,
      })
      .then(success, error, success);
  };

  this.setTask = function setTask(name) {
    this.tasks[name] = true;
  };

  this.unsetTask = function unsetTask(name) {
    delete this.tasks[name];
  };

  this.disableCapabilities = function disableCapabilities() {
    this.capabilities = mapValues(this.capabilities, (val, key) => {
      if (
        ['canBeManagedByOvh', 'canChangeMtu', 'canChangeFirmware'].indexOf(key)
      ) {
        return val;
      }
      return false;
    });
  };

  this.raiseTask = function raiseTask(name, state, byPassFlag) {
    $rootScope.$broadcast(`pack_xdsl_modem_task_${name}`, state);
    if (state) {
      this.setTask(name);
    } else {
      this.unsetTask(name);
    }
    if (!byPassFlag) {
      $rootScope.$broadcast('pack_xdsl_modem_task', self.tasks);
    }
  };

  this.open = function open(serviceName, callbackError) {
    return OvhApiXdsl.Modem()
      .Aapi()
      .get({
        xdslId: serviceName,
      })
      .$promise.then((data) => {
        self.capabilities = data.capabilities;
        self.info = omit(data, ['capabilities']);
        pollModem('packXdslModemTasks', serviceName, callbackError);
        return data;
      })
      .catch((err) => $q.reject(err));
  };

  this.close = function close() {
    Poller.kill({
      namespace: 'packXdslModemTasks',
    });
  };
}

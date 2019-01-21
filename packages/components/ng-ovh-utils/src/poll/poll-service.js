import angular from 'angular';
import filter from 'lodash/filter';
import find from 'lodash/find';
import remove from 'lodash/remove';

export default /* @ngInject */ function ($q, $timeout, $http) {
  const defaultInterval = 7e3;

  const tasks = [];

  function resolveTask(task, result) {
    task.deferredObj.resolve(result);
    remove(tasks, task);
  }
  function rejectTask(task, result) {
    task.deferredObj.reject(result);
    remove(tasks, task);
  }

  function run(taskParam) {
    const task = taskParam;
    task.timeoutPromise = $timeout(() => {
      poll(task); // eslint-disable-line
    }, task.interval);
  }

  function notifyTask(taskParam, result) {
    const task = taskParam;
    task.deferredObj.notify(result);
    task.lastResult = angular.copy(result);
    run(task); // Re-launch
  }

  function poll(task) {
    $http.get(task.url, task.opts).then(
      ({ data }) => {
        const result = data;

        if (task.successRule) {
          // It's not a task, it's a specific polling

          let inSuccess = true;
          angular.forEach(task.successRule, (val, key) => {
            if (result[key] !== val) {
              inSuccess = false;
            }
          });

          if (inSuccess) {
            return resolveTask(task, result);
          }

          if (task.errorRule) {
            let inError = true;
            angular.forEach(task.errorRule, (val, key) => {
              if (result[key] !== val) {
                inError = false;
              }
            });

            if (inError) {
              return rejectTask(task, result);
            }
          }

          return notifyTask(task, result);
        }
        // It's a /task polling

        switch (result.status) {
          case 'done':
          case 'cancelled':
          case 'DONE':
          case 'CANCELLED':
            resolveTask(task, result);
            break;
          case 'customerError':
          case 'ovhError':
          case 'error':
          case 'blocked':
          case 'CUSTOMER_ERROR':
          case 'OVH_ERROR':
          case 'ERROR':
          case 'BLOCKED':
            rejectTask(task, result);
            break;
          default:
            notifyTask(task, result);
        }
        return null;
      },
      (error) => {
        if (error.status === 404) {
          // deleted
          return resolveTask(task, task.lastResult);
        }
        if (error.status !== 0) {
          // status === 0 : killed
          return rejectTask(task, error.data);
        }
        return null;
      },
    );
  }

  this.kill = function kill(pattern) {
    const killedTasks = filter(tasks, pattern);
    if (killedTasks.length) {
      angular.forEach(killedTasks, (task) => {
        task.timeoutDeferredObj.resolve();
        task.deferredObj.reject({});
        $timeout.cancel(task.timeoutPromise);
      });
      remove(tasks, pattern);
    }
  };

  this.poll = function p(url, apiOpts = {}, pollOpts = {}) {
    // Try to get similar polling
    const simTask = find(tasks, {
      url,
      scope: pollOpts.scope || null,
      namespace: pollOpts.namespace || null,
    });
    if (simTask) {
      return simTask.deferredObj.promise;
    }

    // --> Else, create it
    const timeoutDeferredObj = $q.defer();
    const task = angular.extend(
      {
        deferredObj: $q.defer(),
        timeoutDeferredObj,
        url,
        opts: angular.extend(apiOpts, { timeout: timeoutDeferredObj.promise }),
        interval: defaultInterval, // Interval between polling
        lastResult: null, // Last polled result
        successRule: null, // (optional) success condition (if not a task)
        errorRule: null, // (optional) Error condition (if not a task)
        scope: null, // (optional) Scope ID (to isolate polling)
        namespace: null,
        // (optional) Type of namespace, can be whatever you want (to isolate polling)
      },
      pollOpts,
    );

    tasks.push(task);

    run(task);

    return task.deferredObj.promise;
  };
}

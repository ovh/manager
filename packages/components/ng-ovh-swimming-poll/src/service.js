import angular from 'angular';
import { every, filter, find, remove, set } from 'lodash-es';

export default /* @ngInject */ function($q, $timeout, $http) {
  const defaultInterval = 7000;
  const defaultRetryMaxAttemps = 3;
  const defaultRetryTimeout = 10000;
  let iteration = 0;
  const tasks = [];

  function testRule(rule, element) {
    if (typeof rule === 'function') {
      return rule(element);
    }
    return every(rule, (value, key) =>
      typeof value === 'function'
        ? value(element, iteration)
        : element[key] === value,
    );
  }

  function resolveTask(task, result) {
    set(task, 'retryCountAttempts', 0);
    task.deferredObj.resolve(result);
    remove(tasks, task);
  }

  function rejectTask(taskParam, result) {
    const task = taskParam;
    if (task.retryCountAttempts < task.retryMaxAttempts) {
      task.retryCountAttempts += 1;
      $timeout(() => {
        poll(task); // eslint-disable-line no-use-before-define
      }, task.retryTimeoutDelay);
    } else {
      task.deferredObj.reject(result);
      remove(tasks, task);
    }
  }

  function run(task) {
    const interval =
      typeof task.interval === 'function'
        ? task.interval((iteration += 1))
        : task.interval;
    set(
      task,
      'timeoutPromise',
      $timeout(() => {
        poll(task); // eslint-disable-line no-use-before-define
      }, interval),
    );

    return null;
  }

  function notifyTask(task, result) {
    set(task, 'retryCountAttempts', 0);
    task.deferredObj.notify(result);
    set(task, 'lastResult', angular.copy(result));
    return run(task); // Re-launch
  }

  function poll(task) {
    const httpConfig = angular.extend(
      {
        url: task.url,
        method: task.method.toLowerCase(),
        data: task.postData,
      },
      task.opts,
    );

    $http(httpConfig).then(
      (resp) => {
        const result = resp.data;

        // It's not a task, it's a specific polling

        let data = [];
        if (!angular.isArray(result)) {
          data.push(result);
        } else {
          data = result;
        }

        let nbSuccess = 0;
        let nbError = 0;
        let nbNotify = 0;

        angular.forEach(data, (element) => {
          if (task.successRule) {
            if (testRule(task.successRule, element)) {
              nbSuccess += 1;
            } else if (task.errorRule && testRule(task.errorRule, element)) {
              nbError += 1;
            } else {
              nbNotify += 1;
            }
          } else {
            // It's a /task polling

            switch (result.status) {
              case 'done':
              case 'cancelled':
              case 'DONE':
              case 'CANCELLED':
                nbSuccess += 1;
                break;
              case 'customerError':
              case 'ovhError':
              case 'error':
              case 'blocked':
              case 'CUSTOMER_ERROR':
              case 'OVH_ERROR':
              case 'ERROR':
              case 'BLOCKED':
                nbError += 1;
                break;
              default:
                if (task.errorRule && testRule(task.errorRule, element)) {
                  nbError += 1;
                } else {
                  nbNotify += 1;
                }
            }
          }
        });

        if (nbSuccess === data.length) {
          return resolveTask(task, result);
        }

        // 1 error, 1 success, 0 notify and !notifyOnError => reject
        if (nbError && !nbNotify && !task.notifyOnError) {
          return rejectTask(task, result);
        }

        return notifyTask(task, result);
      },
      (error) => {
        // If error.status is 404 and no task.lastResult, we dont send a promise to
        // avoid to break javascript code with incorrect response
        // user will be blocked
        if (error.status === 404 && task.lastResult) {
          // deleted
          return resolveTask(task, task.lastResult);
        }
        if (error.status !== 0) {
          // status === 0 : killed
          return rejectTask(task, error);
        }
        return error;
      },
    );
  }

  this.poll = function initPoll(url, apiOpts, pollOpts) {
    let apiOptions = {};
    let pollOptions = {};

    if (apiOpts) {
      apiOptions = apiOpts;
    }
    if (pollOpts) {
      pollOptions = pollOpts;
    }

    iteration = 0;

    // Try to get similar polling
    const simTask = find(tasks, {
      url,
      scope: pollOptions.scope || null,
      namespace: pollOptions.namespace || null,
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
        opts: angular.extend(apiOptions, {
          timeout: timeoutDeferredObj.promise,
        }),
        // Interval between polling
        interval: defaultInterval,
        // Last polled result
        lastResult: null,
        // (optional) success condition (if not a task)
        successRule: null,
        // (optional) Error condition (if not a task)
        errorRule: null,
        // (optional) Scope ID (to isolate polling)
        scope: null,
        // (optional) Type of namespace, can be whatever you want (to isolate polling)
        namespace: null,
        postData: null,
        retryMaxAttempts: defaultRetryMaxAttemps,
        retryCountAttempts: 0,
        retryTimeoutDelay: defaultRetryTimeout,
        method: 'get',
      },
      pollOptions,
    );

    tasks.push(task);

    poll(task);

    return task.deferredObj.promise;
  };

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
}

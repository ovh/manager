angular.module('ua.poll').service('Poll',
    ['$q', '$timeout', '$http',
    function ($q, $timeout, $http) {
    'use strict';

    var defaultInterval = 7e3,
        tasks = [];

    this.poll = function (url, apiOpts, pollOpts) {

        if (!apiOpts) {
            apiOpts = {};
        }
        if (!pollOpts) {
            pollOpts = {};
        }

        // Try to get similar polling
        var simTask = _.find(tasks, { url: url, scope: pollOpts.scope || null, namespace: pollOpts.namespace || null });
        if (simTask) {
            return simTask.deferredObj.promise;
        }

        // --> Else, create it
        var timeoutDeferredObj = $q.defer();
        var task = angular.extend({
            deferredObj        : $q.defer(),
            timeoutDeferredObj : timeoutDeferredObj,
            url                : url,
            opts               : angular.extend(apiOpts, { 'timeout': timeoutDeferredObj.promise }),
            interval           : defaultInterval,    // Interval between polling
            lastResult         : null,    // Last polled result
            successRule        : null,    // (optional) success condition (if not a task)
            errorRule          : null,    // (optional) Error condition (if not a task)
            scope              : null,    // (optional) Scope ID (to isolate polling)
            namespace          : null     // (optional) Type of namespace, can be whatever you want (to isolate polling)
        }, pollOpts);

        tasks.push(task);

        run(task);

        return task.deferredObj.promise;
    };

    this.kill = function (pattern) {
        var killedTasks = _.filter(tasks, pattern);
        if (killedTasks.length) {
            angular.forEach(killedTasks, function (task) {
                task.timeoutDeferredObj.resolve();
                task.deferredObj.reject({});
                $timeout.cancel(task.timeoutPromise);
            });
            _.remove(tasks, pattern);
        }
    };

    // ---

    function resolveTask (task, result) {
        task.deferredObj.resolve(result);
        _.remove(tasks, task);
    }
    function rejectTask (task, result) {
        task.deferredObj.reject(result);
        _.remove(tasks, task);
    }
    function notifyTask (task, result) {
        task.deferredObj.notify(result);
        task.lastResult = angular.copy(result);
        run(task);    // Re-launch
    }

    function run (task) {
        task.timeoutPromise = $timeout(function () {
            poll(task);
        }, task.interval);
    }

    function poll (task) {
        $http.get(task.url, task.opts).then(function (result) {
            result = result.data;

            if (task.successRule) {
                // It's not a task, it's a specific polling

                var inSuccess = true;
                angular.forEach(task.successRule, function (val, key) {
                    if (result[key] !== val) {
                        inSuccess = false;
                    }
                });

                if (inSuccess) {
                    return resolveTask(task, result);
                }

                if (task.errorRule) {
                    var inError = true;
                    angular.forEach(task.errorRule, function (val, key) {
                        if (result[key] !== val) {
                            inError = false;
                        }
                    });

                    if (inError) {
                        return rejectTask(task, result);
                    }
                }

                return notifyTask(task, result);

            } else {
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
            }

        }, function (error) {
            if (error.status === 404) {      // deleted
                return resolveTask(task, task.lastResult);
            } else if (error.status !== 0) {       // status === 0 : killed
                return rejectTask(task, error.data);
            }
        });
    }

}]);

angular.module("ovh-angular-swimming-poll").service("Poller", ["$q", "$timeout", "$http",
    function ($q, $timeout, $http) {
        "use strict";

        var defaultInterval = 7000;
        var defaultRetryMaxAttemps = 3;
        var defaultRetryTimeout = 10000;
        var iteration = 0;
        var tasks = [];

        this.poll = function (url, apiOpts, pollOpts) {
            var apiOptions = {};
            var pollOptions = {};

            if (apiOpts) {
                apiOptions = apiOpts;
            }
            if (pollOpts) {
                pollOptions = pollOpts;
            }

            iteration = 0;

        // Try to get similar polling
            var simTask = _.find(tasks, { url: url, scope: pollOptions.scope || null, namespace: pollOptions.namespace || null });
            if (simTask) {
                return simTask.deferredObj.promise;
            }

        // --> Else, create it
            var timeoutDeferredObj = $q.defer();
            var task = angular.extend({
                deferredObj: $q.defer(),
                timeoutDeferredObj: timeoutDeferredObj,
                url: url,
                opts: angular.extend(apiOptions, { timeout: timeoutDeferredObj.promise }),
                interval: defaultInterval,    // Interval between polling
                lastResult: null,    // Last polled result
                successRule: null,    // (optional) success condition (if not a task)
                errorRule: null,    // (optional) Error condition (if not a task)
                scope: null,    // (optional) Scope ID (to isolate polling)
                namespace: null,     // (optional) Type of namespace, can be whatever you want (to isolate polling)
                postData: null,
                retryMaxAttempts: defaultRetryMaxAttemps,
                retryCountAttempts: 0,
                retryTimeoutDelay: defaultRetryTimeout,
                method: "get"
            }, pollOptions);

            tasks.push(task);

            poll(task);

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
            task.retryCountAttempts = 0;
            task.deferredObj.resolve(result);
            _.remove(tasks, task);
        }
        function rejectTask (task, result) {
            if (task.retryCountAttempts < task.retryMaxAttempts) {
                task.retryCountAttempts++;
                $timeout(function () {
                    poll(task);
                }, task.retryTimeoutDelay);
            } else {
                task.deferredObj.reject(result);
                _.remove(tasks, task);
            }
        }
        function notifyTask (task, result) {
            task.retryCountAttempts = 0;
            task.deferredObj.notify(result);
            task.lastResult = angular.copy(result);
            return run(task);    // Re-launch
        }

        function run (task) {
            var interval = typeof task.interval === "function" ? task.interval(iteration++) : task.interval;
            task.timeoutPromise = $timeout(function () {
                poll(task);
            }, interval);

            return null;
        }

        function testRule (rule, element) {
            if (typeof rule === "function") {
                return rule(element);
            }
            return _.every(rule, function (value, key) {
                return typeof value === "function" ? value(element, iteration) : element[key] === value;
            });

        }

        function poll (task) {
            var httpConfig = angular.extend({
                url: task.url,
                method: task.method.toLowerCase(),
                data: task.postData
            }, task.opts);
            $http(httpConfig).then(function (resp) {
                var result = resp.data;

            // It's not a task, it's a specific polling

                var data = [];
                if (!angular.isArray(result)) {
                    data.push(result);
                } else {
                    data = result;
                }

                var nbSuccess = 0;
                var nbError = 0;
                var nbNotify = 0;

                angular.forEach(data, function (element) {
                    if (task.successRule) {

                        if (testRule(task.successRule, element)) {
                            nbSuccess++;
                        } else if (task.errorRule && testRule(task.errorRule, element)) {
                            nbError++;
                        } else {
                            nbNotify++;
                        }
                    } else {
                    // It's a /task polling

                        switch (result.status) {
                        case "done":
                        case "cancelled":
                        case "DONE":
                        case "CANCELLED":
                            nbSuccess++;
                            break;
                        case "customerError":
                        case "ovhError":
                        case "error":
                        case "blocked":
                        case "CUSTOMER_ERROR":
                        case "OVH_ERROR":
                        case "ERROR":
                        case "BLOCKED":
                            nbError++;
                            break;
                        default:
                            if (task.errorRule && testRule(task.errorRule, element)) {
                                nbError++;
                            } else {
                                nbNotify++;
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
            }, function (error) {
            // If error.status is 404 and no task.lastResult, we dont send a promise to
            // avoid to break javascript code with incorrect response
            // user will be blocked
                if (error.status === 404 && task.lastResult) {      // deleted
                    return resolveTask(task, task.lastResult);
                } else if (error.status !== 0) {       // status === 0 : killed
                    return rejectTask(task, error);
                }
                return error;
            });
        }
    }]);

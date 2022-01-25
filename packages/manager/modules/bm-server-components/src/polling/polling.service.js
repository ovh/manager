import forEach from 'lodash/forEach';
import unset from 'lodash/unset';

export default /* @ngInject */ function PollingService($http, $q, $timeout) {
  // @TODO when angular version will be >=1.2.x use
  // Notify instead state param(resolveState / notifyState)

  let to = true;
  let tofast = true;
  let watchedTasksPromise = {};
  const resolveState = 'resolve';
  const notifyState = 'notify';
  const notifyExist = 'alreadyExist';
  const defaultElapse = 15000;
  let elapse = defaultElapse;
  let isRun = false;
  let watchedTasks = {};
  let killedScope = {};
  const defaultElapseFast = 5000;
  let elapsefast = defaultElapseFast;
  let isFastRun = false;
  let watchedTasksFast = {};
  let killedScopeFast = {};

  function idtask(taskId) {
    return `t${taskId}`;
  }

  function clean() {
    elapse = defaultElapse;
    watchedTasks = {};
    killedScope = {};
  }
  function cleanFast() {
    elapsefast = defaultElapseFast;
    watchedTasksFast = {};
    killedScopeFast = {};
  }

  function stop() {
    if (to instanceof $q) {
      to = $timeout.cancel(to);
    }
    isRun = false;
    clean();
  }
  function stopfast() {
    if (tofast instanceof $q) {
      tofast = $timeout.cancel(tofast);
    }
    isFastRun = false;
    cleanFast();
  }

  function stopPoll(fast) {
    if (fast) {
      stopfast();
    } else {
      stop();
    }
  }

  function taskHandling(task, watchedTasksList) {
    const taskId = task.data.id || task.data.taskId;

    switch ((task.data.status || task.data.state || '').toUpperCase()) {
      case 'DOING':
      case 'INIT':
      case 'TODO':
      case 'PAUSED':
      case 'WAITINGACK':
        angular.forEach(watchedTasksPromise[idtask(taskId)], (value) => {
          if (value.pollPromise) {
            value.pollPromise.resolve({
              state: notifyState,
              task: task.data,
            });
          }
        });
        break;

      case 'CANCELLED':
      case 'DONE':
        angular.forEach(watchedTasksPromise[idtask(taskId)], (value) => {
          if (value.pollPromise) {
            value.pollPromise.resolve({
              state: resolveState,
              task: task.data,
            });
          }
        });
        break;

      case 'CUSTOMER_ERROR':
      case 'OVH_ERROR':
      case 'OVHERROR':
      case 'ERROR':
      case 'BLOCKED':
        angular.forEach(watchedTasksPromise[idtask(taskId)], (value) => {
          if (value.pollPromise) {
            value.pollPromise.reject({
              type: 'ERROR',
              message: task.data.comment,
              task: task.data,
            });
          }
        });
        break;

      default:
        angular.forEach(watchedTasksPromise[idtask(taskId)], (value) => {
          if (value.pollPromise) {
            value.pollPromise.resolve({
              state: notifyState,
              task: task.data,
            });
          }
        });
        break;
    }
    unset(watchedTasksPromise, idtask(taskId));
    unset(watchedTasksList, idtask(taskId));
  }

  // Because if q.all reject, it don't sent fail task id
  function cleanFailTask(eachTask, watchedTasksList) {
    const idTask = idtask(
      watchedTasksList[eachTask].task.id ||
        watchedTasksList[eachTask].task.taskId,
    );

    $http.get(watchedTasksList[eachTask].url).then(
      (task) => {
        taskHandling(task, watchedTasksList);
      },
      (error) => {
        angular.forEach(watchedTasksPromise[idTask], (value) => {
          //  Some API delete tasks right after their completition (ex: housing.)
          if (error.status === 404) {
            value.pollPromise.resolve({
              state: resolveState,
            });
          }

          value.pollPromise.reject(error.data);
        });
        unset(watchedTasksPromise, idTask);
        unset(watchedTasksList, idTask);
      },
    );
  }

  function poll(fast) {
    const resultsTasks = [];
    let watchedTasksList = {};
    let killedScopeList = {};
    let hasElements = false;

    if (fast) {
      watchedTasksList = watchedTasksFast;
      killedScopeList = killedScopeFast;
    } else {
      watchedTasksList = watchedTasks;
      killedScopeList = killedScope;
    }

    forEach(watchedTasksList, (taskValue, eachTask) => {
      // Delete polling of dead scope
      if (killedScopeList[taskValue.scopeId]) {
        // Delete promise of dead scope
        forEach(watchedTasksPromise[eachTask], (promiseValue, eachPromise) => {
          if (killedScopeList[promiseValue.scopeId]) {
            delete watchedTasksPromise[eachTask][eachPromise];
          }
        });
        // Delete taskid of dead scope if promise = 0
        if (
          !watchedTasksPromise[eachTask] ||
          watchedTasksPromise[eachTask].length === 0
        ) {
          delete watchedTasksPromise[eachTask];
          delete watchedTasksList[eachTask];
        } else {
          resultsTasks.push($http.get(watchedTasksList[eachTask].url));
          hasElements = true;
        }
      } else {
        resultsTasks.push($http.get(watchedTasksList[eachTask].url));
        hasElements = true;
      }
    });

    killedScopeList = {};

    // STOP if no elements
    if (!hasElements) {
      stopPoll(fast);
    } else {
      $q.all(resultsTasks).then(
        (tasks) => {
          angular.forEach(tasks, (task) => {
            taskHandling(task, watchedTasksList);
          });
          // eslint-disable-next-line no-use-before-define
          run(fast);
        },
        () => {
          forEach(watchedTasksList, (eachTaskValue, eachTask2) => {
            cleanFailTask(eachTask2, watchedTasksList);
          });
          // eslint-disable-next-line no-use-before-define
          run(fast);
        },
      );
    }
  }

  function run(fast) {
    if (fast) {
      if (!isFastRun) {
        isFastRun = true;
        poll(true);
      } else {
        tofast = $timeout(() => {
          poll(true);
        }, elapsefast);
      }
    } else if (!isRun) {
      isRun = true;
      poll(false);
    } else {
      to = $timeout(() => {
        poll(false);
      }, elapse);
    }
  }

  this.setElapse = function setElapse(newElapse) {
    elapse = newElapse;
  };
  this.setElapseFast = function setElapseFast(newElapse) {
    elapsefast = newElapse;
  };

  /*
      poll after 5 sec
      taskUrl : url to get task status
      task : task object (java model)
      scopeId : the scope calling polling
      cancelIfExist : no watch if task id is already in poll
  */
  this.addTaskFast = function addTaskFast(
    taskUrl,
    task,
    scopeId,
    cancelIfExist,
  ) {
    const deferPromise = $q.defer();
    const idTask = idtask(task.id || task.taskId);
    if (cancelIfExist && watchedTasksPromise[idTask]) {
      deferPromise.resolve({ state: notifyExist });
    } else {
      if (!watchedTasksPromise[idTask]) {
        watchedTasksPromise[idTask] = [];
      }
      watchedTasksPromise[idTask].push({
        pollPromise: deferPromise,
        scopeId,
      });
      watchedTasksFast[idTask] = {
        url: taskUrl,
        task,
        scopeId,
      };
      if (!isFastRun) {
        run(true);
      }
    }
    return deferPromise.promise;
  };

  /*
      poll after 15 sec
      taskUrl : url to get task status
      task : task object (java model)
      scopeId : the scope calling polling
      cancelIfExist : no watch if task id is already in poll
  */
  this.addTask = function addTask(taskUrl, task, scopeId, cancelIfExist) {
    const deferPromise = $q.defer();
    if (cancelIfExist && watchedTasksPromise[idtask(task.id || task.taskId)]) {
      deferPromise.resolve({ state: notifyExist });
    } else {
      if (!watchedTasksPromise[idtask(task.id || task.taskId)]) {
        watchedTasksPromise[idtask(task.id || task.taskId)] = [];
      }
      watchedTasksPromise[idtask(task.id || task.taskId)].push({
        pollPromise: deferPromise,
        scopeId,
      });
      watchedTasks[idtask(task.id || task.taskId)] = {
        url: taskUrl,
        task,
        scopeId,
      };
      if (!isRun) {
        run(false);
      }
    }
    return deferPromise.promise;
  };

  /*
      kill all tasks poll from scope id parameter
  */
  this.addKilledScope = function addKilledScope(scopeId) {
    if (scopeId) {
      killedScope[scopeId] = true;
      killedScopeFast[scopeId] = true;
    } else {
      stopfast();
      stop();
      watchedTasksPromise = {};
    }
  };

  /* test state of polling return */
  this.isResolve = function isResolve(state) {
    return state.state === resolveState;
  };

  this.isNotify = function isNotify(state) {
    return state.state === notifyState;
  };

  this.isAlreadyExist = function isAlreadyExist(state) {
    return state.state === notifyExist;
  };

  this.isDone = function isDone(state) {
    return (
      state.task &&
      (state.task.status || state.task.state || '').toUpperCase() === 'DONE'
    );
  };
}

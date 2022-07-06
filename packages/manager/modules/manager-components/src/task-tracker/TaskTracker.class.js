// eslint-disable-next-line max-classes-per-file
export default class TaskTracker {
  static init($compileProvider) {
    TaskTracker.compileProvider = $compileProvider;
  }

  static createStateOptions(
    componentName,
    { header, footer, resolve = {}, params = [] } = {},
  ) {
    if (!TaskTracker.compileProvider) {
      throw new Error('The TaskTracker must be initialized first');
    }

    TaskTracker.compileProvider.component(componentName, {
      controller: class {
        constructor() {
          const { onDone } = this;
          this.onDone = ($task) => onDone($task);
        }
      },
      bindings: {
        doingLabel: '<',
        doneLabel: '<',
        endpoint: '<',
        errorLabel: '<',
        heading: '<',
        interval: '<',
        onDone: '<',
        tasks: '<',
        todoLabel: '<',
        ...params.reduce((set, param) => ({ ...set, [param]: '<' }), {}),
      },
      template: `
        <task-tracker
          data-doing-label="{{ $ctrl.doingLabel }}"
          data-done-label="{{ $ctrl.doneLabel }}"
          data-endpoint="{{ $ctrl.endpoint }}"
          data-error-label="{{ $ctrl.errorLabel }}"
          data-heading="{{ $ctrl.heading }}"
          data-interval="$ctrl.interval"
          data-on-done="$ctrl.onDone($tasks)"
          data-tasks="$ctrl.tasks"
          data-todo-label="{{ $ctrl.todoLabel }}"
        >
          ${header && `<task-tracker-header>${header}</task-tracker-header>`}
          ${footer && `<task-tracker-footer>${footer}</task-tracker-footer>`}
        </task-tracker>
      `,
    });
    return {
      url: `/task/:taskIds?${params.join('&')}`,
      component: componentName,
      resolve: {
        ...resolve,
        ...params.reduce(
          (set, param) => ({
            ...set,
            [param]: /* @ngInject */ ($transition$) =>
              $transition$.params()[param],
          }),
          {},
        ),
        tasks: /* @ngInject */ ($q, $http, $transition$, endpoint) =>
          $q.all(
            $transition$
              .params()
              .taskIds.split(',')
              .map((taskId) =>
                $http
                  .get(`${endpoint}/${taskId}`)
                  .then(({ data: task }) => task),
              ),
          ),
      },
    };
  }
}

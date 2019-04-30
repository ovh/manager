export default class ngUirouterBreadcrumbController {
  /* @ngInject */
  constructor($injector, $location, $q, $state, $transitions) {
    this.$injector = $injector;
    this.$location = $location;
    this.$q = $q;
    this.$state = $state;
    this.$transitions = $transitions;

    this.breadcrumb = null;
  }

  $onInit() {
    this.$transitions.onSuccess({}, (transition) => {
      transition.promise.finally(() => {
        this.breadcrumb = [];
        let state = this.$state.$current;

        while (state.parent) {
          const breadcrumbResolvable = state.resolvables.find(resolvable => resolvable.token === 'breadcrumb');

          if (!state.self.abstract || breadcrumbResolvable) {
            const entry = {
              name: state.name,
              promise: breadcrumbResolvable
                ? transition.injector(state.name).getAsync('breadcrumb')
                : this.$q.when(state.name),
              url: state.self.abstract
                ? null
                : this.$state.href(state.name, this.$state.params, { absolute: true }),
              active: this.$state.is(state.name),
            };

            this.breadcrumb.unshift(entry);

            entry.promise.then((value) => {
              if (value) {
                entry.name = value;
              } else {
                this.breadcrumb = this.breadcrumb
                  .filter(breadcrumbEntry => breadcrumbEntry !== entry);
              }
            });
          }

          state = state.parent.self.$$state();
        }
      });
    });
  }
}

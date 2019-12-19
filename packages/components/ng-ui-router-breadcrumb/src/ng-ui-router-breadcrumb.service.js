export default class BreadcrumbService {
  /* @ngInject */
  constructor(
    $q,
    $state,
  ) {
    this.$q = $q;
    this.$state = $state;
    this.breadcrumb = [];
    this.listeners = [];
  }

  getBreadcrumb() {
    return this.bredcrumb;
  }

  buildBreadcrumb(transition) {
    return transition.promise.then(() => {
      this.breadcrumb = [];

      let state = this.$state.$current;

      while (state.parent) {
        const breadcrumbResolvable = state.resolvables.find((resolvable) => resolvable.token === 'breadcrumb');

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
                .filter((breadcrumbEntry) => breadcrumbEntry !== entry);
            }
          });
        }

        state = state.parent.self.$$state();
      }

      return this.$q.all(this.breadcrumb.map((entry) => entry.promise))
        .then(() => this.notifyAll())
        .then(() => this.breadcrumb);
    });
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyAll() {
    this.listeners.forEach((listener) => listener(this.breadcrumb));
  }
}

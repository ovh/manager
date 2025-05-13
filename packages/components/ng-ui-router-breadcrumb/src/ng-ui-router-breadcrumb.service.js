export default class BreadcrumbService {
  /* @ngInject */
  constructor($q, $state) {
    this.$q = $q;
    this.$state = $state;
    this.breadcrumb = [];
    this.listeners = [];
  }

  getBreadcrumb() {
    return this.bredcrumb;
  }

  buildBreadcrumb(transition) {
    let state = this.$state.$current;
    return transition.promise
      .then(() => {
        const hideBreadcrumbResolvable = state.resolvables.find(
          (resolvable) => resolvable.token === 'hideBreadcrumb',
        );
        return hideBreadcrumbResolvable
          ? transition.injector(state.name).getAsync('hideBreadcrumb')
          : this.$q.when(false);
      })
      .then((hideBreadcrumb) => {
        this.breadcrumb = [];

        while (state.parent && !hideBreadcrumb) {
          const breadcrumbPrefixResolvable = state.resolvables.find(
            (resolvable) => resolvable.token === 'breadcrumbPrefix',
          );
          const breadcrumbResolvable = state.resolvables.find(
            (resolvable) => resolvable.token === 'breadcrumb',
          );

          if (!state.self.abstract || breadcrumbResolvable) {
            const entry = {
              name: state.name,
              promise: breadcrumbResolvable
                ? transition.injector(state.name).getAsync('breadcrumb')
                : this.$q.when(state.name),
              url: state.self.abstract
                ? null
                : this.$state.href(state.name, this.$state.params, {
                    absolute: true,
                  }),
              active: this.$state.is(state.name),
            };

            this.breadcrumb.unshift(entry);

            entry.promise.then((value) => {
              if (value) {
                entry.name = value;
              } else {
                this.breadcrumb = this.breadcrumb.filter(
                  (breadcrumbEntry) => breadcrumbEntry !== entry,
                );
              }
            });
          }

          if (breadcrumbPrefixResolvable) {
            transition
              .injector(state.name)
              .getAsync('breadcrumbPrefix')
              .then((prefixes) => {
                prefixes.forEach(({ name, url }, index) =>
                  this.breadcrumb.splice(index, 0, {
                    name,
                    url,
                    active: false,
                  }),
                );
              });
          }

          state = state.parent.self.$$state();
        }

        return this.$q
          .all(this.breadcrumb.map((entry) => entry.promise))
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

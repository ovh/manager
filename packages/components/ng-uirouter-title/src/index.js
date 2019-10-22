import angular from 'angular';
import '@uirouter/angularjs';
import find from 'lodash/find';
import get from 'lodash/get';
import has from 'lodash/has';

const moduleName = 'ngUirouterTitle';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .run(/* @ngInject */ ($transitions) => {
    const initialTitle = document.title;

    $transitions.onSuccess({}, (transition) => {
      const getStateTitle = (state) => {
        const stateTitle = find(
          get(state, 'resolvables'),
          (resolvable) => resolvable.token === '$title',
        );
        if (!stateTitle && has(state, 'parent')) {
          return getStateTitle(get(state, 'parent'));
        }
        return stateTitle;
      };

      const stateTitle = getStateTitle(transition.$to());

      transition.promise.finally(() => {
        document.title = stateTitle ? transition.injector().get('$title') : initialTitle;
      });
    });
  });

export default moduleName;

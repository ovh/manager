import angular from 'angular';
import translate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

const moduleName = 'publicCloudRedirectTo';

angular
  .module(moduleName, [
    translate,
    uiRouter,
  ])
  .run(($state, $transitions) => {
    $transitions.onSuccess({}, (transition) => {
      const to = transition.to();
      if (to.resolve.redirectTo) {
        return transition.injector(to.name).getAsync('redirectTo')
          .then(({
            state,
            stateParams = {},
            options = {},
          }) => $state.go(state, stateParams, options));
      }
      return null;
    });
  });

export default moduleName;

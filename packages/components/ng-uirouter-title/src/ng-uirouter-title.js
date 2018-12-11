import angular from 'angular';
import '@uirouter/angularjs';

const moduleName = 'ngUirouterTitle';
angular
  .module(moduleName, [
    'ui.router',
  ])
  .run(/* ngInject */ ($transitions) => {
    $transitions.onSuccess({}, (transition) => {
      transition.promise.finally(() => {
        document.title = transition.injector().get('$title');
      });
    });
  });

export default moduleName;

import angular from 'angular';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import 'ovh-ui-angular';

import component from './new-ticket.component';
import creationFormComponent from './creation-form/creation-form.component';
import issuesSelectorComponent from './issues-selector/issues-selector.component';
import issuesFormComponent from './issues-form/issues-form.component';

import 'ovh-ui-kit/dist/oui.css';

const moduleName = 'ovhManagerSupportTickets';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component(component.name, component)
  .component(creationFormComponent.name, creationFormComponent)
  .component(issuesSelectorComponent.name, issuesSelectorComponent)
  .component(issuesFormComponent.name, issuesFormComponent)
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state({
      name: 'support.new',
      resolve: {
        goToTickets: /* @ngInject */ $state => () => $state.go('support.tickets'),
      },
      url: '/new',
      views: {
        'support@support': component.name,
      },
      translations: { value: ['.'], format: 'json' },
    });
  });

export default moduleName;

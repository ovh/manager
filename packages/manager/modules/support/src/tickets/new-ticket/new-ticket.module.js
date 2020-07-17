import angular from 'angular';
import get from 'lodash/get';

import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './new-ticket.component';
import creationFormComponent from './creation-form/creation-form.component';
import feedback from './feedback';
import issuesSelectorComponent from './issues-selector/issues-selector.component';
import issuesFormComponent from './issues-form/issues-form.component';
import issuesFormResourcesComponent from './issues-form/resources/resources.component';
import issuesFormService from './issues-form/issues-form.service';
import {
  name as serviceName,
  definition as serviceDefinition,
} from './new-ticket.service';

import '@ovh-ux/ui-kit/dist/css/oui.css';

const moduleName = 'ovhManagerSupportTicketsNew';

angular
  .module(moduleName, [
    angularTranslate,
    feedback,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .component(component.name, component)
  .component(creationFormComponent.name, creationFormComponent)
  .component(issuesFormResourcesComponent.name, issuesFormResourcesComponent)
  .component(issuesSelectorComponent.name, issuesSelectorComponent)
  .component(issuesFormComponent.name, issuesFormComponent)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service(serviceName, serviceDefinition)
  .service('IssueForm', issuesFormService)
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state({
        name: 'support.tickets.new',
        params: {
          categoryName: {
            value: null,
            type: 'string',
            squash: true,
          },
          serviceName: {
            value: null,
            type: 'string',
            squash: true,
          },
          serviceTypeName: {
            value: null,
            type: 'string',
            squash: true,
          },
        },
        resolve: {
          goToTickets: /* @ngInject */ ($state) => () =>
            $state.go('support.tickets'),
          categoryName: /* @ngInject */ ($transition$) =>
            $transition$.params().categoryName,
          serviceName: /* @ngInject */ ($transition$) =>
            $transition$.params().serviceName,
          serviceTypeName: /* @ngInject */ ($transition$) =>
            $transition$.params().serviceTypeName,
          urls: /* @ngInject */ (OvhApiMe, CORE_URLS) =>
            OvhApiMe.v6()
              .get()
              .$promise.then((me) => ({
                guide: get(CORE_URLS, `guides.home.${me.ovhSubsidiary}`),
                forum: get(CORE_URLS, `forum.${me.ovhSubsidiary}`),
              })),
        },
        url: '/new?categoryName&serviceName&serviceTypeName',
        views: {
          'support@support': component.name,
        },
      });
    },
  );

export default moduleName;

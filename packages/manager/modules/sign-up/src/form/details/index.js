import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

// templates for ui-select
import uiSelectTpl from './ui-select-oui-kit/select.html';
import uiSelectChoicesTpl from './ui-select-oui-kit/choices.html';
import uiSelectMatchTpl from './ui-select-oui-kit/match.tpl.html';

import component from './details.component';

import './details.scss';

const moduleName = 'ovhSignUpDetails';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(
    /* @ngInject */ ($templateCache) => {
      // for ui-select oui-kit style
      $templateCache.put('ui-select-oui-kit/select.tpl.html', uiSelectTpl);
      $templateCache.put('ui-select-oui-kit/match.tpl.html', uiSelectMatchTpl);
      $templateCache.put(
        'ui-select-oui-kit/choices.tpl.html',
        uiSelectChoicesTpl,
      );
    },
  )
  .directive(component.name, () => component);

export default moduleName;

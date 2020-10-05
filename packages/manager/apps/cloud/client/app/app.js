import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';

import uiRouter, { RejectType } from '@uirouter/angularjs';
import isString from 'lodash/isString';

import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhBrowserAlert from '@ovh-ux/ng-ovh-browser-alert';
import ngOvhCheckboxTable from '@ovh-ux/ng-ovh-checkbox-table';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';
import ngOvhFormFlat from '@ovh-ux/ng-ovh-form-flat';
import ngOvhJsplumb from '@ovh-ux/ng-ovh-jsplumb';
import ngOvhResponsiveTabs from '@ovh-ux/ng-ovh-responsive-tabs';
import ngOvhSlider from '@ovh-ux/ng-ovh-slider';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhStopEvent from '@ovh-ux/ng-ovh-stop-event';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhToaster from '@ovh-ux/ng-ovh-toaster';
import ngOvhUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngOvhActionsMenu from '@ovh-ux/ng-ovh-actions-menu';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhJqueryUiDraggable from '@ovh-ux/ng-ovh-jquery-ui-draggable';
import ngOvhJqueryUiDroppable from '@ovh-ux/ng-ovh-jquery-ui-droppable';
import ngOvhResponsivePageSwitcher from '@ovh-ux/ng-ovh-responsive-page-switcher';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ovhManagerAtInternetConfig from '@ovh-ux/manager-at-internet-configuration';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerServerSidebar from '@ovh-ux/manager-server-sidebar';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';

import cloudUniverseComponents from '../cloudUniverseComponents';

import errorPage from './error/error.module';

const moduleName = 'managerApp';

angular
  .module(
    moduleName,
    [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngAnimate',
      'ngMessages',
      'pascalprecht.translate',
      'ui.bootstrap',
      uiRouter,
      'ui.validate',
      'ui.sortable',
      ovhManagerCore,
      ovhManagerAccountSidebar,
      ovhNotificationsSidebar,
      ngAtInternet,
      ngAtInternetUiRouterPlugin,
      ngOvhApiWrappers,
      ngOvhBrowserAlert,
      ngOvhCheckboxTable,
      ngOvhDocUrl,
      ngOvhFormFlat,
      ngOvhSsoAuth,
      ngOvhSsoAuthModalPlugin,
      ngOvhStopEvent,
      ngOvhSwimmingPoll,
      ngOvhActionsMenu,
      ngOvhCloudUniverseComponents,
      ngOvhUserPref,
      ngOvhUiRouterLayout,
      ngOvhUiRouterLineProgress,
      ovhManagerAccountMigration,
      'ovh-api-services',
      'ovh-common-style',
      ngQAllSettled,
      'angularMoment',
      ngOvhToaster,
      'oui',
      'oui.list-view',
      'chart.js',

      ngPaginationFront,
      ngOvhResponsiveTabs,
      'mgcrea.ngStrap.popover',
      'mgcrea.ngStrap.tooltip',
      'mgcrea.ngStrap.helpers.dimensions',
      'mgcrea.ngStrap.core',
      ngOvhResponsivePageSwitcher,

      'ng-slide-down',
      ngOvhJsplumb,
      'tmh.dynamicLocale',

      ngOvhJqueryUiDraggable,
      ngOvhJqueryUiDroppable,
      ngOvhSlider,
      ngTailLogs,
      'matchmedia-ng',
      'angular-websocket',
      'angular-translate-loader-pluggable',

      ngTranslateAsyncLoader,
      cloudUniverseComponents,
      ovhManagerAtInternetConfig,
      ovhManagerBanner,
      ovhManagerNavbar,
      ovhManagerServerSidebar,
      errorPage,
      __NG_APP_INJECTIONS__,
    ].filter(isString),
  )
  .config(
    /* @ngInject */ (
      $urlServiceProvider,
      $locationProvider,
      CORE_MANAGER_URLSProvider, // eslint-disable-line camelcase
    ) => {
      const dedicatedRedirections = [
        '/dbaas/logs',
        '/paas/veeam-enterprise',
        '/paas/veeam',
        '/iaas/vps',
        '/paas/nasha',
        '/vrack',
      ];

      dedicatedRedirections.forEach((redirectionPrefix) => {
        $urlServiceProvider.rules.when(
          new RegExp(`^${redirectionPrefix}`),
          (match, { path }) => {
            const { origin, pathname } = new URL(
              CORE_MANAGER_URLSProvider.URLS.dedicated,
            );
            window.location.replace(`${origin}${pathname}#${path}`);
          },
        );
      });

      $urlServiceProvider.rules.otherwise('/');
      $locationProvider.html5Mode(false);
    },
  )
  .config((responsivePopoverProvider) => {
    // tell to the module that we consider a mobile device with at least 800px width
    responsivePopoverProvider.setMobileMediaQuery('(max-width: 800px)');
  })
  .config((ouiTableConfigurationProvider) => {
    ouiTableConfigurationProvider
      .setCssConfig({
        tablePanel: 'oui-datagrid-panel',
        table: 'oui-datagrid oui-datagrid_responsive',
        thead: 'oui-datagrid__headers',
        tbody: 'oui-datagrid__body',
        tr: 'oui-datagrid__row',
        th: 'oui-datagrid__header',
        td: 'oui-datagrid__cell',
        sortable: 'oui-datagrid__cell_sortable oui-datagrid__cell_sortable-asc',
        sorted: 'oui-datagrid__cell_sorted',
        sortableAsc: 'oui-datagrid__cell_sortable-asc',
        sortableDesc: 'oui-datagrid__cell_sortable-desc',
        closed: 'oui-datagrid__row_closed',
        emptyTable: 'oui-datagrid-empty',
      })
      .setPageSize(10).setExpandButtonTemplate(`
                <i role="button"
                    class="oui-icon oui-icon-chevron-right oui-datagrid__expand-button"></i>
            `).setSelectorTemplate(`<div class="oui-checkbox">
                <input class="oui-checkbox__input"
                  id="{{$name}}"
                  type="checkbox"
                  data-ng-model="$value"
                  data-ng-change="$onChange()">
                <label class="oui-checkbox__label-container" for="{{$name}}">
                  <span class="oui-checkbox__icon"></span>
                  <span class="oui-checkbox__label"></span>
                </label>
              </div>
            `);
  })
  .config(
    /* @ngInject */ (CucConfigProvider, coreConfigProvider) => {
      CucConfigProvider.setRegion(coreConfigProvider.getRegion());
    },
  )
  .run(
    /* @ngInject */ ($state) => {
      $state.defaultErrorHandler((error) => {
        if (error.type === RejectType.ERROR) {
          $state.go(
            'error',
            {
              detail: {
                message: get(error.detail, 'data.message'),
                code: has(error.detail, 'headers')
                  ? error.detail.headers('x-ovh-queryId')
                  : null,
              },
            },
            { location: false },
          );
        }
      });
    },
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  )
  .run(/* @ngTranslationsInject:json ./common/translations */);

export default moduleName;

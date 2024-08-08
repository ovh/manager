/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'script-loader!moment/min/moment.min.js';
import 'jquery-ui/ui/core.js';
import 'jquery-ui/ui/widget.js';
import 'jquery-ui/ui/widgets/mouse.js';
import 'jquery-ui/ui/widgets/draggable.js';
import 'jquery-ui/ui/widgets/droppable.js';
import 'jquery-ui/ui/widgets/resizable.js';
import 'angular';
import 'angular-aria';
import 'angular-route';
import 'angular-sanitize';
import 'angular-cookies';
import 'angular-messages';
import 'angular-resource';
import 'script-loader!flatpickr/dist/flatpickr.min.js';
import '@ovh-ux/ui-kit';
import 'script-loader!jquery.scrollto/jquery.scrollTo.min.js';
import 'script-loader!angular-dynamic-locale/dist/tmhDynamicLocale.js';
import 'bootstrap';
import 'angular-ui-bootstrap';
import '@ovh-ux/ng-ovh-utils';
import 'punycode';
import 'script-loader!urijs/src/URI.min.js';
import 'script-loader!filesize/lib/filesize.js';
import 'angularjs-scroll-glue';
import 'angular-xeditable';
import 'script-loader!jsurl/lib/jsurl.js';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-translate-loader-static-files';
import 'ng-slide-down';
import 'script-loader!matchmedia-ng/matchmedia-ng.js';
import 'ovh-api-services';
import 'script-loader!clipboard/dist/clipboard.min.js';

// Ckeditor 4.x
import 'ng-ckeditor';

/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */
import filter from 'lodash/filter';
import forEach from 'lodash/forEach';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import set from 'lodash/set';

import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import { registerCoreModule } from '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngOvhContracts from '@ovh-ux/ng-ovh-contracts';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhSwimmingPoll from '@ovh-ux/ng-ovh-swimming-poll';
import ngOvhProxyRequest from '@ovh-ux/ng-ovh-proxy-request';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngTailLogs from '@ovh-ux/ng-tail-logs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';
import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import * as dateFnsLocales from 'date-fns/locale';
import emailDomain from '@ovh-ux/manager-email-domain';
import emailpro from '@ovh-ux/manager-emailpro';
import exchange from '@ovh-ux/manager-exchange';
import office from '@ovh-ux/manager-office';
import WebPaas from '@ovh-ux/manager-web-paas';
import '@ovh-ux/manager-filters';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

import getConfig from './config/config';
import domain from './domain';
import domainDnsZone from './dns-zone';
import errorPage from './error-page/error-page.module';
import hosting from './hosting';
import privateDatabase from './private-database';
import zone from './domain/zone/zone.module';
import domainOperationTable from './domain-operation/operation-table/operation-table.module';

import hostingEmail from './hosting/email';
import hostingEmailActivateModule from './hosting/email/activate';
import ovhManagerDomainOperationModule from './domain-operation/domain-operation.module';

import wucAlldom from './components/alldom';
import wucAutorenewInvite from './components/autorenew-invite';
import wucCron from './components/cron';
import wucCronValidator from './components/cron-validator';
import wucExpiration from './components/expiration';
import wucOvhFileReader from './components/ovhFileReader';
import wucProgressBarElementCounter from './components/progressBarElementCounter';
import wucServiceStatus from './components/service-status';
import './css/source.less';
import './css/source.scss';

import { TRACKING } from './at-internet.constants';
import { DOMAIN_ORDER_URL, HOSTING_ORDER_URL, SANITIZATION } from './constants';

const getEnvironment = (shellClient) => {
  return shellClient.environment.getEnvironment();
};

const getLocale = (shellClient) => {
  return shellClient.i18n.getLocale();
};

const getDateFnsLocale = (language) => {
  if (language === 'en_GB') {
    return 'enGB';
  }
  if (language === 'fr_CA') {
    return 'frCA';
  }
  const [locale] = language.split('_');
  return locale;
};

export default async (containerEl, shellClient) => {
  const moduleName = 'App';

  const [environment, locale] = await Promise.all([
    getEnvironment(shellClient),
    getLocale(shellClient),
  ]);

  const config = getConfig(environment.getRegion());

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngPaginationFront,
        'ngOvhUtils',
        'ui.bootstrap',
        'ngAria',
        'ngRoute',
        'ngResource',
        'ngSanitize',
        'controllers',
        'services',
        'filters',
        'directives',
        ngQAllSettled,
        'ngMessages',
        'xeditable',
        registerAtInternet(shellClient.tracking),
        ngAtInternetUiRouterPlugin,
        ngOvhApiWrappers,
        ngOvhChart,
        ngOvhContracts,
        ngOvhContracts,
        ngOvhExportCsv,
        ngOvhFeatureFlipping,
        ngOvhHttp,
        ngOvhSsoAuth,
        ngOvhSwimmingPoll,
        ngOvhProxyRequest,
        ngOvhUserPref,
        ngOvhWebUniverseComponents,
        ngTranslateAsyncLoader,
        ngUiRouterBreadcrumb,
        ngUiRouterLayout,
        uiRouter,
        'pascalprecht.translate',
        ngTailLogs,
        'ovh-api-services',
        ovhManagerAtInternetConfiguration,
        ovhManagerAccountMigration,
        ovhManagerBanner,
        ovhManagerCatalogPrice,
        ovhManagerProductOffers,
        'oui',
        'ovhManagerFilters',
        emailpro,
        exchange,
        office,
        domain,
        domainDnsZone,
        emailDomain,
        errorPage,
        hosting,
        privateDatabase,
        zone,
        domainOperationTable,
        hostingEmail,
        hostingEmailActivateModule,
        ovhManagerDomainOperationModule,
        WebPaas,
        wucAlldom,
        wucAutorenewInvite,
        wucCron,
        wucCronValidator,
        wucExpiration,
        wucOvhFileReader,
        wucProgressBarElementCounter,
        wucServiceStatus,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .constant('shellClient', shellClient)
    .constant('constants', {
      prodMode: config.prodMode,
      aapiRootPath: config.aapiRootPath,
      target: config.target,
      renew: config.constants.RENEW_URL,
      urls: config.constants.URLS,
      comodo: config.constants.COMODO,
      sectigo: config.constants.SECTIGO,
      TOP_GUIDES: config.constants.TOP_GUIDES,
      swsProxyRootPath: 'apiv6/',
      aapiHeaderName: 'X-Ovh-Session',
      flags_options: config.constants.flags_options,
      algorithm_options: config.constants.algorithm_options,
      HOSTING: config.constants.HOSTING,
      DOMAIN: config.constants.DOMAIN,
      WEBSITE_URLS: config.constants.website_url,
      new_bdd_user_grant_options: config.constants.new_bdd_user_grant_options,
      ORDER_URL: config.constants.ORDER_URL,
    })
    .constant('website_url', config.constants.website_url)
    .factory('serviceTypeInterceptor', () => ({
      // eslint-disable-next-line no-shadow
      request: (config) => {
        if (/^(\/?engine\/)?2api(-m)?\//.test(config.url)) {
          set(
            config,
            'url',
            config.url.replace(/^(\/?engine\/)?2api(-m)?/, ''),
          );
          set(config, 'serviceType', 'aapi');
        }

        if (/^apiv6\//.test(config.url)) {
          set(config, 'url', config.url.replace(/^apiv6/, ''));
          set(config, 'serviceType', 'apiv6');
        }

        return config;
      },
    }))
    .config([
      '$qProvider',
      ($qProvider) => {
        $qProvider.errorOnUnhandledRejections(false);
      },
    ])
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider, coreURLBuilderProvider) => {
        ovhPaymentMethodProvider.setPaymentMethodPageUrl(
          coreURLBuilderProvider.buildURL(
            'dedicated',
            '#/billing/payment/method',
          ),
        );
        ovhPaymentMethodProvider.setUserLocale(locale);
      },
    )
    .config(
      /* @ngInject */ (ovhProxyRequestProvider) => {
        ovhProxyRequestProvider.proxy('$http');
        ovhProxyRequestProvider.pathPrefix('apiv6');
      },
    )
    .config([
      'tmhDynamicLocaleProvider',
      (tmhDynamicLocaleProvider) => {
        tmhDynamicLocaleProvider.localeLocationPattern(
          'resources/angular/i18n/angular-locale_{{locale}}.js',
        );
      },
    ])
    .config([
      'OvhHttpProvider',
      'constants',
      (OvhHttpProvider, constants) => {
        set(OvhHttpProvider, 'rootPath', constants.swsProxyPath);
        set(OvhHttpProvider, 'clearCacheVerb', ['POST', 'PUT', 'DELETE']);
        set(OvhHttpProvider, 'returnSuccessKey', 'data'); // By default, request return response.data
        set(OvhHttpProvider, 'returnErrorKey', 'data'); // By default, request return error.data
      },
    ])
    .config(
      /* @ngInject */ (ssoAuthenticationProvider) => {
        ssoAuthenticationProvider.setOnLogin(() => {
          shellClient.auth.login();
        });
        ssoAuthenticationProvider.setOnLogout(() => {
          shellClient.auth.logout();
        });
      },
    )
    .config([
      '$compileProvider',
      '$logProvider',
      'constants',
      ($compileProvider, $logProvider, constants) => {
        // Debug mode and logs are disabled in production
        $compileProvider.debugInfoEnabled(!constants.prodMode);
        $compileProvider.aHrefSanitizationWhitelist(SANITIZATION.regex);
        $logProvider.debugEnabled(!constants.prodMode);
      },
    ])
    .config(async () => {
      await shellClient.tracking.setConfig(environment.getRegion(), TRACKING);
    })
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setSkipInit(true);
        atInternetConfigurationProvider.setReplacementRules([
          {
            pattern: /^app/,
            replacement: 'web',
          },
        ]);
      },
    )
    .config([
      '$locationProvider',
      ($locationProvider) => {
        $locationProvider.hashPrefix('');
      },
    ])
    .constant('URLS_REDIRECTED_TO_DEDICATED', [
      new RegExp('^/useraccount/.*'),
      new RegExp('^/billing/.*'),
      new RegExp('^/contact/.*'),
    ])
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName(
          environment.getApplicationName(),
        );
      },
    )
    .config(
      /* @ngInject */
      (
        $urlRouterProvider,
        coreURLBuilderProvider,
        URLS_REDIRECTED_TO_DEDICATED,
      ) => {
        forEach(URLS_REDIRECTED_TO_DEDICATED, (url) => {
          $urlRouterProvider.when(url, [
            '$window',
            '$location',
            ($window, $location) => {
              const lastPartOfUrl = $location.url().substring(1);
              set(
                $window,
                'location',
                coreURLBuilderProvider.buildURL(
                  'dedicated',
                  `#/${lastPartOfUrl}`,
                ),
              );
            },
          ]);
        });

        $urlRouterProvider.otherwise('/configuration');
      },
    )
    .constant('COMPOSED_TLD', [
      'org.pl',
      'net.pl',
      'com.pl',
      'miasto.pl',
      'co.uk',
      'me.uk',
      'org.uk',
      'ac.uk',
      'asn.au',
      'com.au',
      'net.au',
      'id.au',
      'org.au',
      'edu.au',
      'gov.au',
      'csiro.au',
      'act.au',
      'nsw.au',
      'nt.au',
      'qld.au',
      'sa.au',
      'tas.au',
      'vic.au',
      'wa.au',
      'ac.za',
      'gov.za',
      'law.za',
      'mil.za',
      'school.za',
      'net.za',
      'ltd.uk',
      'plc.uk',
      'net.uk',
      'sch.uk',
      'gov.uk',
      'mod.uk',
      'mil.uk',
      'nhs.uk',
      'police.uk',
      'tm.fr',
      'com.fr',
      'asso.fr',
      'gov.fr',
      'ovh.net',
      'com.af',
      'org.af',
      'net.af',
      'edu.af',
      'ac.be',
      'ab.ca',
      'bc.ca',
      'mb.ca',
      'nb.ca',
      'nf.ca',
      'nl.ca',
      'ns.ca',
      'nt.ca',
      'nu.ca',
      'on.ca',
      'pe.ca',
      'qc.ca',
      'sk.ca',
      'yk.ca',
      'aeroport.fr',
      'assedic.fr',
      'avocat.fr',
      'avoues.fr',
      'cci.fr',
      'chambagri.fr',
      'chirurgiens-dentistes.fr',
      'experts-comptables.fr',
      'geometre-expert.fr',
      'gouv.fr',
      'greta.fr',
      'huissier-justice.fr',
      'medecin.fr',
      'notaires.fr',
      'pharmacien.fr',
      'port.fr',
      'veterinaire.fr',
      'aid.pl',
      'agro.pl',
      'atm.pl',
      'auto.pl',
      'biz.pl',
      'edu.pl',
      'gmina.pl',
      'gsm.pl',
      'info.pl',
      'mail.pl',
      'miasta.pl',
      'media.pl',
      'mil.pl',
      'nieruchomosci.pl',
      'nom.pl',
      'pc.pl',
      'powiat.pl',
      'priv.pl',
      'realestate.pl',
      'rel.pl',
      'sex.pl',
      'shop.pl',
      'sklep.pl',
      'sos.pl',
      'szkola.pl',
      'targi.pl',
      'tm.pl',
      'tourism.pl',
      'travel.pl',
      'turystyka.pl',
    ])
    .run(
      /* @ngInject */
      ($location, URLS_REDIRECTED_TO_DEDICATED, coreURLBuilder) => {
        forEach(
          filter(URLS_REDIRECTED_TO_DEDICATED, (url) =>
            url.test(window.location.href),
          ),
          () => {
            const lastPartOfUrl = $location.url().substring(1);
            window.location = coreURLBuilder.buildURL(
              'dedicated',
              `#/${lastPartOfUrl}`,
            );
          },
        );
      },
    )
    .run([
      '$rootScope',
      ($rootScope) => {
        $rootScope.$on('$locationChangeStart', () => {
          // eslint-disable-next-line no-param-reassign
          delete $rootScope.isLeftMenuVisible;
        });
      },
    ])
    .run([
      '$location',
      ($location) => {
        const queryParams = $location.search();

        if (queryParams && queryParams.redirectTo) {
          $location.path(queryParams.redirectTo);
          delete queryParams.redirectTo;
          $location.search(queryParams);
        }
      },
    ])
    .run(
      /* @ngInject */ ($translate) => {
        let lang = $translate.use();

        if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
          lang = lang.toLowerCase().replace('_', '-');
        } else {
          [lang] = lang.split('_');
        }

        return import(`script-loader!moment/locale/${lang}.js`).then(() =>
          moment.locale(lang),
        );
      },
    )

    .config(
      /* @ngInject */ (ouiCalendarConfigurationProvider) => {
        const [lang] = locale.split('_');
        return import(`flatpickr/dist/l10n/${lang}.js`)
          .then((module) => {
            ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
          })
          .catch(() => {});
      },
    )
    .run([
      'storage',
      (storage) => {
        storage.setKeyPrefix('UNIVERS-WEB');
      },
    ])
    .run((editableOptions, editableThemes) => {
      set(editableOptions, 'theme', 'default');

      // overwrite submit button template
      set(
        editableThemes,
        'default.submitTpl',
        [
          '<button style="background:none;border:none" type="submit">',
          '<i class="fa fa-check green"></i>',
          '</button>',
        ].join(''),
      );
      set(
        editableThemes,
        'default.cancelTpl',
        [
          '<button style="background:none;border:none" ng-click="$form.$cancel()">',
          '<i class="fa fa-times red"></i>',
          '</button>',
        ].join(''),
      );
    })
    .constant('UNIVERSE', 'WEB')
    .constant('DATEFNS_LOCALE', dateFnsLocales[getDateFnsLocale(locale)])
    .run(
      /* @ngInject */ ($rootScope, $state, $transitions) => {
        $transitions.onStart({}, () => {
          $('#currentAction').modal('hide');
          $('.modal-backdrop').remove();
          $('.help4wizards').removeClass('open');
        });
        $transitions.onError({}, (transition) => {
          const error = transition.error();
          if (error.type === RejectType.ERROR) {
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  status: error.detail?.status,
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
                to: {
                  state: transition.to(),
                  params: transition.params(),
                },
              },
              { location: false },
            );
          }
        });
        $state.defaultErrorHandler((error) => {
          return error;
        });
      },
    )
    .run(/* @ngTranslationsInject:json ./core/translations */)
    .run(
      /* @ngInject */ ($transitions) => {
        // replace ngOvhUiRouterLineProgress if in container
        if (!isTopLevelApplication()) {
          $transitions.onBefore({}, (transition) => {
            if (
              !transition.ignored() &&
              transition.from().name !== '' &&
              transition.entering().length > 0
            ) {
              shellClient.ux.startProgress();
            }
          });

          $transitions.onSuccess({}, () => {
            shellClient.ux.stopProgress();
          });

          $transitions.onError({}, (transition) => {
            if (!transition.error().redirected) {
              shellClient.ux.stopProgress();
            }
          });
        }
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          if (!isTopLevelApplication()) {
            shellClient.ux.hidePreloader();
          }
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .provider(
      'DOMAIN_ORDER_URL',
      /* @ngInject */ (coreConfigProvider) => ({
        $get: () => DOMAIN_ORDER_URL[coreConfigProvider.getRegion()],
      }),
    )
    .provider(
      'HOSTING_ORDER_URL',
      /* @ngInject */ (coreConfigProvider) => ({
        $get: () => HOSTING_ORDER_URL[coreConfigProvider.getRegion()],
      }),
    );

  import('./app.bundle').then(() =>
    angular.bootstrap(containerEl, [moduleName], {
      strictDi: false,
    }),
  );

  return moduleName;
};

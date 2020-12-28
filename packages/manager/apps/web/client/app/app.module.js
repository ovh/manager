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
import 'script-loader!validator/validator.min.js';
import 'angular-xeditable';
import 'script-loader!jsurl/lib/jsurl.js';
import 'angular-translate';
import 'angular-translate-loader-partial';
import 'angular-translate-loader-static-files';
import 'ng-slide-down';
import 'script-loader!matchmedia-ng/matchmedia-ng.js';
import 'ovh-api-services';
import 'script-loader!clipboard/dist/clipboard.min.js';
import 'script-loader!bootstrap-tour/build/js/bootstrap-tour-standalone.min.js';

// Ckeditor 4.x
import 'ng-ckeditor';

import 'bootstrap-tour/build/css/bootstrap-tour.min.css';

/* eslint-enable import/no-webpack-loader-syntax, import/no-unresolved, import/extensions */

import moduleName from './app';
import './app.routes';
import './app.controller';

import './components/angular-ui-router/angular-ui-router.module';
import './components/components.module';
import './components/directives.module';
import './components/filters.module';
import './components/services.module';
import './controller.module';
import './domain/general-informations/activateZone/activate.module';
import './domain/zone/activate/activate.module';
import './domain/zone/zone.module';
import './error-page/error-page.module';
import './hosting/cdn/flush/hosting-cdn-flush.module';
import './hosting/cdn/order/hosting-cdn-order.module';
import './hosting/cdn/terminate/hosting-cdn-terminate.module';
import './hosting/database/hosting-database.module';
import './hosting/email/activate/activate.module';
import './hosting/email/terminate/hosting-email-terminate.module';
import './hosting/general-informations/general-informations.module';
import './hosting/hosting.module';
import './hosting/website-coach/website-coach.module';

import './components/user/user-session.service';
import './components/user/user.controller';
import './components/user/user.service';
import './components/webApp.controller';

import './config/config.bundle';
import './configuration/configuration.bundle';
import './dns-zone/dns-zone.bundle';
import './domain/domain.bundle';
import './domain-operation/domain-operation.bundle';
import './domains/domains.bundle';
import './double-authentication/double-authentication.bundle';
import './email-domain/email-domain.bundle';
import './hosting/hosting.bundle';
import './incident/incident.bundle';
import './private-database/private-database.bundle';

export default moduleName;

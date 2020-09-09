import angular from 'angular';

import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@ovh-ux/manager-telecom-styles';
import 'angular-messages';
import ngOvhCheckboxTable from '@ovh-ux/ng-ovh-checkbox-table';
import '@ovh-ux/ng-pagination-front';
import 'ovh-api-services';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'font-awesome/css/font-awesome.css';

import './telecom-sms.less';

import constant from './telecom-sms.constant';

import batches from './batches';
import dashboard from './dashboard';
import guides from './guides';
import options from './options';
import order from './order';
import phonebooks from './phonebooks';
import receivers from './receivers';
import senders from './senders';
import sms from './sms';
import users from './users';

import routing from './sms.routing';
import './telecom-sms.scss';

const moduleName = 'ovhManagerSmsComponent';

angular
  .module(moduleName, [
    'ngOvhTelecomUniverseComponents',
    'ngPaginationFront',
    ngOvhCheckboxTable,
    'ovh-api-services',
    'ngMessages',
    batches,
    dashboard,
    guides,
    options,
    order,
    phonebooks,
    receivers,
    senders,
    sms,
    users,
    ngOvhFeatureFlipping,
  ])
  .constant('SMS_URL', constant.SMS_URL)
  .constant('SMS_GUIDES', constant.SMS_GUIDES)
  .constant('SMS_ALERTS', constant.SMS_ALERTS)
  .constant('SMS_PHONEBOOKS', constant.SMS_PHONEBOOKS)
  .config(routing);

export default moduleName;

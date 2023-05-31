import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';

import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import uiKit from '@ovh-ux/ui-kit';

import resolves from './resolves';
import routes from './routes';
import services from './services';
import components from './components';

import identities from './identities';
import onboarding from './onboarding';
import policy from './policy';

import routing from './iam.routing';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './iam.styles.scss';

const moduleName = 'ovhManagerIAM';

angular
  .module(moduleName, [
    OnboardingLayoutHelper,
    angularTranslate,
    uiRouter,
    ngOvhFeatureFlipping,
    ngOvhUtils,
    uiKit,
    resolves,
    routes,
    services,
    components,

    identities,
    onboarding,
    policy,
  ])
  .config(routing);

export default moduleName;

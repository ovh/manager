import angular from 'angular';
import { OnboardingLayoutHelper } from '@ovh-ux/manager-ng-layout-helpers';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './managed-backup-for-vmware-onboarding.component';

const moduleName =
  'ovhManagerDedicatedCloudDatacenterBackupManagedBackupForVmwareOnboarding';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    ngAtInternet,
    OnboardingLayoutHelper,
  ])
  .component(
    'dedicatedCloudDatacenterBackupManagedBackupForVmwareOnboarding',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;

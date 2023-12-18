import angular from 'angular';

import cucAdvancedOptions from './cui/advanced-options';
import cucAnnouncementBanner from './pci-announcement-banner';
import cucAutofocus from './autofocus';
import cucConfig from './config';
import cucFeatureAvailability from './featureAvailability';
import cucGuides from './guides-header';
import cucHelper from './helper';
import cucMaintenanceBanner from './pci-maintenance-banner';
import cucMessage from './message';
import cucMomentFormat from './moment';
import cucNavigation from './navigation';
import cucPoll from './poll';
import cucPrice from './price';
import cucProducts from './products';
import cucRegionList from './regions-list';
import cucTrustedZoneBannder from './trusted-zone-banner';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular.module(moduleName, [
  cui,
  cucAnnouncementBanner,
  cucAdvancedOptions,
  cucAutofocus,
  cucConfig,
  cucGuides,
  cucFeatureAvailability,
  cucHelper,
  cucMaintenanceBanner,
  cucMessage,
  cucMomentFormat,
  cucNavigation,
  cucPoll,
  cucPrice,
  cucProducts,
  cucRegionList,
  cucTrustedZoneBannder,
  cucVrack,
  cui,
]);

export default moduleName;

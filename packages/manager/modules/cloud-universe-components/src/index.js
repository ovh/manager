import angular from 'angular';

import cucAutofocus from './autofocus';
import cucAutoSelect from './autoselect';
import cucClickEnterOnKeypress from './clickEnterOnKeypress';
import cucConfig from './config';
import cucFeatureAvailability from './featureAvailability';
import cucHelper from './helper';
import cucHighlightedElement from './highlightedElement';
import cucMessage from './message';
import cucNavigation from './navigation';
import cucOrderedHash from './orderedHash';
import cucPoll from './poll';
import cucProducts from './products';
import cucSmoothScrollHere from './smoothScrollHere';
import cucVrack from './vrack';
import cui from './cui';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucAutofocus,
    cucAutoSelect,
    cucClickEnterOnKeypress,
    cucConfig,
    cucFeatureAvailability,
    cucHelper,
    cucHighlightedElement,
    cucMessage,
    cucNavigation,
    cucOrderedHash,
    cucPoll,
    cucProducts,
    cucSmoothScrollHere,
    cucVrack,
    cui,
  ]);

export default moduleName;

import angular from 'angular';

import cui from './cui';
import cucAutofocus from './autofocus';
import cucAutoSelect from './autoselect';
import cucClickEnterOnKeypress from './clickEnterOnKeypress';
import cucMessage from './message';
import cucNavigation from './navigation';
import cucPoll from './poll';
import cucProducts from './products';
import cucSmoothScrollHere from './smoothScrollHere';

const moduleName = 'ngOvhCloudUniverseComponents';

angular
  .module(moduleName, [
    cui,
    cucAutofocus,
    cucAutoSelect,
    cucClickEnterOnKeypress,
    cucMessage,
    cucNavigation,
    cucPoll,
    cucProducts,
    cucSmoothScrollHere,
  ]);

export default moduleName;

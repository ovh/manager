import packVoipLine from '../slots/voipLine/pack-voipLine.html';
import packTask from '../slots/task/pack-task.html';
import packVoipEcoFax from '../slots/voipEcoFax/pack-voipEcoFax.html';
import packXdslAccess from '../slots/xdslAccess/pack-xdslAccess.html';

export default /* @ngInject */ ($templateCache) => {
  // import templates required by ng-include
  $templateCache.put(
    'app/telecom/pack/slots/voipLine/pack-voipLine.html',
    packVoipLine,
  );
  $templateCache.put('app/telecom/pack/slots/task/pack-task.html', packTask);
  $templateCache.put(
    'app/telecom/pack/slots/voipEcoFax/pack-voipEcoFax.html',
    packVoipEcoFax,
  );
  $templateCache.put(
    'app/telecom/pack/slots/xdslAccess/pack-xdslAccess.html',
    packXdslAccess,
  );
};

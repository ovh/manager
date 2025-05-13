import contactTemplate from './contact/contact.html';
import successTemplate from './success/success.html';

import ciscoTemplate from './procedure/cisco/cisco.html';
import gigasetTemplate from './procedure/gigaset/gigaset.html';
import lgTemplate from './procedure/lg/lg.html';
import linksysTemplate from './procedure/linksys/linksys.html';
import polycomTemplate from './procedure/polycom/polycom.html';
import siemensTemplate from './procedure/siemens/siemens.html';
import thomsonTemplate from './procedure/thomson/thomson.html';

export default /* @ngInject */ ($templateCache) => {
  // import templates required by ng-include
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/contact/contact.html',
    contactTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/success/success.html',
    successTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/cisco/cisco.html',
    ciscoTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/gigaset/gigaset.html',
    gigasetTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/lg/lg.html',
    lgTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/linksys/linksys.html',
    linksysTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/polycom/polycom.html',
    polycomTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/siemens/siemens.html',
    siemensTemplate,
  );
  $templateCache.put(
    'app/telecom/telephony/line/assist/troubleshooting/procedure/thomson/thomson.html',
    thomsonTemplate,
  );
};

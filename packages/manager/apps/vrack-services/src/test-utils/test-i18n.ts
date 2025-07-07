import {
  NAMESPACES,
  NAMESPACE_PREFIX,
} from '@ovh-ux/manager-common-translations';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';
import common from '../../public/translations/vrack-services/Messages_fr_FR.json';
import create from '../../public/translations/vrack-services/create/Messages_fr_FR.json';
import dashboard from '../../public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import associate from '../../public/translations/vrack-services/associate/Messages_fr_FR.json';
import listing from '../../public/translations/vrack-services/listing/Messages_fr_FR.json';
import dissociate from '../../public/translations/vrack-services/dissociate/Messages_fr_FR.json';
import onboarding from '../../public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import createVrack from '../../public/translations/vrack-services/create-vrack/Messages_fr_FR.json';
import endpoints from '../../public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import subnets from '../../public/translations/vrack-services/subnets/Messages_fr_FR.json';
import actions from '../../../../modules/common-translations/public/translations/actions/Messages_fr_FR.json';
import service from '../../../../modules/common-translations/public/translations/service/Messages_fr_FR.json';
import order from '../../../../modules/common-translations/public/translations/order/Messages_fr_FR.json';
import regionSelector from '../../public/translations/region-selector/Messages_fr_FR.json';

export const translations = {
  [TRANSLATION_NAMESPACES.common]: common,
  [TRANSLATION_NAMESPACES.create]: create,
  [TRANSLATION_NAMESPACES.dashboard]: dashboard,
  [TRANSLATION_NAMESPACES.associate]: associate,
  [TRANSLATION_NAMESPACES.listing]: listing,
  [TRANSLATION_NAMESPACES.dissociate]: dissociate,
  [TRANSLATION_NAMESPACES.onboarding]: onboarding,
  [TRANSLATION_NAMESPACES.createVrack]: createVrack,
  [TRANSLATION_NAMESPACES.endpoints]: endpoints,
  [TRANSLATION_NAMESPACES.subnets]: subnets,
  [TRANSLATION_NAMESPACES.regionSelector]: regionSelector,
  [NAMESPACES.ACTIONS]: actions,
  [NAMESPACES.SERVICE]: service,
  [NAMESPACES.ORDER]: order,
};

export const labels = {
  common,
  create,
  dashboard,
  associate,
  listing,
  dissociate,
  onboarding,
  createVrack,
  endpoints,
  subnets,
  actions,
  regionSelector,
  service,
  order,
};

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import common from '../../public/translations/vrack-services/Messages_fr_FR.json';
import create from '../../public/translations/vrack-services/create/Messages_fr_FR.json';
import dashboard from '../../public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import error from '../../../../../manager-react-components/src/components/templates/error/translations/Messages_fr_FR.json';
import associate from '../../public/translations/vrack-services/associate/Messages_fr_FR.json';
import listing from '../../public/translations/vrack-services/listing/Messages_fr_FR.json';
import dissociate from '../../public/translations/vrack-services/dissociate/Messages_fr_FR.json';
import onboarding from '../../public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import createVrack from '../../public/translations/vrack-services/create-vrack/Messages_fr_FR.json';
import endpoints from '../../public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import subnets from '../../public/translations/vrack-services/subnets/Messages_fr_FR.json';
import actions from '../../../../modules/common-translations/public/translations/actions/Messages_fr_FR.json';
import regionSelector from '../../public/translations/region-selector/Messages_fr_FR.json';
import deleteModal from '../../../../../manager-react-components/src/components/templates/delete-modal/translations/Messages_fr_FR.json';

const APP_NAME = 'vrack-services';

export const translations = {
  [APP_NAME]: common,
  [`${APP_NAME}/create`]: create,
  [`${APP_NAME}/dashboard`]: dashboard,
  error,
  [`${APP_NAME}/associate`]: associate,
  [`${APP_NAME}/listing`]: listing,
  [`${APP_NAME}/dissociate`]: dissociate,
  [`${APP_NAME}/onboarding`]: onboarding,
  [`${APP_NAME}/create-vrack`]: createVrack,
  [`${APP_NAME}/endpoints`]: endpoints,
  [`${APP_NAME}/subnets`]: subnets,
  [NAMESPACES.ACTIONS]: actions,
  'region-selector': regionSelector,
  'delete-modal': deleteModal,
};

export const labels = {
  common,
  create,
  dashboard,
  error,
  associate,
  listing,
  dissociate,
  onboarding,
  createVrack,
  endpoints,
  subnets,
  actions,
  regionSelector,
  deleteModal,
};

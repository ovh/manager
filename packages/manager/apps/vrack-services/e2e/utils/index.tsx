import listingLabels from '../../public/translations/vrack-services/listing/Messages_fr_FR.json';
import generalLabels from '../../public/translations/vrack-services/Messages_fr_FR.json';
import associateLabels from '../../public/translations/vrack-services/associate/Messages_fr_FR.json';
import dissociateLabels from '../../public/translations/vrack-services/dissociate/Messages_fr_FR.json';
import createVrackLabels from '../../public/translations/vrack-services/create-vrack/Messages_fr_FR.json';
import createLabels from '../../public/translations/vrack-services/create/Messages_fr_FR.json';
import onboardingLabels from '../../public/translations/vrack-services/onboarding/Messages_fr_FR.json';
import dashboardLabels from '../../public/translations/vrack-services/dashboard/Messages_fr_FR.json';
import subnetsLabels from '../../public/translations/vrack-services/subnets/Messages_fr_FR.json';
import endpointsLabels from '../../public/translations/vrack-services/endpoints/Messages_fr_FR.json';
import updateNameModalLabels from '../../../../../manager-components/src/components/templates/update-name-modal/translations/Messages_fr_FR.json';
import deleteModalLabels from '../../../../../manager-components/src/components/templates/delete-modal/translations/Messages_fr_FR.json';

export * from './constants';
export * from './network';
export * from './action-menu';

export const labels = {
  ...listingLabels,
  ...createLabels,
  ...generalLabels,
  ...associateLabels,
  ...dissociateLabels,
  ...onboardingLabels,
  ...dashboardLabels,
  ...subnetsLabels,
  ...endpointsLabels,
  ...createVrackLabels,
};

export const managerComponentsLabels = {
  ...updateNameModalLabels,
  ...deleteModalLabels,
};

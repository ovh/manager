import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import datacentres from '../../public/translations/datacentres/Messages_fr_FR.json';
import datacentresCompute from '../../public/translations/datacentres/compute/Messages_fr_FR.json';
import datacentresOrder from '../../public/translations/datacentres/order/Messages_fr_FR.json';
import datacentresStorage from '../../public/translations/datacentres/storage/Messages_fr_FR.json';
import datacentresVrackSegment from '../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import networkAcl from '../../public/translations/networkAcl/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import terminate from '../../public/translations/terminate/Messages_fr_FR.json';
import zodError from '../../public/translations/zodError/Messages_fr_FR.json';

const error = {
  manager_error_page_title: 'Oops …!',
  manager_error_page_button_cancel: 'Annuler',
  manager_error_page_detail_code: "Code d'erreur : ",
  manager_error_page_action_reload_label: 'Réessayer',
  manager_error_page_action_home_label: "Retour à la page d'accueil",
  manager_error_page_default: 'Une erreur est survenue lors du chargement de la page.',
};

const commun = {
  actions: {
    confirm: 'Confirmer',
    cancel: 'Annuler',
    modify: 'Modifier',
  },
  dashboard: {
    description: 'Description',
    general_information: 'Informations générales',
    name: 'Nom',
  },
  contact: {
    contacts: 'Contacts',
    contact: 'Contact',
  },
  billing: {
    cancel_service: '"Résilier le service"',
  },
  system: {
    password: 'Mot de passe',
  },
  error: {
    error_message: 'Une erreur est survenue : {{message}}',
  },
  region: {
    localisation: 'Localisation',
    region: 'Région',
  },
  status: {
    status: 'Statut',
  },
};

export const translations = {
  listing,
  dashboard,
  onboarding,
  datacentres,
  'datacentres/compute': datacentresCompute,
  'datacentres/order': datacentresOrder,
  'datacentres/storage': datacentresStorage,
  'datacentres/vrack-segment': datacentresVrackSegment,
  error,
  terminate,
  networkAcl,
  '@ovh-ux/manager-common-translations/dashboard': commun.dashboard,
  '@ovh-ux/manager-common-translations/actions': commun.actions,
  '@ovh-ux/manager-common-translations/status': commun.status,
  '@ovh-ux/manager-common-translations/contact': commun.contact,
  '@ovh-ux/manager-common-translations/billing': commun.billing,
  '@ovh-ux/manager-common-translations/system': commun.system,
  '@ovh-ux/manager-common-translations/error': commun.error,
  '@ovh-ux/manager-common-translations/region': commun.region,
};

export const labels = {
  onboarding,
  dashboard,
  listing,
  error,
  datacentres,
  datacentresCompute,
  datacentresOrder,
  datacentresStorage,
  datacentresVrackSegment,
  terminate,
  networkAcl,
  commun,
  zodError,
};

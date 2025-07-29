import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import datacentres from '../../public/translations/datacentres/Messages_fr_FR.json';
import datacentresCompute from '../../public/translations/datacentres/compute/Messages_fr_FR.json';
import datacentresOrder from '../../public/translations/datacentres/order/Messages_fr_FR.json';
import datacentresStorage from '../../public/translations/datacentres/storage/Messages_fr_FR.json';
import datacentresVrackSegment from '../../public/translations/datacentres/vrack-segment/Messages_fr_FR.json';
import terminate from '../../public/translations/terminate/Messages_fr_FR.json';

const error = {
  manager_error_page_title: 'Oops …!',
  manager_error_page_button_cancel: 'Annuler',
  manager_error_page_detail_code: "Code d'erreur : ",
  manager_error_page_action_reload_label: 'Réessayer',
  manager_error_page_action_home_label: "Retour à la page d'accueil",
  manager_error_page_default:
    'Une erreur est survenue lors du chargement de la page.',
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
};

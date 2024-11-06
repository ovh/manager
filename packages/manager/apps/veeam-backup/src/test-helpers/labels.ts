import common from '../../public/translations/veeam-backup/Messages_fr_FR.json';
import orderVeeam from '../../public/translations/order-veeam/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import deleteVeeam from '../../public/translations/delete-veeam/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import { appName } from '../veeam-backup.config';

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
  [appName]: common,
  'order-veeam': orderVeeam,
  listing,
  dashboard,
  onboarding,
  'delete-veeam': deleteVeeam,
  error,
};

export const labels = {
  common,
  onboarding,
  orderVeeam,
  dashboard,
  deleteVeeam,
  listing,
  error,
};

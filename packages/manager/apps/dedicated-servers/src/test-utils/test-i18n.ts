import cluster from '../../public/translations/cluster/Messages_fr_FR.json';
import dedicated from '../../public/translations/dedicated-servers/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';

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
  cluster,
  dedicated,
  onboarding,
  error,
};

export const labels = {
  onboarding,
  error,
  cluster,
  dedicated,
};

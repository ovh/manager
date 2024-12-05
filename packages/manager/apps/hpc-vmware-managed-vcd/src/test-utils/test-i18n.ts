import listing from '../../public/translations/listing/Messages_fr_FR.json';
import dashboard from '../../public/translations/dashboard/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import common from '../../public/translations/hpc-vmware-managed-vcd/Messages_fr_FR.json';
import datacentres from '../../public/translations/hpc-vmware-managed-vcd/datacentres/Messages_fr_FR.json';
import datacentresCompute from '../../public/translations/hpc-vmware-managed-vcd/datacentres/compute/Messages_fr_FR.json';
import datacentresOrder from '../../public/translations/hpc-vmware-managed-vcd/datacentres/order/Messages_fr_FR.json';
import datacentresStorage from '../../public/translations/hpc-vmware-managed-vcd/datacentres/storage/Messages_fr_FR.json';
import { APP_NAME } from '../tracking.constant';

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
  [APP_NAME]: common,
  listing,
  dashboard,
  onboarding,
  [`${APP_NAME}/datacentres`]: datacentres,
  [`${APP_NAME}/datacentres/compute`]: datacentresCompute,
  [`${APP_NAME}/datacentres/order`]: datacentresOrder,
  [`${APP_NAME}/datacentres/storage`]: datacentresStorage,
  error,
};

export const labels = {
  common,
  onboarding,
  dashboard,
  listing,
  error,
  datacentres,
  datacentresCompute,
  datacentresOrder,
  datacentresStorage,
};

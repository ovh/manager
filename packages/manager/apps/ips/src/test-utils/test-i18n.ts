import order from '../../public/translations/order/Messages_fr_FR.json';
import listing from '../../public/translations/listing/Messages_fr_FR.json';
import onboarding from '../../public/translations/onboarding/Messages_fr_FR.json';
import ips from '../../public/translations/ips/Messages_fr_FR.json';
import error from '../../public/translations/error/Messages_fr_FR.json';
import regionSelector from '../../public/translations/region-selector/Messages_fr_FR.json';
import configureReverseDns from '../../public/translations/configure-reverse-dns/Messages_fr_FR.json';
import gameFirewall from '../../public/translations/game-firewall/Messages_fr_FR.json';
import common from '../../public/translations/common/Messages_fr_FR.json';
import { TRANSLATION_NAMESPACES } from '@/utils';

export const translations = {
  [TRANSLATION_NAMESPACES.ips]: ips,
  [TRANSLATION_NAMESPACES.order]: order,
  [TRANSLATION_NAMESPACES.listing]: listing,
  [TRANSLATION_NAMESPACES.onboarding]: onboarding,
  [TRANSLATION_NAMESPACES.error]: error,
  [TRANSLATION_NAMESPACES.regionSelector]: regionSelector,
  [TRANSLATION_NAMESPACES.configureReverseDns]: configureReverseDns,
  [TRANSLATION_NAMESPACES.gameFirewall]: gameFirewall,
  [TRANSLATION_NAMESPACES.common]: common,
};

export const labels = {
  ips,
  order,
  listing,
  onboarding,
  error,
  regionSelector,
  configureReverseDns,
  gameFirewall,
  common,
};

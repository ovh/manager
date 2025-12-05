import { GuidesHeader } from '@ovh-ux/manager-react-components';

export type Guide = Parameters<
  Parameters<typeof GuidesHeader>[0]['getGuideLabel']
>[0];

const PUBLIC_CLOUD_STORAGE_GUIDES = {
  ASIA:
    'https://help.ovhcloud.com/csm/asia-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  AU:
    'https://help.ovhcloud.com/csm/en-au-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  CA:
    'https://help.ovhcloud.com/csm/en-ca-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  DE:
    'https://help.ovhcloud.com/csm/de-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  DEFAULT:
    'https://help.ovhcloud.com/csm/en-gb-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  ES:
    'https://help.ovhcloud.com/csm/es-es-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  FR:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  GB:
    'https://help.ovhcloud.com/csm/en-gb-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  IE:
    'https://help.ovhcloud.com/csm/en-ie-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  IN:
    'https://help.ovhcloud.com/csm/en-in-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  IT:
    'https://help.ovhcloud.com/csm/it-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  MA:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  NL:
    'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  PL:
    'https://help.ovhcloud.com/csm/pl-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  PT:
    'https://help.ovhcloud.com/csm/pt-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  QC:
    'https://help.ovhcloud.com/csm/fr-ca-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  SG:
    'https://help.ovhcloud.com/csm/en-sg-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  SN:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  TN:
    'https://help.ovhcloud.com/csm/fr-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/sections/23498311424275-Object-Storage',
  WE:
    'https://help.ovhcloud.com/csm/en-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
  WS:
    'https://help.ovhcloud.com/csm/es-documentation-public-cloud-storage-object-storage?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938&kb_category=6f34d555f49801102d4ca4d466a7fd9b&spa=1',
};

const FIRST_STEPS_WITH_INSTANCES = {
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-first-steps/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/public-cloud-first-steps/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/public-cloud-first-steps/',
  DE: 'https://docs.ovh.com/de/public-cloud/public-cloud-erste-schritte/',
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
  ES: 'https://docs.ovh.com/es/public-cloud/public-cloud-primeros-pasos/',
  FR:
    'https://docs.ovh.com/fr/public-cloud/premiers-pas-instance-public-cloud/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/public-cloud-first-steps/',
  IN: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-first-steps/',
  IT: 'https://docs.ovh.com/it/public-cloud/primi-passi-public-cloud/',
  PL: 'https://docs.ovh.com/pl/public-cloud/public-cloud-pierwsze-kroki/',
  PT: 'https://docs.ovh.com/pt/public-cloud/public-cloud-primeiros-passos/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/public-cloud-first-steps/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/4481009956243-How-to-Manage-Your-Public-Cloud-Instance',
  WE: 'https://docs.ovh.com/us/en/public-cloud/public-cloud-first-steps/',
  WS: 'https://docs.ovh.com/us/es/public-cloud/public-cloud-primeros-pasos/',
};

const IP_FAIL_OVER = {
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/configure_a_failover_ip/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/configure_a_failover_ip/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/configure_a_failover_ip/',
  DE: 'https://docs.ovh.com/de/public-cloud/failover-ip-konfigurieren-pci/',
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/configure_a_failover_ip/',
  ES: 'https://docs.ovh.com/es/public-cloud/configurer-une-ip-failover/',
  FR: 'https://docs.ovh.com/fr/public-cloud/configurer_une_ip_failover/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/configure_a_failover_ip/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/configure_a_failover_ip/',
  IN: 'https://docs.ovh.com/asia/en/public-cloud/configure_a_failover_ip/',
  IT: 'https://docs.ovh.com/it/public-cloud/configura-un-ip-failover/',
  PL: 'https://docs.ovh.com/pl/public-cloud/konfiguracja-adresu-ip-failover/',
  PT: 'https://docs.ovh.com/pt/public-cloud/configurer-une-ip-failover/',
  QC: 'https://docs.ovh.com/ca/fr/public-cloud/configurer_une_ip_failover/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/configure_a_failover_ip/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360011668000-Purchasing-and-managing-Additional-IPs',
  WE: 'https://docs.ovh.com/us/en/public-cloud/configure_a_failover_ip/',
  WS: 'https://docs.ovh.com/us/es/public-cloud/configurer-une-ip-failover/',
};

const USER_ROOT_AND_PASSWORD = {
  ASIA:
    'https://docs.ovh.com/asia/en/public-cloud/become_the_root_user_and_select_a_password/',
  AU:
    'https://docs.ovh.com/au/en/public-cloud/become_the_root_user_and_select_a_password/',
  CA:
    'https://docs.ovh.com/ca/en/public-cloud/become_the_root_user_and_select_a_password/',
  DE:
    'https://docs.ovh.com/de/public-cloud/root-rechte_erlangen_und_passwort_festlegen/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/public-cloud/become_the_root_user_and_select_a_password/',
  ES:
    'https://docs.ovh.com/es/public-cloud/conectarse_como_usuario_root_y_establecer_una_contrasena/',
  FR:
    'https://docs.ovh.com/fr/public-cloud/passer-root-et-definir-un-mot-de-passe/',
  GB:
    'https://docs.ovh.com/gb/en/public-cloud/become_the_root_user_and_select_a_password/',
  IE:
    'https://docs.ovh.com/ie/en/public-cloud/become_the_root_user_and_select_a_password/',
  IN:
    'https://docs.ovh.com/asia/en/public-cloud/become_the_root_user_and_select_a_password/',
  IT:
    'https://docs.ovh.com/it/public-cloud/imposta_una_password_amministratore/',
  PL: 'https://docs.ovh.com/pl/public-cloud/dostep_root_i_zdefiniowanie_hasla/',
  PT:
    'https://docs.ovh.com/pt/public-cloud/tornar-se_root_e_definir_uma_palavra-passe/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/passer-root-et-definir-un-mot-de-passe/',
  SG:
    'https://docs.ovh.com/sg/en/public-cloud/become_the_root_user_and_select_a_password/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360002208690-How-to-Access-a-Public-Cloud-Instance-via-VNC',
  WE:
    'https://docs.ovh.com/us/en/public-cloud/become_the_root_user_and_select_a_password/',
  WS:
    'https://docs.ovh.com/us/es/public-cloud/conectarse_como_usuario_root_y_establecer_una_contrasena/',
};

const REVERSE_DNS = {
  ASIA:
    'https://docs.ovh.com/asia/en/public-cloud/configure-reverse-dns-instance/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/configure-reverse-dns-instance/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/configure-reverse-dns-instance/',
  DE: 'https://docs.ovh.com/de/public-cloud/reverse-dns-konfigurieren-instanz/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/public-cloud/configure-reverse-dns-instance/',
  ES:
    'https://docs.ovh.com/es/public-cloud/configurar-el-inverso-dns-de-una-instancia/',
  FR:
    'https://docs.ovh.com/fr/public-cloud/configurer-le-reverse-dns-dune-instance/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/configure-reverse-dns-instance/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/configure-reverse-dns-instance/',
  IN:
    'https://docs.ovh.com/asia/en/public-cloud/configure-reverse-dns-instance/',
  IT:
    'https://docs.ovh.com/it/public-cloud/configura_il_reverse_dns_della_tua_istanza/',
  PL:
    'https://docs.ovh.com/pl/public-cloud/konfiguracja_rewersu_dns_instancji/',
  PT:
    'https://docs.ovh.com/pt/public-cloud/configurar_a_reverse_dns_de_uma_instancia/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/configurer-le-reverse-dns-dune-instance/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/configure-reverse-dns-instance/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360002181530-How-to-Configure-Reverse-DNS',
  WE: 'https://docs.ovh.com/us/en/public-cloud/configure-reverse-dns-instance/',
  WS:
    'https://docs.ovh.com/us/es/public-cloud/configurar-el-inverso-dns-de-una-instancia/',
};

export const GUIDES: Record<string, Guide> = {
  public_cloud_storage_guides: {
    key: 'all_storage_guides',
    url: PUBLIC_CLOUD_STORAGE_GUIDES,
    tracking: '::guides::go_to_storage',
  },
  first_steps_with_instances: {
    key: 'first_steps_with_instances',
    url: FIRST_STEPS_WITH_INSTANCES,
    tracking: '::guides::go_to_instances_guide',
  },
  ip_fail_over: {
    key: 'ip_fail_over',
    url: IP_FAIL_OVER,
    tracking: '::guides::go_to_configure_a_failover_ip',
  },
  user_root_and_password: {
    key: 'user_root_and_password',
    url: USER_ROOT_AND_PASSWORD,
    tracking: '::guides::go_to_become_the_root_user_and_select_a_password',
  },
  reverse_dns: {
    key: 'reverse_dns',
    url: REVERSE_DNS,
    tracking: '::guides::go_to_configure_reverse_dns_instance',
  },
};

interface GuideLinks {
  [key: string]: string | undefined;
  FR?: string;
  GB: string;
  DE?: string;
  ES?: string;
  IT?: string;
  PL?: string;
  PT?: string;
  IE: string;
  DEFAULT: string;
  US?: string;
  ASIA: string;
  AU: string;
  CA: string;
  QC?: string;
  SG: string;
  WE: string;
  WS?: string;
  MA?: string;
  TN?: string;
  SN?: string;
  IN?: string;
}

interface Guide {
  key: string;
  url: GuideLinks;
  tracking?: string;
}

interface GuideList {
  storage: {
    [key: string]: Guide;
  };
}

export const PUBLIC_CLOUD_STORAGE_GUIDES: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/storage/',
  GB: 'https://docs.ovh.com/gb/en/storage/',
  DE: 'https://docs.ovh.com/de/storage/',
  ES: 'https://docs.ovh.com/es/storage/',
  IT: 'https://docs.ovh.com/it/storage/',
  PL: 'https://docs.ovh.com/pl/storage/',
  PT: 'https://docs.ovh.com/pt/storage/',
  IE: 'https://docs.ovh.com/ie/en/storage/',
  DEFAULT: 'https://docs.ovh.com/gb/en/storage/',
  US: 'https://support.us.ovhcloud.com/hc/en-us/sections/115000624590-Storage',
  ASIA: 'https://docs.ovh.com/asia/en/storage/',
  AU: 'https://docs.ovh.com/au/en/storage/',
  CA: 'https://docs.ovh.com/ca/en/storage/',
  QC: 'https://docs.ovh.com/ca/fr/storage/',
  SG: 'https://docs.ovh.com/sg/en/storage/',
  WE: 'https://docs.ovh.com/us/en/storage/',
  WS: 'https://docs.ovh.com/us/es/storage/',
  MA: 'https://docs.ovh.com/fr/storage/',
  TN: 'https://docs.ovh.com/fr/storage/',
  SN: 'https://docs.ovh.com/fr/storage/',
  IN: 'https://docs.ovh.com/asia/en/storage/',
};

export const FIRST_STEPS_WITH_INSTANCES: GuideLinks = {
  FR:
    'https://docs.ovh.com/fr/public-cloud/premiers-pas-instance-public-cloud/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
  DE: 'https://docs.ovh.com/de/public-cloud/public-cloud-erste-schritte/',
  ES: 'https://docs.ovh.com/es/public-cloud/public-cloud-primeros-pasos/',
  IT: 'https://docs.ovh.com/it/public-cloud/primi-passi-public-cloud/',
  PL: 'https://docs.ovh.com/pl/public-cloud/public-cloud-pierwsze-kroki/',
  PT: 'https://docs.ovh.com/pt/public-cloud/public-cloud-primeiros-passos/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/public-cloud-first-steps/',
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/public-cloud-first-steps/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/4481009956243-How-to-Manage-Your-Public-Cloud-Instance',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-first-steps/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/public-cloud-first-steps/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/public-cloud-first-steps/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/premiers-pas-instance-public-cloud/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/public-cloud-first-steps/',
  WE: 'https://docs.ovh.com/us/en/public-cloud/public-cloud-first-steps/',
  WS: 'https://docs.ovh.com/us/es/public-cloud/public-cloud-primeros-pasos/',
  IN: 'https://docs.ovh.com/asia/en/public-cloud/public-cloud-first-steps/',
};

export const IP_FAIL_OVER: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/public-cloud/configurer_une_ip_failover/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/configure_a_failover_ip/',
  DE: 'https://docs.ovh.com/de/public-cloud/failover-ip-konfigurieren-pci/',
  ES: 'https://docs.ovh.com/es/public-cloud/configurer-une-ip-failover/',
  IT: 'https://docs.ovh.com/it/public-cloud/configura-un-ip-failover/',
  PL: 'https://docs.ovh.com/pl/public-cloud/konfiguracja-adresu-ip-failover/',
  PT: 'https://docs.ovh.com/pt/public-cloud/configurer-une-ip-failover/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/configure_a_failover_ip/',
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/configure_a_failover_ip/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/115001588270-How-to-Order-Failover-IPs',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/configure_a_failover_ip/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/configure_a_failover_ip/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/configure_a_failover_ip/',
  QC: 'https://docs.ovh.com/ca/fr/public-cloud/configurer_une_ip_failover/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/configure_a_failover_ip/',
  WE: 'https://docs.ovh.com/us/en/public-cloud/configure_a_failover_ip/',
  WS: 'https://docs.ovh.com/us/es/public-cloud/configurer-une-ip-failover/',
  IN: 'https://docs.ovh.com/asia/en/public-cloud/configure_a_failover_ip/',
};

export const USER_ROOT_AND_PASSWORD: GuideLinks = {
  FR:
    'https://docs.ovh.com/fr/public-cloud/passer-root-et-definir-un-mot-de-passe/',
  GB:
    'https://docs.ovh.com/gb/en/public-cloud/become_the_root_user_and_select_a_password/',
  DE:
    'https://docs.ovh.com/de/public-cloud/root-rechte_erlangen_und_passwort_festlegen/',
  ES:
    'https://docs.ovh.com/es/public-cloud/conectarse_como_usuario_root_y_establecer_una_contrasena/',
  IT:
    'https://docs.ovh.com/it/public-cloud/imposta_una_password_amministratore/',
  PL: 'https://docs.ovh.com/pl/public-cloud/dostep_root_i_zdefiniowanie_hasla/',
  PT:
    'https://docs.ovh.com/pt/public-cloud/tornar-se_root_e_definir_uma_palavra-passe/',
  IE:
    'https://docs.ovh.com/ie/en/public-cloud/become_the_root_user_and_select_a_password/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/public-cloud/become_the_root_user_and_select_a_password/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360002208690-How-to-Access-a-Public-Cloud-Instance-via-VNC',
  ASIA:
    'https://docs.ovh.com/asia/en/public-cloud/become_the_root_user_and_select_a_password/',
  AU:
    'https://docs.ovh.com/au/en/public-cloud/become_the_root_user_and_select_a_password/',
  CA:
    'https://docs.ovh.com/ca/en/public-cloud/become_the_root_user_and_select_a_password/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/passer-root-et-definir-un-mot-de-passe/',
  SG:
    'https://docs.ovh.com/sg/en/public-cloud/become_the_root_user_and_select_a_password/',
  WE:
    'https://docs.ovh.com/us/en/public-cloud/become_the_root_user_and_select_a_password/',
  WS:
    'https://docs.ovh.com/us/es/public-cloud/conectarse_como_usuario_root_y_establecer_una_contrasena/',
  IN:
    'https://docs.ovh.com/asia/en/public-cloud/become_the_root_user_and_select_a_password/',
};

export const REVERSE_DNS: GuideLinks = {
  FR:
    'https://docs.ovh.com/fr/public-cloud/configurer-le-reverse-dns-dune-instance/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/configure-reverse-dns-instance/',
  DE: 'https://docs.ovh.com/de/public-cloud/reverse-dns-konfigurieren-instanz/',
  ES:
    'https://docs.ovh.com/es/public-cloud/configurar-el-inverso-dns-de-una-instancia/',
  IT:
    'https://docs.ovh.com/it/public-cloud/configura_il_reverse_dns_della_tua_istanza/',
  PL:
    'https://docs.ovh.com/pl/public-cloud/konfiguracja_rewersu_dns_instancji/',
  PT:
    'https://docs.ovh.com/pt/public-cloud/configurar_a_reverse_dns_de_uma_instancia/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/configure-reverse-dns-instance/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/public-cloud/configure-reverse-dns-instance/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/360002181530-How-to-Configure-Reverse-DNS',
  ASIA:
    'https://docs.ovh.com/asia/en/public-cloud/configure-reverse-dns-instance/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/configure-reverse-dns-instance/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/configure-reverse-dns-instance/',
  QC:
    'https://docs.ovh.com/ca/fr/public-cloud/configurer-le-reverse-dns-dune-instance/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/configure-reverse-dns-instance/',
  WE: 'https://docs.ovh.com/us/en/public-cloud/configure-reverse-dns-instance/',
  WS:
    'https://docs.ovh.com/us/es/public-cloud/configurar-el-inverso-dns-de-una-instancia/',
  IN:
    'https://docs.ovh.com/asia/en/public-cloud/configure-reverse-dns-instance/',
};

export const GUIDES_LIST: GuideList = {
  storage: {
    public_cloud_storage_guides: {
      url: PUBLIC_CLOUD_STORAGE_GUIDES,
      key: 'all_storage_guides',
      tracking: '::guides::go_to_storage',
    },
    first_steps_with_instances: {
      url: FIRST_STEPS_WITH_INSTANCES,
      key: 'first_steps_with_instances',
      tracking: '::guides::go_to_instances_guide',
    },
    ip_fail_over: {
      url: IP_FAIL_OVER,
      key: 'ip_fail_over',
      tracking: '::guides::go_to_configure_a_failover_ip',
    },
    user_root_and_password: {
      url: USER_ROOT_AND_PASSWORD,
      key: 'user_root_and_password',
      tracking: '::guides::go_to_become_the_root_user_and_select_a_password',
    },
    reverse_dns: {
      url: REVERSE_DNS,
      key: 'reverse_dns',
      tracking: '::guides::go_to_configure_reverse_dns_instance',
    },
  },
};

export default {
  GUIDES_LIST,
};

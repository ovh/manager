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
}

interface GuideList {
  storage: {
    [key: string]: Guide;
  };
  objectStorage: {
    [key: string]: Guide;
  };
  instances: {
    [key: string]: Guide;
  };
  databases: {
    [key: string]: Guide;
  };
  kubernetes: {
    [key: string]: Guide;
  };
  private_registry: {
    [key: string]: Guide;
  };
  ai_machine_learning: {
    [key: string]: Guide;
  };
  data_processing: {
    [key: string]: Guide;
  };
  ai_notenooks: {
    [key: string]: Guide;
  };
  ai_training: {
    [key: string]: Guide;
  };
  ml_serving: {
    [key: string]: Guide;
  };
  private_network: {
    [key: string]: Guide;
  };
}

export const PUBLIC_CLOUD_GUIDES: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/public-cloud/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/',
  DE: 'https://docs.ovh.com/de/public-cloud/',
  ES: 'https://docs.ovh.com/es/public-cloud/',
  IT: 'https://docs.ovh.com/it/public-cloud/',
  PL: 'https://docs.ovh.com/pl/public-cloud/',
  PT: 'https://docs.ovh.com/pt/public-cloud/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/',
  DEFAULT: 'https://docs.ovh.com/gb/en/public-cloud/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/categories/115000515130-Public-Cloud-Services',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/',
  CA: 'https://docs.ovh.com/ca/en/public-cloud/',
  QC: 'https://docs.ovh.com/ca/fr/public-cloud/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/',
  WE: 'https://docs.ovh.com/us/en/public-cloud/',
  WS: 'https://docs.ovh.com/us/es/public-cloud/',
  MA: 'https://docs.ovh.com/fr/public-cloud/',
  TN: 'https://docs.ovh.com/fr/public-cloud/',
  SN: 'https://docs.ovh.com/fr/public-cloud/',
  IN: 'https://docs.ovh.com/asia/en/public-cloud/',
};

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

export const FIRST_STEPS_WITH_DATABASES: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/publiccloud/databases/getting-started/',
  GB: 'https://docs.ovh.com/gb/en/publiccloud/databases/getting-started/',
  DE: 'https://docs.ovh.com/de/publiccloud/databases/getting-started/',
  ES: 'https://docs.ovh.com/es/publiccloud/databases/getting-started/',
  IT: 'https://docs.ovh.com/it/publiccloud/databases/getting-started/',
  PL: 'https://docs.ovh.com/pl/publiccloud/databases/getting-started/',
  PT: 'https://docs.ovh.com/pt/publiccloud/databases/getting-started/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/databases/getting-started/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/databases/getting-started/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/databases/getting-started/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/databases/getting-started/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/databases/getting-started/',
  QC: 'https://docs.ovh.com/ca/fr/publiccloud/databases/getting-started/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/databases/getting-started/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/databases/getting-started/',
  WS: 'https://docs.ovh.com/us/es/publiccloud/databases/getting-started/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/databases/getting-started/',
};

export const MONGO_DB_CAPABILITIES_AND_LIMITATIONS: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/publiccloud/databases/mongodb/capabilities/',
  GB: 'https://docs.ovh.com/gb/en/publiccloud/databases/mongodb/capabilities/',
  DE: 'https://docs.ovh.com/de/publiccloud/databases/mongodb/capabilities/',
  ES: 'https://docs.ovh.com/es/publiccloud/databases/mongodb/capabilities/',
  IT: 'https://docs.ovh.com/it/publiccloud/databases/mongodb/capabilities/',
  PL: 'https://docs.ovh.com/pl/publiccloud/databases/mongodb/capabilities/',
  PT: 'https://docs.ovh.com/pt/publiccloud/databases/mongodb/capabilities/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/databases/mongodb/capabilities/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/publiccloud/databases/mongodb/capabilities/',
  ASIA:
    'https://docs.ovh.com/asia/en/publiccloud/databases/mongodb/capabilities/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/databases/mongodb/capabilities/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/databases/mongodb/capabilities/',
  QC: 'https://docs.ovh.com/ca/fr/publiccloud/databases/mongodb/capabilities/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/databases/mongodb/capabilities/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/databases/mongodb/capabilities/',
  WS: 'https://docs.ovh.com/us/es/publiccloud/databases/mongodb/capabilities/',
  IN:
    'https://docs.ovh.com/asia/en/publiccloud/databases/mongodb/capabilities/',
};

export const MYSQL_CAPABILITIES_AND_LIMITATIONS: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/publiccloud/databases/mysql/capabilities/',
  GB: 'https://docs.ovh.com/gb/en/publiccloud/databases/mysql/capabilities/',
  DE: 'https://docs.ovh.com/de/publiccloud/databases/mysql/capabilities/',
  ES: 'https://docs.ovh.com/es/publiccloud/databases/mysql/capabilities/',
  IT: 'https://docs.ovh.com/it/publiccloud/databases/mysql/capabilities/',
  PL: 'https://docs.ovh.com/pl/publiccloud/databases/mysql/capabilities/',
  PT: 'https://docs.ovh.com/pt/publiccloud/databases/mysql/capabilities/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/databases/mysql/capabilities/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/publiccloud/databases/mysql/capabilities/',
  ASIA:
    'https://docs.ovh.com/asia/en/publiccloud/databases/mysql/capabilities/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/databases/mysql/capabilities/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/databases/mysql/capabilities/',
  QC: 'https://docs.ovh.com/ca/fr/publiccloud/databases/mysql/capabilities/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/databases/mysql/capabilities/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/databases/mysql/capabilities/',
  WS: 'https://docs.ovh.com/us/es/publiccloud/databases/mysql/capabilities/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/databases/mysql/capabilities/',
};

export const CREATE_A_CLUSTER: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/kubernetes/creating-a-cluster/',
  IE: 'https://docs.ovh.com/ie/en/kubernetes/creating-a-cluster/',
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/creating-a-cluster/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/1500004767902-How-to-Create-a-Cluster-in-OVHcloud-Managed-Kubernetes',
  ASIA: 'https://docs.ovh.com/asia/en/kubernetes/creating-a-cluster/',
  AU: 'https://docs.ovh.com/au/en/kubernetes/creating-a-cluster/',
  CA: 'https://docs.ovh.com/ca/en/kubernetes/creating-a-cluster/',
  SG: 'https://docs.ovh.com/sg/en/kubernetes/creating-a-cluster/',
  WE: 'https://docs.ovh.com/us/en/kubernetes/creating-a-cluster/',
};

export const DEPLOY_AN_APPLICATION: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/kubernetes/deploying-an-application/',
  IE: 'https://docs.ovh.com/ie/en/kubernetes/deploying-an-application/',
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/deploying-an-application/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/1500004771762-How-to-Deploy-an-Application-on-an-OVHcloud-Managed-Kubernetes-Cluster',
  ASIA: 'https://docs.ovh.com/asia/en/kubernetes/deploying-an-application/',
  AU: 'https://docs.ovh.com/au/en/kubernetes/deploying-an-application/',
  CA: 'https://docs.ovh.com/ca/en/kubernetes/deploying-an-application/',
  SG: 'https://docs.ovh.com/sg/en/kubernetes/deploying-an-application/',
  WE: 'https://docs.ovh.com/us/en/kubernetes/deploying-an-application/',
  IN: 'https://docs.ovh.com/asia/en/kubernetes/deploying-an-application/',
};

export const LOADBALANCER_KUBE: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/kubernetes/using-lb/',
  IE: 'https://docs.ovh.com/ie/en/kubernetes/using-lb/',
  DEFAULT: 'https://docs.ovh.com/gb/en/kubernetes/using-lb/',
  US:
    'https://support.us.ovhcloud.com/hc/en-us/articles/1500004806361-How-to-Use-the-OVHcloud-Managed-Kubernetes-Load-Balancer',
  ASIA: 'https://docs.ovh.com/asia/en/kubernetes/using-lb/',
  AU: 'https://docs.ovh.com/au/en/kubernetes/using-lb/',
  CA: 'https://docs.ovh.com/ca/en/kubernetes/using-lb/',
  SG: 'https://docs.ovh.com/sg/en/kubernetes/using-lb/',
  WE: 'https://docs.ovh.com/us/en/kubernetes/using-lb/',
  IN: 'https://docs.ovh.com/asia/en/kubernetes/using-lb/',
};

export const FAQ_MANAGED_PRIVATE_REGISTRY: GuideLinks = {
  FR: 'https://docs.ovh.com/fr/private-registry/managed-private-registry-faq/',
  GB:
    'https://docs.ovh.com/gb/en/private-registry/managed-private-registry-faq/',
  IE:
    'https://docs.ovh.com/ie/en/private-registry/managed-private-registry-faq/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/private-registry/managed-private-registry-faq/',
  ASIA:
    'https://docs.ovh.com/asia/en/private-registry/managed-private-registry-faq/',
  AU:
    'https://docs.ovh.com/au/en/private-registry/managed-private-registry-faq/',
  CA:
    'https://docs.ovh.com/ca/en/private-registry/managed-private-registry-faq/',
  SG:
    'https://docs.ovh.com/sg/en/private-registry/managed-private-registry-faq/',
  WE:
    'https://docs.ovh.com/us/en/private-registry/managed-private-registry-faq/',
  IN:
    'https://docs.ovh.com/asia/en/private-registry/managed-private-registry-faq/',
};

export const CREATE_A_MANAGED_PRIVATE_REGISTER: GuideLinks = {
  GB:
    'https://docs.ovh.com/gb/en/private-registry/creating-a-private-registry/',
  IE:
    'https://docs.ovh.com/ie/en/private-registry/creating-a-private-registry/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/private-registry/creating-a-private-registry/',
  ASIA:
    'https://docs.ovh.com/asia/en/private-registry/creating-a-private-registry/',
  AU:
    'https://docs.ovh.com/au/en/private-registry/creating-a-private-registry/',
  CA:
    'https://docs.ovh.com/ca/en/private-registry/creating-a-private-registry/',
  SG:
    'https://docs.ovh.com/sg/en/private-registry/creating-a-private-registry/',
  WE:
    'https://docs.ovh.com/us/en/private-registry/creating-a-private-registry/',
  IN:
    'https://docs.ovh.com/asia/en/private-registry/creating-a-private-registry/',
};

export const CREATE_AND_USE_A_PRIVATE_IMAGE: GuideLinks = {
  GB:
    'https://docs.ovh.com/gb/en/private-registry/creating-and-using-a-private-image/',
  IE:
    'https://docs.ovh.com/ie/en/private-registry/creating-and-using-a-private-image/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/private-registry/creating-and-using-a-private-image/',
  ASIA:
    'https://docs.ovh.com/asia/en/private-registry/creating-and-using-a-private-image/',
  AU:
    'https://docs.ovh.com/au/en/private-registry/creating-and-using-a-private-image/',
  CA:
    'https://docs.ovh.com/ca/en/private-registry/creating-and-using-a-private-image/',
  SG:
    'https://docs.ovh.com/sg/en/private-registry/creating-and-using-a-private-image/',
  WE:
    'https://docs.ovh.com/us/en/private-registry/creating-and-using-a-private-image/',
};

export const DIFFERENCES_BETWEEN_AI_NOTEBOOKS_AI_TRAINING_AI_APPS: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/ai-comparative-tables/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/ai-comparative-tables/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/ai-comparative-tables/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/ai-comparative-tables/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/ai-comparative-tables/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/ai-comparative-tables/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/ai-comparative-tables/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/ai-comparative-tables/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/ai-comparative-tables/',
};

export const AI_APPS_CAPABILITIES_AND_LIMITATIONS: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/apps/capabilities/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/apps/capabilities/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/apps/capabilities/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/apps/capabilities/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/apps/capabilities/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/apps/capabilities/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/apps/capabilities/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/apps/capabilities/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/apps/capabilities/',
};

export const ACCESSING_YOUR_AI_APPS_WITH_TOKENS: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/ai-apps-tokens/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/ai-apps-tokens/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/ai-apps-tokens/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/ai-apps-tokens/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/ai-apps-tokens/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/ai-apps-tokens/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/ai-apps-tokens/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/ai-apps-tokens/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/ai-apps-tokens/',
};

export const PRESENTATION_OF_DATA_PROCESSING: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/data-processing/overview/',
  IE: 'https://docs.ovh.com/ie/en/data-processing/overview/',
  DEFAULT: 'https://docs.ovh.com/gb/en/data-processing/overview/',
  ASIA: 'https://docs.ovh.com/asia/en/data-processing/overview/',
  AU: 'https://docs.ovh.com/au/en/data-processing/overview/',
  CA: 'https://docs.ovh.com/ca/en/data-processing/overview/',
  SG: 'https://docs.ovh.com/sg/en/data-processing/overview/',
  WE: 'https://docs.ovh.com/us/en/data-processing/overview/',
  IN: 'https://docs.ovh.com/asia/en/data-processing/overview/',
};

export const DATA_PROCESSING_CAPABILITIES_AND_LIMITATIONS: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/data-processing/capabilities/',
  IE: 'https://docs.ovh.com/ie/en/data-processing/capabilities/',
  DEFAULT: 'https://docs.ovh.com/gb/en/data-processing/capabilities/',
  ASIA: 'https://docs.ovh.com/asia/en/data-processing/capabilities/',
  AU: 'https://docs.ovh.com/au/en/data-processing/capabilities/',
  CA: 'https://docs.ovh.com/ca/en/data-processing/capabilities/',
  SG: 'https://docs.ovh.com/sg/en/data-processing/capabilities/',
  WE: 'https://docs.ovh.com/us/en/data-processing/capabilities/',
  IN: 'https://docs.ovh.com/asia/en/data-processing/capabilities/',
};

export const SUBMIT_A_JAVA_SCALA_JOB: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/data-processing/submit-javascala/',
  IE: 'https://docs.ovh.com/ie/en/data-processing/submit-javascala/',
  DEFAULT: 'https://docs.ovh.com/gb/en/data-processing/submit-javascala/',
  ASIA: 'https://docs.ovh.com/asia/en/data-processing/submit-javascala/',
  AU: 'https://docs.ovh.com/au/en/data-processing/submit-javascala/',
  CA: 'https://docs.ovh.com/ca/en/data-processing/submit-javascala/',
  SG: 'https://docs.ovh.com/sg/en/data-processing/submit-javascala/',
  WE: 'https://docs.ovh.com/us/en/data-processing/submit-javascala/',
  IN: 'https://docs.ovh.com/asia/en/data-processing/submit-javascala/',
};

export const AI_NOTEBOOKS_STARTUP: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/cli/getting-started-cli/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/cli/getting-started-cli/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/cli/getting-started-cli/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/cli/getting-started-cli/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/cli/getting-started-cli/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/cli/getting-started-cli/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/cli/getting-started-cli/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/cli/getting-started-cli/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/cli/getting-started-cli/',
};

export const AI_NOTEBOOKS_DEFINITION: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/definition/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/notebooks/definition/',
  DEFAULT: 'https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/definition/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/notebooks/definition/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/notebooks/definition/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/notebooks/definition/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/notebooks/definition/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/notebooks/definition/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/notebooks/definition/',
};

export const USING_DATA_FORM_OBJECT_STORAGE: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/manage-data-ui/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/notebooks/manage-data-ui/',
  DEFAULT:
    'https://docs.ovh.com/gb/en/publiccloud/ai/notebooks/manage-data-ui/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/notebooks/manage-data-ui/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/notebooks/manage-data-ui/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/notebooks/manage-data-ui/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/notebooks/manage-data-ui/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/notebooks/manage-data-ui/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/notebooks/manage-data-ui/',
};

export const AI_TRAINING_CAPABILITIES_AND_LIMITATIONS: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/training/capabilities/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/training/capabilities/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/capabilities/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/training/capabilities/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/training/capabilities/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/training/capabilities/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/training/capabilities/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/training/capabilities/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/training/capabilities/',
};

export const SUBMIT_A_JOB_VIA_THE_USER_INTERFACE: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/publiccloud/ai/training/submit-job/',
  IE: 'https://docs.ovh.com/ie/en/publiccloud/ai/training/submit-job/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/submit-job/',
  ASIA: 'https://docs.ovh.com/asia/en/publiccloud/ai/training/submit-job/',
  AU: 'https://docs.ovh.com/au/en/publiccloud/ai/training/submit-job/',
  CA: 'https://docs.ovh.com/ca/en/publiccloud/ai/training/submit-job/',
  SG: 'https://docs.ovh.com/sg/en/publiccloud/ai/training/submit-job/',
  WE: 'https://docs.ovh.com/us/en/publiccloud/ai/training/submit-job/',
  IN: 'https://docs.ovh.com/asia/en/publiccloud/ai/training/submit-job/',
};

export const MANAGING_A_CUSTOM_IMAGE: GuideLinks = {
  GB:
    'https://docs.ovh.com/gb/en/publiccloud/ai/training/build-use-custom-image/',
  IE:
    'https://docs.ovh.com/ie/en/publiccloud/ai/training/build-use-custom-image/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ai-training/build-use-custom-image/',
  ASIA:
    'https://docs.ovh.com/asia/en/publiccloud/ai/training/build-use-custom-image/',
  AU:
    'https://docs.ovh.com/au/en/publiccloud/ai/training/build-use-custom-image/',
  CA:
    'https://docs.ovh.com/ca/en/publiccloud/ai/training/build-use-custom-image/',
  SG:
    'https://docs.ovh.com/sg/en/publiccloud/ai/training/build-use-custom-image/',
  WE:
    'https://docs.ovh.com/us/en/publiccloud/ai/training/build-use-custom-image/',
  IN:
    'https://docs.ovh.com/asia/en/publiccloud/ai/training/build-use-custom-image/',
};

export const DEPLOYING_A_CUSTOM_MODEL: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/ml-serving/deploy-serialized-models/',
  IE: 'https://docs.ovh.com/ie/en/ml-serving/deploy-serialized-models/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ml-serving/deploy-serialized-models/',
  ASIA: 'https://docs.ovh.com/asia/en/ml-serving/deploy-serialized-models/',
  AU: 'https://docs.ovh.com/au/en/ml-serving/deploy-serialized-models/',
  CA: 'https://docs.ovh.com/ca/en/ml-serving/deploy-serialized-models/',
  SG: 'https://docs.ovh.com/sg/en/ml-serving/deploy-serialized-models/',
  WE: 'https://docs.ovh.com/us/en/ml-serving/deploy-serialized-models/',
  IN: 'https://docs.ovh.com/asia/en/ml-serving/deploy-serialized-models/',
};

export const MODELS_DEFINITION: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/ml-serving/models/',
  IE: 'https://docs.ovh.com/ie/en/ml-serving/models/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ml-serving/models/',
  ASIA: 'https://docs.ovh.com/asia/en/ml-serving/models/',
  AU: 'https://docs.ovh.com/au/en/ml-serving/models/',
  CA: 'https://docs.ovh.com/ca/en/ml-serving/models/',
  SG: 'https://docs.ovh.com/sg/en/ml-serving/models/',
  WE: 'https://docs.ovh.com/us/en/ml-serving/models/',
  IN: 'https://docs.ovh.com/asia/en/ml-serving/models/',
};

export const EXPORTING_A_TENSORFLOW_MODEL: GuideLinks = {
  GB: 'https://docs.ovh.com/gb/en/ml-serving/export-tensorflow-models/',
  IE: 'https://docs.ovh.com/ie/en/ml-serving/export-tensorflow-models/',
  DEFAULT: 'https://docs.ovh.com/gb/en/ml-serving/export-tensorflow-models/',
  ASIA: 'https://docs.ovh.com/asia/en/ml-serving/export-tensorflow-models/',
  AU: 'https://docs.ovh.com/au/en/ml-serving/export-tensorflow-models/',
  CA: 'https://docs.ovh.com/ca/en/ml-serving/export-tensorflow-models/',
  SG: 'https://docs.ovh.com/sg/en/ml-serving/export-tensorflow-models/',
  WE: 'https://docs.ovh.com/us/en/ml-serving/export-tensorflow-models/',
  IN: 'https://docs.ovh.com/asia/en/ml-serving/export-tensorflow-models/',
};

export const PREFIX_UNIVERSE_NAME = 'public-cloud';

export const DEFAULT_GUIDES = {
  public_cloud_guides: {
    url: PUBLIC_CLOUD_GUIDES,
    key: 'all_guides',
  },
  first_steps_with_instances: {
    url: FIRST_STEPS_WITH_INSTANCES,
    key: 'first_steps_with_instances',
  },
};

export const GUIDES_LIST: GuideList = {
  storage: {
    public_cloud_storage_guides: {
      url: PUBLIC_CLOUD_STORAGE_GUIDES,
      key: 'all_storage_guides',
    },
    first_steps_with_instances: {
      url: FIRST_STEPS_WITH_INSTANCES,
      key: 'first_steps_with_instances',
    },
    ip_fail_over: {
      url: IP_FAIL_OVER,
      key: 'ip_fail_over',
    },
    user_root_and_password: {
      url: USER_ROOT_AND_PASSWORD,
      key: 'user_root_and_password',
    },
    reverse_dns: {
      url: REVERSE_DNS,
      key: 'reverse_dns',
    },
  },
  objectStorage: {
    public_cloud_storage_guides: {
      url: PUBLIC_CLOUD_STORAGE_GUIDES,
      key: 'all_storage_guides',
    },
    public_cloud_guides: {
      url: PUBLIC_CLOUD_GUIDES,
      key: 'public_cloud_guides',
    },
  },
  instances: {
    ...DEFAULT_GUIDES,
    ip_fail_over: {
      url: IP_FAIL_OVER,
      key: 'ip_fail_over',
    },
    user_root_and_password: {
      url: USER_ROOT_AND_PASSWORD,
      key: 'user_root_and_password',
    },
    reverse_dns: {
      url: REVERSE_DNS,
      key: 'reverse_dns',
    },
  },
  databases: {
    ...DEFAULT_GUIDES,
    first_steps_with_databases: {
      url: FIRST_STEPS_WITH_DATABASES,
      key: 'first_steps_with_databases',
    },
    mongo_db_capabilities_and_limitations: {
      url: MONGO_DB_CAPABILITIES_AND_LIMITATIONS,
      key: 'mongo_db_capabilities_and_limitations',
    },
    mysql_capabilities_and_limitations: {
      url: MYSQL_CAPABILITIES_AND_LIMITATIONS,
      key: 'mysql_capabilities_and_limitations',
    },
  },
  kubernetes: {
    ...DEFAULT_GUIDES,
    create_a_cluster: {
      url: CREATE_A_CLUSTER,
      key: 'create_a_cluster',
    },
    deploy_an_application: {
      url: DEPLOY_AN_APPLICATION,
      key: 'deploy_an_application',
    },
    loadbalancer_kube: {
      url: LOADBALANCER_KUBE,
      key: 'loadbalancer_kube',
    },
  },
  private_registry: {
    ...DEFAULT_GUIDES,
    faq_managed_private_registry: {
      url: FAQ_MANAGED_PRIVATE_REGISTRY,
      key: 'faq_managed_private_registry',
    },
    create_a_managed_private_register: {
      url: CREATE_A_MANAGED_PRIVATE_REGISTER,
      key: 'create_a_managed_private_register',
    },
    create_and_use_a_private_image: {
      url: CREATE_AND_USE_A_PRIVATE_IMAGE,
      key: 'create_and_use_a_private_image',
    },
  },
  ai_machine_learning: {
    ...DEFAULT_GUIDES,
    differences_between_ai_notebooks_ai_training_ai_apps: {
      url: DIFFERENCES_BETWEEN_AI_NOTEBOOKS_AI_TRAINING_AI_APPS,
      key: 'differences_between_ai_notebooks_ai_training_ai_apps',
    },
    ai_apps_capabilities_and_limitations: {
      url: AI_APPS_CAPABILITIES_AND_LIMITATIONS,
      key: 'ai_apps_capabilities_and_limitations',
    },
    accessing_your_ai_apps_with_tokens: {
      url: ACCESSING_YOUR_AI_APPS_WITH_TOKENS,
      key: 'accessing_your_ai_apps_with_tokens',
    },
  },
  data_processing: {
    ...DEFAULT_GUIDES,
    presentation_of_data_processing: {
      url: PRESENTATION_OF_DATA_PROCESSING,
      key: 'presentation_of_data_processing',
    },
    data_processing_capabilities_and_limitations: {
      url: DATA_PROCESSING_CAPABILITIES_AND_LIMITATIONS,
      key: 'data_processing_capabilities_and_limitations',
    },
    submit_a_java_scala_job: {
      url: SUBMIT_A_JAVA_SCALA_JOB,
      key: 'submit_a_java_scala_job',
    },
  },
  ai_notenooks: {
    ...DEFAULT_GUIDES,
    ai_notebooks_startup: {
      url: AI_NOTEBOOKS_STARTUP,
      key: 'ai_notebooks_startup',
    },
    ai_notebooks_definition: {
      url: AI_NOTEBOOKS_DEFINITION,
      key: 'ai_notebooks_definition',
    },
    using_data_form_object_storage: {
      url: USING_DATA_FORM_OBJECT_STORAGE,
      key: 'using_data_form_object_storage',
    },
  },
  ai_training: {
    ...DEFAULT_GUIDES,
    ai_training_capabilities_and_limitations: {
      url: AI_TRAINING_CAPABILITIES_AND_LIMITATIONS,
      key: 'ai_training_capabilities_and_limitations',
    },
    submit_a_job_via_the_user_interface: {
      url: SUBMIT_A_JOB_VIA_THE_USER_INTERFACE,
      key: 'submit_a_job_via_the_user_interface',
    },
    managing_a_custom_image: {
      url: MANAGING_A_CUSTOM_IMAGE,
      key: 'managing_a_custom_image',
    },
  },
  ml_serving: {
    ...DEFAULT_GUIDES,
    deploying_a_custom_model: {
      url: DEPLOYING_A_CUSTOM_MODEL,
      key: 'deploying_a_custom_model',
    },
    models_definition: {
      url: MODELS_DEFINITION,
      key: 'models_definition',
    },
    exporting_a_tensorflow_model: {
      url: EXPORTING_A_TENSORFLOW_MODEL,
      key: 'exporting_a_tensorflow_model',
    },
  },
  private_network: {
    ...DEFAULT_GUIDES,
  },
};

export default {
  GUIDES_LIST,
};

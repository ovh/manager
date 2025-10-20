import { CountryCode } from '@ovh-ux/manager-config';

type GuideLinks = { [key in CountryCode]: string };

export const SUPPORT_URL: Record<string, string> = {
  EU: 'https://help.ovhcloud.com',
  US: 'https://support.us.ovhcloud.com',
};

export const LANDING_URL: Record<string, string> = {
  EU: 'https://www.ovhcloud.com',
  US: 'https://us.ovhcloud.com',
};

export const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  discover: {
    DE:
      '/csm/de-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045728',
    ES:
      '/csm/es-es-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045741',
    IE:
      '/csm/en-ie-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0032943',
    IT:
      '/csm/it-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045743',
    PL:
      '/csm/pl-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045745',
    PT:
      '/csm/pt-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045833',
    FR:
      '/csm/fr-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045740',
    GB:
      '/csm/en-gb-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045834',
    CA:
      '/csm/en-ca-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045744',
    QC:
      '/csm/fr-ca-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045738',
    WE:
      '/csm/en-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045739',
    WS:
      '/csm/es-vmware-control-panel-guided-tour?id=kb_article_view&sysparm_article=KB0045742',
    US:
      '/hc/en-us/articles/18004084382355-Introduction-to-the-Hosted-Private-Cloud-Control-Panel',
  },
  vsphere_access: {
    DE:
      '/csm/de-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0033694',
    ES:
      '/csm/es-es-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046439',
    IE:
      '/csm/en-ie-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046429',
    IT:
      '/csm/it-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046449',
    PL:
      '/csm/pl-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046441',
    PT:
      '/csm/pt-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046446',
    FR:
      '/csm/fr-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046435',
    GB:
      '/csm/en-gb-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046440',
    CA:
      '/csm/en-ca-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046438',
    QC:
      '/csm/fr-ca-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046447',
    WE:
      '/csm/en-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046431',
    WS:
      '/csm/es-vmware-login-vsphere-interface?id=kb_article_view&sysparm_article=KB0046445',
    US:
      '/hc/en-us/articles/360015989419-How-to-Log-Into-the-vSphere-Web-Client',
  },
  veeam_backup: {
    DE:
      '/csm/de-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064987',
    ES:
      '/csm/es-es-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065001',
    IE:
      '/csm/en-ie-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046154',
    IT:
      '/csm/it-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065003',
    PL:
      '/csm/pl-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064998',
    PT:
      '/csm/pt-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0065002',
    FR:
      '/csm/fr-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046156',
    GB:
      '/csm/en-gb-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046150',
    CA:
      '/csm/en-ca-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046148',
    QC:
      '/csm/fr-ca-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046159',
    WE:
      '/csm/en-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0046155',
    WS:
      '/csm/es-vmware-veeam-backup-as-a-service?id=kb_article_view&sysparm_article=KB0064999',
    US:
      '/hc/en-us/articles/360013652139-How-to-Enable-and-Use-Managed-Veeam-Backup',
  },
  logs_data_platform: {
    DE: '/de/identity-security-operations/logs-data-platform',
    ES: '/es-es/identity-security-operations/logs-data-platform',
    FR: '/fr/identity-security-operations/logs-data-platform',
    IE: '/en-ie/identity-security-operations/logs-data-platform',
    NL: '/nl/identity-security-operations/logs-data-platform',
    PL: '/pl/identity-security-operations/logs-data-platform',
    PT: '/pt/identity-security-operations/logs-data-platform',
    GB: '/en-gb/identity-security-operations/logs-data-platform',
    CA: '/en-ca/identity-security-operations/logs-data-platform',
    QC: '/fr-ca/identity-security-operations/logs-data-platform',
    WS: '/es/identity-security-operations/logs-data-platform',
    MA: '/fr-ma/identity-security-operations/logs-data-platform',
    SN: '/fr-sn/identity-security-operations/logs-data-platform',
    TN: '/fr-tn/identity-security-operations/logs-data-platform',
    AU: '/en-au/identity-security-operations/logs-data-platform',
    SG: '/en-sg/identity-security-operations/logs-data-platform',
    ASIA: '/asia/identity-security-operations/logs-data-platform',
    IN: '/en-in/identity-security-operations/logs-data-platform',
    WE: '/en/identity-security-operations/logs-data-platform/',
    US: '/identity-security-operations/logs-data-platform/',
  },
};

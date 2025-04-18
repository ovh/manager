import { CountryCode } from '@ovh-ux/manager-config';

type GuideLinks = { [key in CountryCode]: string };

export const SUPPORT_URL: Record<string, string> = {
  EU: 'https://help.ovhcloud.com',
  US: 'https://support.us.ovhcloud.com',
};

export const GUIDE_LIST: {
  [guideName: string]: Partial<GuideLinks>;
} = {
  quickStart: {
    ASIA:
      '/csm/asia-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062569',
    AU:
      '/csm/en-au-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062570',
    CA:
      '/csm/en-ca-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062567',
    DE:
      '/csm/de-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062578',
    ES:
      '/csm/es-es-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062574',
    FR:
      '/csm/fr-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062580',
    GB:
      '/csm/en-gb-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062581',
    IE:
      '/csm/en-ie-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062572',
    IT:
      '/csm/it-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062582',
    PL:
      '/csm/pl-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062584',
    PT:
      '/csm/pt-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062583',
    QC:
      '/csm/fr-ca-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062579',
    SG:
      '/csm/en-sg-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062608',
    US:
      '/hc/en-us/articles/28330641929491-VMware-Cloud-Director-How-to-Use-the-VCD-User-Interface',
    WE:
      '/csm/en-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062573',
    WS:
      '/csm/es-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062575',
  },
  usage: {
    ASIA:
      '/csm/asia-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063129',
    AU:
      '/csm/en-au-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063130',
    CA:
      '/csm/en-ca-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063126',
    DE:
      '/csm/de-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063127',
    ES:
      '/csm/es-es-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063123',
    FR:
      '/csm/fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    GB:
      '/csm/en-gb-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063128',
    IE:
      '/csm/en-ie-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063133',
    IT:
      '/csm/it-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063135',
    PL:
      '/csm/pl-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063136',
    PT:
      '/csm/pt-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063131',
    QC:
      '/csm/fr-ca-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063122',
    SG:
      '/csm/en-sg-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063134',
    US:
      '/hc/en-us/articles/33255029079059-VMware-Cloud-Director-Backup-with-Veeam-Data-Platform',
    WE:
      '/csm/en-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063125',
    WS:
      '/csm/es-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063132',
  },
  faq: {
    ASIA:
      '/csm/asia-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062558',
    AU:
      '/csm/en-au-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062599',
    CA:
      '/csm/en-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062603',
    DE: '/csm/de-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062552',
    ES:
      '/csm/es-es-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062605',
    FR: '/csm/fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    GB:
      '/csm/en-gb-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062557',
    IE:
      '/csm/en-ie-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062555',
    IT: '/csm/it-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062556',
    PL: '/csm/pl-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062561',
    PT: '/csm/pt-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062562',
    QC:
      '/csm/fr-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062601',
    SG:
      '/csm/en-sg-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062554',
    US: '/hc/en-us/articles/28329887272467-VMware-Cloud-Director-FAQ',
    WE: '/csm/en-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062598',
    WS: '/csm/es-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062553',
  },
};

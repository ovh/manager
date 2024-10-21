import React from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://help.ovhcloud.com/csm/';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DEFAULT:
      'en-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063125',
    FR: 'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    IE: 'en-ie-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063133',
    DE: 'de-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063127',
    ES: 'es-es-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063123',
    IT: 'it-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063135',
    PL: 'pl-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063136',
    PT: 'pt-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063131',
    NL: 'en-gb-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063128',
    GB: 'en-gb-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063128',
    CA: 'en-ca-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063126',
    QC: 'fr-ca-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063122',
    TN: 'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    SN: 'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    MA: 'fr-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063124',
    AU: 'en-au-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063130',
    IN: 'asia-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063129',
    SG: 'en-sg-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063134',
    ASIA: 'asia-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063129',
    WE: 'en-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063125',
    WS: 'es-vmware-vcd-backup?id=kb_article_view&sysparm_article=KB0063132',
  },
  guideLink2: {
    DEFAULT:
      'en-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062573',
    FR:
      'fr-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062580',
    DE:
      'de-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062578',
    ES:
      'es-es-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062574',
    IE:
      'en-ie-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062572',
    IT:
      'it-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062582',
    PL:
      'pl-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062584',
    PT:
      'pt-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062583',
    GB:
      'en-gb-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062581',
    NL:
      'en-gb-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062581',
    CA:
      'en-ca-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062567',
    QC:
      'fr-ca-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062579',
    WS:
      'es-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062575',
    MA:
      'fr-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062580',
    SN:
      'fr-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062580',
    TN:
      'fr-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062580',
    AU:
      'en-au-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062570',
    IN:
      'asia-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062569',
    SG:
      'en-sg-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062608',
    ASIA:
      'asia-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062569',
    WE:
      'en-vmware-vcd-getting-started-dashboard-overview?id=kb_article_view&sysparm_article=KB0062573',
  },
  guideLink3: {
    DEFAULT: 'en-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062598',
    FR: 'fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    DE: 'de-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062552',
    ES: 'de-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062552',
    IE: 'en-ie-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062555',
    IT: 'it-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062556',
    PL: 'pl-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062561',
    PT: 'pt-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062562',
    GB: 'en-gb-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062557',
    NL: 'en-gb-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062557',
    CA: 'en-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062603',
    QC: 'fr-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062601',
    WS: 'es-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062553',
    MA: 'fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    SN: 'fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    TN: 'fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    AU: 'en-au-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062599',
    IN: 'asia-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062558',
    SG: 'en-sg-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062554',
    ASIA: 'asia-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062558',
    WE: 'en-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062598',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    list[key[0]] = docUrl + GUIDE_LIST[key[0]][subsidiary || 'DEFAULT'];
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

export function useGuideUtils() {
  const { environment } = React.useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();
  const [guideList, setGuideList] = React.useState<GuideLinkProps>({});

  React.useEffect(() => {
    setGuideList(
      getGuideListLink({ subsidiary: ovhSubsidiary as CountryCode }),
    );
  }, [ovhSubsidiary]);

  return guideList;
}

export default useGuideUtils;

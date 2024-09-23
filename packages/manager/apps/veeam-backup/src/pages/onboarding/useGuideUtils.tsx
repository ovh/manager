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
      'world-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad&spa=1',
    FR:
      'fr-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad&spa=1',
    DE:
      'de-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    ES:
      'es-es-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    IE:
      'en-ie-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    IT:
      'it-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    PL:
      'pl-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    PT:
      'pt-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    GB:
      'en-gb-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    CA:
      'en-ca-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    QC:
      'fr-ca-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    WS:
      'es-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    MA:
      'fr-ma-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    SN:
      'fr-sn-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    TN:
      'fr-tn-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    AU:
      'en-au-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    IN:
      'en-in-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    SG:
      'en-sg-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    ASIA:
      'asia-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    WE:
      'world-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
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

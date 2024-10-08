import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type GuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DE: 'https://www.ovhcloud.com/de/lp/vmware-vcd-evolution/',
    ES: 'https://www.ovhcloud.com/es/lp/vmware-vcd-evolution/',
    IE: 'https://www.ovhcloud.com/en-ie/lp/vmware-vcd-evolution/',
    IT: 'https://www.ovhcloud.com/it/lp/vmware-vcd-evolution/',
    PL: 'https://www.ovhcloud.com/pl/lp/vmware-vcd-evolution/',
    PT: 'https://www.ovhcloud.com/pt/lp/vmware-vcd-evolution/',
    FR: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    MA: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    SN: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    TN: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    NL: 'https://www.ovhcloud.com/nl/lp/vmware-vcd-evolution/',
    GB: 'https://www.ovhcloud.com/en-gb/lp/vmware-vcd-evolution/',
    CA: 'https://www.ovhcloud.com/en-ca/lp/vmware-vcd-evolution/',
    QC: 'https://www.ovhcloud.com/fr/lp/vmware-vcd-evolution/',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/28330641929491-VMware-Cloud-Director-How-to-Use-the-vCD-User-Interface',
  },
  guideLink2: {
    DE:
      'https://help.ovhcloud.com/csm/de-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    ES:
      'https://help.ovhcloud.com/csm/es-es-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    IT:
      'https://help.ovhcloud.com/csm/it-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    PL:
      'https://help.ovhcloud.com/csm/pl-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    PT:
      'https://help.ovhcloud.com/csm/pt-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    FR:
      'https://help.ovhcloud.com/csm/fr-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad&spa=1',
    MA:
      'https://help.ovhcloud.com/csm/fr-ma-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    SN:
      'https://help.ovhcloud.com/csm/fr-sn-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    TN:
      'https://help.ovhcloud.com/csm/fr-tn-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-documentation-hosted-private-cloud-hosted-private-cloud-powered-by-vmware-vcd?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953&kb_category=a249c12ef5adca941e11c2f7954b95ad',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/28330367397139-VMware-Cloud-Director-The-Fundamentals-of-VCD',
  },
  guideLink3: {
    DE:
      'https://help.ovhcloud.com/csm/de-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062552',
    ES:
      '/https://help.ovhcloud.com/csm/es-es-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062605',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062555',
    IT:
      'https://help.ovhcloud.com/csm/it-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062556',
    PL:
      'https://help.ovhcloud.com/csm/pl-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062561',
    PT:
      'https://help.ovhcloud.com/csm/pt-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062562',
    FR:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    MA:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    SN:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    TN:
      'https://help.ovhcloud.com/csm/fr-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062602',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062557',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062603',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-vmware-vcd-faq?id=kb_article_view&sysparm_article=KB0062601',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/28329887272467-VMware-Cloud-Director-FAQ',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach((key) => {
    list[key[0]] =
      GUIDE_LIST[key[0]][subsidiary as CountryCode] ??
      GUIDE_LIST[key[0]][CountryCode.GB];
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils() {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState({});

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({ subsidiary: ovhSubsidiary });
      setList(guideList);
    };
    getSubSidiary();
  }, []);
  return list as GuideLinkProps;
}

export default useGuideUtils;

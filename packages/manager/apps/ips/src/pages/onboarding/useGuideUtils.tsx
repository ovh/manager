import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type GuideLinks = { [key in CountryCode | 'DEFAULT']: string };

const URL_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DE:
      'https://help.ovhcloud.com/csm/de-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0030741',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-bare-metal-cloud?id=kb_browse_cat&kb_id=203c4f65551974502d4c6e78b7421996',
    ES:
      'https://help.ovhcloud.com/csm/es-es-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043712',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043725',
    IT:
      'https://help.ovhcloud.com/csm/it-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043728',
    PL:
      'https://help.ovhcloud.com/csm/pl-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043718',
    PT:
      'https://help.ovhcloud.com/csm/pt-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043732',
    FR:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043717',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043705',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043704',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043716',
    US: 'https://us.ovhcloud.com/support',
    IN:
      'https://help.ovhcloud.com/csm/asia-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043713',
    SN:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043717',
    MA:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043717',
    TN:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043717',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043710',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043713',
    AU:
      'https://help.ovhcloud.com/csm/en-au-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043714',
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-ip-fo-move?id=kb_article_view&sysparm_article=KB0043725',
  },
  guideLink2: {
    DE:
      'https://help.ovhcloud.com/csm/de-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043334',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-bare-metal-cloud?id=kb_browse_cat&kb_id=203c4f65551974502d4c6e78b7421996',
    ES:
      'https://help.ovhcloud.com/csm/es-es-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043345',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043339',
    IT:
      'https://help.ovhcloud.com/csm/it-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043343',
    PL:
      'https://help.ovhcloud.com/csm/pl-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043346',
    PT:
      'https://help.ovhcloud.com/csm/pt-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043349',
    FR:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043347',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043337',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043335',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043698',
    US: 'https://us.ovhcloud.com/support',
    IN:
      'https://help.ovhcloud.com/csm/asia-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043336',
    SN:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043347',
    MA:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043347',
    TN:
      'https://help.ovhcloud.com/csm/fr-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043347',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043338',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043336',
    AU:
      'https://help.ovhcloud.com/csm/en-au-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0030348',
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-ie-dedicated-servers-ip-block-vrack?id=kb_article_view&sysparm_article=KB0043339',
  },
  guideLink3: {
    DE:
      'https://help.ovhcloud.com/csm/de-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0032478',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    ES:
      'https://help.ovhcloud.com/csm/es-es-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045310',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045314',
    IT:
      'https://help.ovhcloud.com/csm/it-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045315',
    PL:
      'https://help.ovhcloud.com/csm/pl-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045319',
    PT:
      'https://help.ovhcloud.com/csm/pt-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045317',
    FR:
      'https://help.ovhcloud.com/csm/fr-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045308',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045303',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045301',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045313',
    US: 'https://us.ovhcloud.com/support',
    IN:
      'https://help.ovhcloud.com/csm/en-in-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    SN:
      'https://help.ovhcloud.com/csm/fr-sn-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    MA:
      'https://help.ovhcloud.com/csm/fr-sn-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    TN:
      'https://help.ovhcloud.com/csm/fr-sn-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    AU:
      'https://help.ovhcloud.com/csm/en-au-documentation-hosted-private-cloud?id=kb_browse_cat&kb_id=62e4cfed55d574502d4c6e78b7421953',
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-ie-vmware-add-ip-block?id=kb_article_view&sysparm_article=KB0045314',
  },
  presentationLink: {
    DE: 'https://www.ovhcloud.com/de/network/additional-ip/',
    NL: 'https://www.ovhcloud.com/nl/network/additional-ip/',
    ES: 'https://www.ovhcloud.com/es-es/network/additional-ip/',
    IE: 'https://www.ovhcloud.com/en-ie/network/additional-ip/',
    IT: 'https://www.ovhcloud.com/it/network/additional-ip/',
    PL: 'https://www.ovhcloud.com/pl/network/additional-ip/',
    PT: 'https://www.ovhcloud.com/pt/network/additional-ip/',
    FR: 'https://www.ovhcloud.com/fr/network/additional-ip/',
    GB: 'https://www.ovhcloud.com/en-gb/network/additional-ip/',
    CA: 'https://www.ovhcloud.com/en-ca/network/additional-ip/',
    QC: 'https://www.ovhcloud.com/fr-ca/network/additional-ip/',
    US: 'https://us.ovhcloud.com/network/additional-ip/',
    IN: 'https://www.ovhcloud.com/en-in/network/additional-ip/',
    SN: 'https://www.ovhcloud.com/fr-sn/network/additional-ip/',
    MA: 'https://www.ovhcloud.com/fr-ma/network/additional-ip/',
    TN: 'https://www.ovhcloud.com/fr-tn/network/additional-ip/',
    SG: 'https://www.ovhcloud.com/en-sg/network/additional-ip/',
    ASIA: 'https://www.ovhcloud.com/asia/network/additional-ip/',
    AU: 'https://www.ovhcloud.com/en-au/network/additional-ip/',
    DEFAULT: 'https://www.ovhcloud.com/en-ie/network/additional-ip/',
  },
  documentationLink: {
    DE:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=de',
    NL:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=nl',
    ES:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=es',
    IE:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    IT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=it',
    PL:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=pl',
    PT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=pt',
    FR:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    GB:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    CA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    QC:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    US:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    IN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    SN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    MA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    TN:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=fr',
    SG:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    ASIA:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    AU:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
    DEFAULT:
      'https://help.ovhcloud.com/csm?id=kb_search&query=additional%20IP&language=en',
  },
  byoipLink: {
    DE: 'https://www.ovhcloud.com/de/network/byoip/',
    NL: 'https://www.ovhcloud.com/nl/network/byoip/',
    ES: 'https://www.ovhcloud.com/es-es/network/byoip/',
    IE: 'https://www.ovhcloud.com/en-ie/network/byoip/',
    IT: 'https://www.ovhcloud.com/it/network/byoip/',
    PL: 'https://www.ovhcloud.com/pl/network/byoip/',
    PT: 'https://www.ovhcloud.com/pt/network/byoip/',
    FR: 'https://www.ovhcloud.com/fr/network/byoip/',
    GB: 'https://www.ovhcloud.com/en-gb/network/byoip/',
    CA: 'https://www.ovhcloud.com/en-ca/network/byoip/',
    QC: 'https://www.ovhcloud.com/fr-ca/network/byoip/',
    IN: 'https://www.ovhcloud.com/en-in/network/byoip/',
    SN: 'https://www.ovhcloud.com/fr-sn/network/byoip/',
    MA: 'https://www.ovhcloud.com/fr-ma/network/byoip/',
    TN: 'https://www.ovhcloud.com/fr-tn/network/byoip/',
    SG: 'https://www.ovhcloud.com/en-sg/network/byoip/',
    ASIA: 'https://www.ovhcloud.com/asia/network/byoip/',
    AU: 'https://www.ovhcloud.com/en-au/network/byoip/',
    US: 'https://us.ovhcloud.com/network/byoip/',
    DEFAULT: 'https://www.ovhcloud.com/en-gb/network/byoip/',
  },
  /*
  addNewGuideLink : {
    DEFAULT: '/guide-link-3-path',
    DE: '/guide-link-3-path',
    ES: '/guide-link-3-path',
    ...
  }
  */
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  const keys = Object.entries(URL_LIST);
  keys.forEach((key) => {
    list[key[0]] =
      URL_LIST[key[0]][subsidiary as CountryCode] || URL_LIST[key[0]].DEFAULT;
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

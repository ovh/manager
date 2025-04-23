import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const docUrl = 'https://help.ovhcloud.com/csm';

type GuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink1: {
    DE: '/update-path',
    ES: '/update-path',
    IE: '/en/update-path',
    IT: '/update-path',
    PL: '/update-path',
    PT: '/update-path',
    FR: '/update-path',
    GB: '/update-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  guideLink2: {
    DE: '/guide-link-2-path',
    ES: '/guide-link-2-path',
    IE: '/en/guide-link-2-path',
    IT: '/guide-link-2-path',
    PL: '/guide-link-2-path',
    PT: '/guide-link-2-path',
    FR: '/guide-link-2-path',
    GB: '/guide-link-2-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  guideLink3: {
    DE: '/guide-link-3-path',
    ES: '/guide-link-3-path',
    IE: '/en/guide-link-3-path',
    IT: '/guide-link-3-path',
    PL: '/guide-link-3-path',
    PT: '/guide-link-3-path',
    FR: '/guide-link-3-path',
    GB: '/guide-link-3-path',
    CA: '/update-path',
    QC: '/update-path',
    WE: '/update-path',
    WS: '/update-path',
    US: '/update-path',
  },
  pre_installation_sap: {
    FR:
      '/fr-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059496',
    QC:
      '/fr-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059496',
    MA:
      '/fr-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059496',
    SN:
      '/fr-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059496',
    TN:
      '/fr-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059496',
    GB:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    CA:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    IE:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    SG:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    IN:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    AU:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    ASIA:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    ES:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    WE:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    WS:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    DE:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    IT:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
    NL:
      '/en-gb-sap-hana-template-deployment?id=kb_article_view&sysparm_article=KB0059493',
  },
  infrastructure_as_code: {
    FR: '/fr-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059539',
    QC: '/fr-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059539',
    MA: '/fr-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059539',
    SN: '/fr-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059539',
    TN: '/fr-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059539',
    GB:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    CA:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    IE:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    SG:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    IN:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    AU:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    ASIA:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    ES:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    WE:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    WS:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    DE:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    IT:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
    NL:
      '/en-gb-terraform-sap-system?id=kb_article_view&sysparm_article=KB0059544',
  },
  backup_sap_hana: {
    FR:
      '/fr-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059480',
    QC:
      '/fr-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059480',
    MA:
      '/fr-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059480',
    SN:
      '/fr-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059480',
    TN:
      '/fr-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059480',
    GB:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    CA:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    IE:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    SG:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    IN:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    AU:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    ASIA:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    ES:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    WE:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    WS:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    DE:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    IT:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
    NL:
      '/en-gb-sap-hana-install-ovhcloud-backint-agent?id=kb_article_view&sysparm_article=KB0059474',
  },
  pre_installation_wizzard: {
    FR:
      '/fr-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067018',
    QC:
      '/fr-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067018',
    MA:
      '/fr-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067018',
    SN:
      '/fr-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067018',
    TN:
      '/fr-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067018',
    GB:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    CA:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    IE:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    SG:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    IN:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    AU:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    ASIA:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    ES:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    WE:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    WS:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    DE:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    IT:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
    NL:
      '/en-sap-installation-wizard?id=kb_article_view&sysparm_article=KB0067015',
  },
  logs_analysis_and_extract: {
    FR:
      '/fr-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062799',
    QC:
      '/fr-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062799',
    MA:
      '/fr-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062799',
    SN:
      '/fr-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062799',
    TN:
      '/fr-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062799',
    GB:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    CA:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    IE:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    SG:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    IN:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    AU:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    ASIA:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    ES:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    WE:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    WS:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    DE:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    IT:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
    NL:
      '/en-gb-sap-ldp-logs-solution-setup?id=kb_article_view&sysparm_article=KB0062792',
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
    list[key[0]] = docUrl + GUIDE_LIST[key[0]][subsidiary as CountryCode];
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

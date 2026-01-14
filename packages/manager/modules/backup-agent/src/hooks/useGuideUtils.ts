import { useContext, useEffect, useState } from 'react';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

const GUIDE_LIST = Object.freeze({
  main: {
    ASIA: 'TODO',
    DE: 'TODO',
    ES: 'TODO',
    WS: 'TODO',
    IE: 'TODO',
    IT: 'TODO',
    PL: 'TODO',
    PT: 'TODO',
    FR: 'https://help.ovhcloud.com/csm/fr-documentation-storage-backup-and-disaster-recovery-solution-backup-agent?id=kb_browse_cat&kb_id=38e74da5a884a950f07829d7d5c75217&kb_category=906c9b0ea89aba184a4e966cdc09e09e&spa=1',
    GB: 'TODO',
    CA: 'TODO',
    QC: 'TODO',
    US: 'TODO',
    AU: 'TODO',
    SG: 'TODO',
    MA: 'TODO',
    SN: 'TODO',
    TN: 'TODO',
    NL: 'TODO',
    IN: 'TODO',
    WE: 'TODO',
  },
  cost: {
    DE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    ES: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    WS: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    IE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    IT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    PL: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    PT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    FR: 'https://help.ovhcloud.com/csm/fr-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074345',
    GB: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    CA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    QC: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    WE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    US: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    MA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    SN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
    TN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-billing?id=kb_article_view&sysparm_article=KB0074344',
  },
  tutorial: {
    FR: 'https://help.ovhcloud.com/csm/fr-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074361',
    US: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    DE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    ES: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    GB: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    IE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    IT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    MA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    NL: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    PL: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    PT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    SN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    TN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    CA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    QC: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    ASIA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    AU: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    SG: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    WS: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
    WE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-first-configuration?id=kb_article_view&sysparm_article=KB0074353',
  },
  faq: {
    FR: 'https://help.ovhcloud.com/csm/fr-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074396',
    GB: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    US: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    DE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    ES: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    IE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    IT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    MA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    NL: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    PL: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    PT: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    SN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    TN: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    CA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    QC: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    ASIA: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    AU: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    SG: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    WS: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
    WE: 'https://help.ovhcloud.com/csm/en-gb-backup-agent-troubleshooting?id=kb_article_view&sysparm_article=KB0074384',
  },
});

type TGetGuideLinkProps = {
  name?: string;
  subsidiary: CountryCode | string;
};

interface IGuideLinkProps {
  [guideName: string]: string;
}

const DEFAULT_SUB_PAGE = 'GB';

function getGuideListLink({ subsidiary }: TGetGuideLinkProps) {
  const list: IGuideLinkProps = {};
  const keys = Object.entries(GUIDE_LIST);
  keys.forEach(([key, value]) => {
    list[key] = value[subsidiary as keyof typeof value] ?? value[DEFAULT_SUB_PAGE];
  });
  return list;
}

export const useGuideUtils = () => {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState({});

  useEffect(() => {
    const getSubsidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({ subsidiary: ovhSubsidiary });
      setList(guideList);
    };
    void getSubsidiary();
  }, []);
  return list as IGuideLinkProps;
};

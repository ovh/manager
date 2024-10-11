import { useContext, useEffect, useState } from 'react';
import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type TGuideLinks = { [key in CountryCode]: string };

const GUIDE_LIST: { [guideName: string]: Partial<TGuideLinks> } = {
  main: {
    ASIA: 'https://www.ovhcloud.com/asia/storage-solutions/hycu/',
    DE: 'https://www.ovhcloud.com/de/storage-solutions/hycu/',
    ES: 'https://www.ovhcloud.com/es-es/storage-solutions/hycu/',
    WS: 'https://www.ovhcloud.com/es/storage-solutions/hycu/',
    IE: 'https://www.ovhcloud.com/en-ie/storage-solutions/hycu/',
    IT: 'https://www.ovhcloud.com/it/storage-solutions/hycu/',
    PL: 'https://www.ovhcloud.com/pl/storage-solutions/hycu/',
    PT: 'https://www.ovhcloud.com/pt/storage-solutions/hycu/',
    FR: 'https://www.ovhcloud.com/fr/storage-solutions/hycu/',
    GB: 'https://www.ovhcloud.com/en-gb/storage-solutions/hycu/',
    CA: 'https://www.ovhcloud.com/en-ca/storage-solutions/hycu/',
    QC: 'https://www.ovhcloud.com/fr-ca/storage-solutions/hycu/',
    US: 'https://www.ovhcloud.com/en/storage-solutions/hycu/',
    AU: 'https://www.ovhcloud.com/en-au/storage-solutions/hycu/',
    SG: 'https://www.ovhcloud.com/en-sg/storage-solutions/hycu/',
    MA: 'https://www.ovhcloud.com/fr-ma/storage-solutions/hycu/',
    SN: 'https://www.ovhcloud.com/fr-sn/storage-solutions/hycu/',
    TN: 'https://www.ovhcloud.com/fr-tn/storage-solutions/hycu/',
    NL: 'https://www.ovhcloud.com/nl/storage-solutions/hycu/',
    IN: 'https://www.ovhcloud.com/en-in/storage-solutions/hycu/',
  },
  guideLink1: {
    DE:
      'https://help.ovhcloud.com/csm/de-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045099',
    ES:
      'https://help.ovhcloud.com/csm/es-es-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045102',
    WS:
      'https://help.ovhcloud.com/csm/es-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045108',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045115',
    IT:
      'https://help.ovhcloud.com/csm/it-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045120',
    PL:
      'https://help.ovhcloud.com/csm/pl-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045111',
    PT:
      'https://help.ovhcloud.com/csm/pt-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045112',
    FR:
      'https://help.ovhcloud.com/csm/fr-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045116',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045103',
    CA:
      'https://help.ovhcloud.com/csm/en-gb-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045103',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045109',
    WE:
      'https://help.ovhcloud.com/csm/pl-nutanix-hycu-backup?id=kb_article_view&sysparm_article=KB0045111',
    US:
      'https://support.us.ovhcloud.com/hc/en-us/articles/18912619822099-How-to-Configure-HYCU-Backup-on-Nutanix',
  },
  guideLink2: {
    FR: 'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/',
    GB: 'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/',
    US: 'https://us.ovhcloud.com/hosted-private-cloud/nutanix/',
  },
  guideLink3: {
    FR:
      'https://www.ovhcloud.com/fr/hosted-private-cloud/nutanix/uc-disaster-recovery-plan/',
    GB:
      'https://www.ovhcloud.com/en/hosted-private-cloud/nutanix/uc-disaster-recovery-plan/',
    US:
      'https://us.ovhcloud.com/hosted-private-cloud/nutanix/uc-disaster-recovery-plan/',
  },
};

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
  keys.forEach((key) => {
    list[key[0]] =
      GUIDE_LIST[key[0]][subsidiary as CountryCode] ??
      GUIDE_LIST[key[0]][DEFAULT_SUB_PAGE];
  });
  return list;
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
  return list as IGuideLinkProps;
}

export default useGuideUtils;

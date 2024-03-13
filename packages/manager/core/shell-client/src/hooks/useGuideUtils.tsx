import { useState, useEffect, useContext } from 'react';
import { Region, CountryCode } from '@ovh-ux/manager-config';
import ShellContext from '../ShellContext';

const docUrl = 'https://docs.ovh.com/';

type GuideLinks = { [key in CountryCode]: string };
type BaseUrlProps = { [key in Region]: Partial<GuideLinks> };

const baseUrlPrefix: BaseUrlProps = {
  EU: {
    DE: `${docUrl}de`,
    ES: `${docUrl}es`,
    IE: `${docUrl}ie/en`,
    IT: `${docUrl}it`,
    PL: `${docUrl}pl`,
    PT: `${docUrl}pt`,
    FR: `${docUrl}fr`,
    GB: `${docUrl}gb/en`,
  },
  CA: {
    ASIA: `${docUrl}/asia`,
    CA: `${docUrl}ca/en`,
    QC: `${docUrl}ca/fr`,
    IN: `${docUrl}/asia`,
    SG: `${docUrl}/sg/en/`,
    WE: `${docUrl}us/en`,
    WS: `${docUrl}us/en`,
  },
  US: {
    US: `${docUrl}us/en`,
  },
};

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
  region: Region;
  subsidiary: CountryCode;
};

function getGuideListLink({ region, subsidiary }: GetGuideLinkProps) {
  const baseUrl = `${baseUrlPrefix?.[region]?.[subsidiary]}`;
  const list: { [guideName: string]: string } = {};
  const tmp = Object.entries(GUIDE_LIST);
  tmp.forEach((value) => {
    list[value[0]] = `${baseUrl}${value[1][subsidiary]}`;
    return value;
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

export function useGuideUtils() {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [region, setRegion] = useState<Region>(Region.EU);
  const [subsidiary, setSubsidiary] = useState<CountryCode>(CountryCode.FR);
  const [linkTabs, setLinkTabs] = useState<GuideLinkProps>({});

  useEffect(() => {
    const fetch = async () => {
      const env = await environment.getEnvironment();
      setRegion(env.getRegion());
      setSubsidiary(env.user.ovhSubsidiary as CountryCode);
    };
    fetch();
  }, []);

  useEffect(() => {
    if (region && subsidiary) {
      const list = getGuideListLink({ region, subsidiary });
      setLinkTabs(list);
    }
  }, [region, subsidiary]);

  return linkTabs;
}

export default useGuideUtils;

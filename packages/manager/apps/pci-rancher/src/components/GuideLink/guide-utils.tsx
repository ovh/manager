import { useState, useEffect } from 'react';
import { Region, CountryCode } from '@ovh-ux/manager-config';
import {
  useAuthentication,
  useEnvironment,
} from '@ovh-ux/manager-react-core-application';

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
  Object.entries(GUIDE_LIST).forEach(([key, value]) => {
    list[key] = `${baseUrl}${value[subsidiary]}`;
  });
  return list;
}

interface GuideLinkProps {
  [guideName: string]: string;
}

function useGuideUtils() {
  const environment = useEnvironment();
  const region = environment.getRegion();
  const { subsidiary } = useAuthentication();
  const [linkTabs, setLinkTabs] = useState<GuideLinkProps>({});

  useEffect(() => {
    setLinkTabs(
      getGuideListLink({ region, subsidiary: subsidiary as CountryCode }),
    );
  }, [region, subsidiary]);

  return linkTabs;
}

export default useGuideUtils;

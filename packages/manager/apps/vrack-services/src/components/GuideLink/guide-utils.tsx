import React from 'react';
import { Region, CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

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
    CA: `${docUrl}ca/en`,
    QC: `${docUrl}ca/fr`,
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
};

type GetGuideLinkProps = {
  name?: string;
  region: Region;
  subsidiary: CountryCode;
};

function getGuideListLink({ region, subsidiary }: GetGuideLinkProps) {
  const baseUrl = `${baseUrlPrefix?.[region]?.[subsidiary]}`;
  return Object.entries(GUIDE_LIST).reduce(
    (result, [key, value]) => ({
      [key]: `${baseUrl}${value[subsidiary]}`,
      ...result,
    }),
    {} as { [guideName: string]: string },
  );
}

export type UseGuideLinkProps = {
  [guideName: string]: string;
};

export function useGuideUtils() {
  const { environment } = React.useContext(ShellContext);
  const region = environment.getRegion();
  const user = environment.getUser();
  const [linkTabs, setLinkTabs] = React.useState<UseGuideLinkProps>({});

  React.useEffect(() => {
    setLinkTabs(
      getGuideListLink({
        region,
        subsidiary: user.ovhSubsidiary as CountryCode,
      }),
    );
  }, [region, user.ovhSubsidiary]);

  return linkTabs;
}

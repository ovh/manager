import { useContext, useEffect, useState } from 'react';

import { CountryCode } from '@ovh-ux/manager-config';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

type GuideLinks = { [key in CountryCode]: string };

// Countries that should use FR links
const FR_SUBSIDIARIES: CountryCode[] = [CountryCode.MA, CountryCode.SN, CountryCode.TN];

// FIXME: update guide URLs once available
const GUIDE_URLS = {
  gettingStarted: {
    DE: 'https://help.ovhcloud.com/csm/de-observability-getting-started',
    ES: 'https://help.ovhcloud.com/csm/es-es-observability-getting-started',
    FR: 'https://help.ovhcloud.com/csm/fr-observability-getting-started',
    GB: 'https://help.ovhcloud.com/csm/en-gb-observability-getting-started',
    IE: 'https://help.ovhcloud.com/csm/en-ie-observability-getting-started',
    IT: 'https://help.ovhcloud.com/csm/it-observability-getting-started',
    PL: 'https://help.ovhcloud.com/csm/pl-observability-getting-started',
    PT: 'https://help.ovhcloud.com/csm/pt-observability-getting-started',
    CA: 'https://help.ovhcloud.com/csm/en-ca-observability-getting-started',
    QC: 'https://help.ovhcloud.com/csm/fr-ca-observability-getting-started',
    US: 'https://help.ovhcloud.com/csm/en-us-observability-getting-started',
  },
  documentation: {
    DE: 'https://help.ovhcloud.com/csm/de-documentation-observability',
    ES: 'https://help.ovhcloud.com/csm/es-es-documentation-observability',
    FR: 'https://help.ovhcloud.com/csm/fr-documentation-observability',
    GB: 'https://help.ovhcloud.com/csm/en-gb-documentation-observability',
    IE: 'https://help.ovhcloud.com/csm/en-ie-documentation-observability',
    IT: 'https://help.ovhcloud.com/csm/it-documentation-observability',
    PL: 'https://help.ovhcloud.com/csm/pl-documentation-observability',
    PT: 'https://help.ovhcloud.com/csm/pt-documentation-observability',
    CA: 'https://help.ovhcloud.com/csm/en-ca-documentation-observability',
    QC: 'https://help.ovhcloud.com/csm/fr-ca-documentation-observability',
    US: 'https://help.ovhcloud.com/csm/en-us-documentation-observability',
  },
} as const;

export const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = Object.fromEntries(
  Object.entries(GUIDE_URLS).map(([guideName, urls]) => [
    guideName,
    {
      ...urls,
      ...Object.fromEntries(FR_SUBSIDIARIES.map((code) => [code, urls.FR])),
    },
  ]),
);

type GetGuideLinkProps = {
  subsidiary: CountryCode | string;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  const list: { [guideName: string]: string } = {};
  Object.entries(GUIDE_LIST).forEach(([key, guideLinks]) => {
    if (guideLinks) {
      const link = guideLinks[subsidiary as CountryCode] ?? guideLinks[CountryCode.GB];
      if (link) {
        list[key] = link;
      }
    }
  });
  return list;
}

export interface GuideLinkProps {
  [guideName: string]: string;
}

export function useMetricsGuides() {
  const { shell } = useContext(ShellContext);
  const { environment } = shell;
  const [list, setList] = useState<GuideLinkProps>({});

  useEffect(() => {
    const getSubSidiary = async () => {
      const env = await environment.getEnvironment();
      const { ovhSubsidiary } = env.getUser();
      const guideList = getGuideListLink({ subsidiary: ovhSubsidiary });
      setList(guideList);
    };
    void getSubSidiary();
  }, [environment]);

  return list;
}

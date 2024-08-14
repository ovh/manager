import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Subsidiaries } from '@/utils/subsidiaries';

type GuideLinks = { [key in Subsidiaries]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  guideLink2: {
    DE:
      'https://help.ovhcloud.com/csm/de-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062696',
    ES:
      'https://help.ovhcloud.com/csm/es-es-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062697',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062698',
    IT:
      'https://help.ovhcloud.com/csm/it-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062700',
    PL:
      'https://help.ovhcloud.com/csm/pl-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062709',
    PT:
      'https://help.ovhcloud.com/csm/pl-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062709',
    FR:
      'https://help.ovhcloud.com/csm/fr-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062705',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062703',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062704',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062701',
    WE:
      'https://help.ovhcloud.com/csm/en-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062706',
    WS:
      'https://help.ovhcloud.com/csm/es-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062708',
    US:
      'https://help.ovhcloud.com/csm/en-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062706',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062695',
    AU:
      'https://help.ovhcloud.com/csm/en-au-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062702',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-network-vrack-services-global-concept?id=kb_article_view&sysparm_article=KB0062699',
  },
  guideLink1: {
    DE:
      'https://help.ovhcloud.com/csm/de-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062694',
    ES:
      'https://help.ovhcloud.com/csm/es-es-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062712',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062719',
    IT:
      'https://help.ovhcloud.com/csm/it-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062713',
    PL:
      'https://help.ovhcloud.com/csm/pl-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062723',
    PT:
      'https://help.ovhcloud.com/csm/pt-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062717',
    FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062718',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062711',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062716',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062721',
    WE:
      'https://help.ovhcloud.com/csm/en-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062715',
    WS:
      'https://help.ovhcloud.com/csm/es-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062720',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062722',
    AU:
      'https://help.ovhcloud.com/csm/en-au-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062710',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-public-cloud-storage-netapp-network-configuration?id=kb_article_view&sysparm_article=KB0062714',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: Subsidiaries;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  return Object.entries(GUIDE_LIST).reduce(
    (result, [key, value]) => ({
      [key]: value[subsidiary],
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

  return getGuideListLink({
    subsidiary: environment.getUser().ovhSubsidiary as Subsidiaries,
  });
}

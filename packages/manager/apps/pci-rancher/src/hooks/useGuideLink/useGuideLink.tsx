import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovhcloud/manager-components';

type GuideLinks = { [key in OvhSubsidiary]: string };

const GUIDE_LIST: { [guideName: string]: Partial<GuideLinks> } = {
  MANAGED_RANCHER_SERVICE_GETTING_STARTED: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061906',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061896',
    AU:
      'https://help.ovhcloud.com/csm/en-au-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061910',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061904',
    DE:
      'https://help.ovhcloud.com/csm/de-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061897',
    ES:
      'https://help.ovhcloud.com/csm/es-es-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061901',
    EU:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061898',
    FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061903',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061909',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061898',
    IN:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061896',
    IT:
      'https://help.ovhcloud.com/csm/it-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061907',
    MA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061903',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
    PL:
      'https://help.ovhcloud.com/csm/pl-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061908',
    PT:
      'https://help.ovhcloud.com/csm/pt-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061905',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061899',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061895',
    SN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061903',
    TN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061903',
    US: 'https://us.ovhcloud.com/support',
    WE:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061906',
    WS:
      'https://help.ovhcloud.com/csm/es-public-cloud-managed-rancher-service-getting-started?id=kb_article_view&sysparm_article=KB0061900',
  },
};

type GetGuideLinkProps = {
  name?: string;
  subsidiary: OvhSubsidiary;
};

function getGuideListLink({ subsidiary }: GetGuideLinkProps) {
  return Object.entries(GUIDE_LIST).reduce(
    (result, [key, value]) => ({
      [key]: value[subsidiary] ?? value.DEFAULT,
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
  const user = environment.getUser();
  const [linkTabs, setLinkTabs] = React.useState<UseGuideLinkProps>({});

  React.useEffect(() => {
    setLinkTabs(
      getGuideListLink({
        subsidiary: user.ovhSubsidiary as OvhSubsidiary,
      }),
    );
  }, [user.ovhSubsidiary]);

  return linkTabs;
}

import React from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

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
  MANAGED_RANCHER_SERVICE_CREATION: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064191',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064184',
    AU:
      'https://help.ovhcloud.com/csm/en-au-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064190',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064197',
    DE:
      'https://help.ovhcloud.com/csm/de-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064194',
    ES:
      'https://help.ovhcloud.com/csm/es-es-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064193',
    EU:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064183',
    FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064198',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064189',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064183',
    IN:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064184',
    IT:
      'https://help.ovhcloud.com/csm/it-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064195',
    MA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064198',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
    PL:
      'https://help.ovhcloud.com/csm/pl-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064187',
    PT:
      'https://help.ovhcloud.com/csm/pt-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064196',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064186',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064192',
    SN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064198',
    TN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064198',
    US: 'https://us.ovhcloud.com/support',
    WE:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064191',
    WS:
      'https://help.ovhcloud.com/csm/es-public-cloud-managed-rancher-service-creation?id=kb_article_view&sysparm_article=KB0064185',
  },
  MANAGED_RANCHER_SERVICE_CREATION_USERS_PROJECTS: {
    DEFAULT:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064217',
    ASIA:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064215',
    AU:
      'https://help.ovhcloud.com/csm/en-au-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064218',
    CA:
      'https://help.ovhcloud.com/csm/en-ca-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064214',
    DE:
      'https://help.ovhcloud.com/csm/de-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064212',
    ES:
      'https://help.ovhcloud.com/csm/es-es-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064221',
    EU:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064216',
    FR:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064222',
    GB:
      'https://help.ovhcloud.com/csm/en-gb-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064225',
    IE:
      'https://help.ovhcloud.com/csm/en-ie-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064216',
    IN:
      'https://help.ovhcloud.com/csm/asia-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064215',
    IT:
      'https://help.ovhcloud.com/csm/it-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064220',
    MA:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064222',
    NL:
      'https://help.ovhcloud.com/csm/en-nl-documentation-public-cloud?id=kb_browse_cat&kb_id=574a8325551974502d4c6e78b7421938',
    PL:
      'https://help.ovhcloud.com/csm/pl-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064226',
    PT:
      'https://help.ovhcloud.com/csm/pt-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064227',
    QC:
      'https://help.ovhcloud.com/csm/fr-ca-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064223',
    SG:
      'https://help.ovhcloud.com/csm/en-sg-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064224',
    SN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064222',
    TN:
      'https://help.ovhcloud.com/csm/fr-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064222',
    US: 'https://us.ovhcloud.com/support',
    WE:
      'https://help.ovhcloud.com/csm/en-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064217',
    WS:
      'https://help.ovhcloud.com/csm/es-public-cloud-managed-rancher-service-managing-users-projects?id=kb_article_view&sysparm_article=KB0064219',
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

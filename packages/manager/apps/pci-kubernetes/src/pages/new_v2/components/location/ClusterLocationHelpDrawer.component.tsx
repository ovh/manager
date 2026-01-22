import { type FC, useContext } from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { Link, Text } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { HelpDrawer } from '@/components/helpDrawer/HelpDrawer.component';
import { DEPLOYMENT_URL, REGIONS_DOCUMENTATION_LINK } from '@/constants';

export const ClusterLocationHelpDrawer: FC = () => {
  const { t } = useTranslation('region-selector');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  const deploymentDocumentationLink = DEPLOYMENT_URL[ovhSubsidiary] ?? DEPLOYMENT_URL.DEFAULT;

  const regionsDocumentationLink =
    REGIONS_DOCUMENTATION_LINK[ovhSubsidiary] ?? REGIONS_DOCUMENTATION_LINK.DEFAULT;

  return (
    <HelpDrawer>
      <Text preset="heading-2" className="mb-4">
        {t('region-selector:cluster_location_help_drawer.title')}
      </Text>
      <Text>
        <Trans
          ns="region-selector"
          components={{ strong: <strong /> }}
          i18nKey="region-selector:cluster_location_help_drawer.intro"
        />
      </Text>
      <Text className="mb-4 mt-6" preset="heading-3">
        {t('region-selector:cluster_location_help_drawer.3az_title')}
      </Text>
      <Text className="mb-4">
        <Trans
          ns="region-selector"
          components={{ strong: <strong /> }}
          i18nKey="region-selector:cluster_location_help_drawer.3az_control_plane"
        />
      </Text>
      <Text>
        <Trans
          ns="region-selector"
          components={{ strong: <strong /> }}
          i18nKey="region-selector:cluster_location_help_drawer.3az_worker_nodes"
        />
      </Text>
      <Text className="mb-4 mt-6" preset="heading-3">
        {t('region-selector:cluster_location_help_drawer.1az_title')}
      </Text>
      <Text className="mb-4">
        <Trans
          ns="region-selector"
          components={{ strong: <strong /> }}
          i18nKey="region-selector:cluster_location_help_drawer.1az_control_plane"
        />
      </Text>
      <Text>
        <Trans
          ns="region-selector"
          components={{ strong: <strong /> }}
          i18nKey="region-selector:cluster_location_help_drawer.1az_worker_nodes"
        />
      </Text>
      <Link
        className="mt-6"
        href={regionsDocumentationLink}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('region-selector:cluster_location_help_drawer.regions_title')}
      </Link>
      <Link
        className="mt-4"
        href={deploymentDocumentationLink}
        target={OdsHTMLAnchorElementTarget._blank}
      >
        {t('region-selector:cluster_location_help_drawer.deployment_types_title')}
      </Link>
    </HelpDrawer>
  );
};

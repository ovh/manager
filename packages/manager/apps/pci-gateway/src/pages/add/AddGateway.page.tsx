import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useHref, useParams } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  Notifications,
  PciGuidesHeader,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  isDiscoveryProject,
  PciDiscoveryBanner,
  useProject,
} from '@ovh-ux/manager-pci-common';
import { SizeStep } from '@/pages/add/SizeStep';
import { LocationStep } from '@/pages/add/LocationStep';
import { NetworkStep } from '@/pages/add/NetworkStep';
import { useNewGatewayStore } from '@/pages/add/useStore';
import { PUBLIC_GATEWAYS_READ_MORE_GUIDE } from '@/constants';
import { ACTION_PREFIX } from '@/tracking.constants';
import HidePreloader from '@/core/HidePreloader';

export default function AddGatewayPage(): JSX.Element {
  const { t } = useTranslation('common');
  const { t: tAdd } = useTranslation('add');
  const { t: tEdit } = useTranslation('edit');
  const { clearNotifications } = useNotifications();
  const { projectId } = useParams();
  const { data: project } = useProject();
  const store = useNewGatewayStore();
  const projectUrl = useProjectUrl('public-cloud');
  const backHref = useHref('..');
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;
  const learnMoreLink =
    PUBLIC_GATEWAYS_READ_MORE_GUIDE.ALL_GUIDE[ovhSubsidiary] ||
    PUBLIC_GATEWAYS_READ_MORE_GUIDE.ALL_GUIDE.DEFAULT;

  // reset form on page load
  useEffect(() => {
    store.reset();
  }, []);

  useEffect(() => {
    store.setProject({
      id: projectId,
      isDiscovery: isDiscoveryProject(project),
    });
    clearNotifications();
  }, [project]);

  return (
    <>
      <HidePreloader />
      {project && (
        <OsdsBreadcrumb
          onClick={() => clearNotifications()}
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: backHref,
              label: t('pci_projects_project_public_gateway_title'),
            },
            {
              label: tAdd('pci_projects_project_public_gateways_add_title'),
            },
          ]}
        />
      )}

      <OsdsDivider></OsdsDivider>
      <Notifications />
      <OsdsLink
        className="mt-6 mb-3"
        color={ODS_THEME_COLOR_INTENT.primary}
        href={backHref}
        onClick={() => {
          clearNotifications();
          tracking.trackClick({
            name: `${ACTION_PREFIX}::add:back`,
            type: 'action',
          });
        }}
      >
        <OsdsIcon
          className="mr-2"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
          slot="start"
        />
        {tEdit('pci_projects_project_public_gateway_edit_go_back')}
      </OsdsLink>
      <div className="flex items-center justify-between mt-4">
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {tAdd('pci_projects_project_public_gateways_add_title')}
        </OsdsText>
        <div className="xs:w-32 sm:w-auto xs:pl-7 sm:pl-0">
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
      </div>
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_description1')}
        </OsdsText>
      </p>
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_description2')}
        </OsdsText>
      </p>
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_public_gateways_add_description3')}
        </OsdsText>
        &nbsp;
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={learnMoreLink}
          target={OdsHTMLAnchorElementTarget._blank}
        >
          {tAdd('pci_projects_project_public_gateways_add_learn_more')}
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
            slot="end"
          />
        </OsdsLink>
      </p>

      <div className="mb-8">
        <PciDiscoveryBanner project={project} />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <SizeStep />
        <LocationStep />
        <NetworkStep />
      </div>
    </>
  );
}

import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
} from '@ovhcloud/manager-components';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import useProject from '@/api/hooks/useProject';
import { SizeStep } from '@/pages/add/SizeStep';
import { LocationStep } from '@/pages/add/LocationStep';
import { NetworkStep } from '@/pages/add/NetworkStep';
import { useNewGatewayStore } from '@/pages/add/useStore';

export default function AddGatewayPage(): JSX.Element {
  const navigation = useNavigation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { t: tAdd } = useTranslation('add');
  const { t: tEdit } = useTranslation('edit');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const [projectUrl, setProjectUrl] = useState('');
  const store = useNewGatewayStore();

  useEffect(() => {
    // const appName = 'public-cloud';
    navigation.getURL('', `#/pci/projects/${projectId}`, {}).then((data) => {
      setProjectUrl(data as string);
    });
  }, [projectId, navigation]);

  useEffect(() => {
    store.setProject({
      id: projectId,
      isDiscovery: isDiscoveryProject(project),
    });
  }, [project]);

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              href: `${projectUrl}/gateway`,
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
        onClick={() => navigate('..')}
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
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {tAdd('pci_projects_project_public_gateways_add_title')}
        </OsdsText>
        <PciGuidesHeader category="instances"></PciGuidesHeader>
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
        <OsdsLink color={ODS_THEME_COLOR_INTENT.primary}>
          {tAdd('pci_projects_project_public_gateways_add_learn_more')}
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
            slot="end"
          />
        </OsdsLink>
      </p>
      {store.project?.isDiscovery && (
        <div className="mb-8">
          <PciDiscoveryBanner projectId={projectId} />
        </div>
      )}
      <div className="grid grid-cols-1 gap-4">
        <SizeStep />
        <LocationStep />
        <NetworkStep />
      </div>
    </>
  );
}

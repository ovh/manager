import {
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
} from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import useProject from '@/api/hooks/useProject';

export default function ListingPage() {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');

  const navigation = useNavigation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');

  useEffect(() => {
    navigation
      .getURL('public-cloud', `#/pci/projects/${projectId}`, {})
      .then((data) => {
        setProjectUrl(data as string);
      });
  }, [projectId, navigation]);

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
              label: t('pci_projects_project_public_gateway_title'),
            },
          ]}
        />
      )}
      <div className="header mb-6 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_projects_project_public_gateway_title')}
          </OsdsText>
          <PciGuidesHeader category="instances"></PciGuidesHeader>
        </div>
      </div>
      <div>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {t('pci_projects_project_public_gateways_intro_part_1')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          className={'mt-3'}
        >
          <ul>
            <li>{t('pci_projects_project_public_gateways_intro_part_2')}</li>
            <li>{t('pci_projects_project_public_gateways_intro_part_3')}</li>
          </ul>
        </OsdsText>
      </div>

      <OsdsDivider></OsdsDivider>
      <Notifications />
      <div className="mb-5">
        {isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>
      <Outlet />
    </>
  );
}

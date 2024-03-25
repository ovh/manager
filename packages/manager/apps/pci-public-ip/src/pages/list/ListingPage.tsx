import { useNavigation } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsBreadcrumb,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabPanel,
  OsdsTabs,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { PciGuidesHeader } from '@ovhcloud/manager-components';
import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { FloatingIPComponent } from '@/components/list';
import { IPsTabName } from '@/constants';
import useProject from '@/api/hooks/useProject';

export default function ListingPage(): JSX.Element {
  const { t } = useTranslation('common');
  const [projectUrl, setProjectUrl] = useState('');
  const [activeTab, setActiveTab] = useState<IPsTabName>(
    IPsTabName.FLOATING_IP_TAB_NAME,
  );

  const navigation = useNavigation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');

  const handlerTabChanged = (event: CustomEvent) => {
    const { panel } = event.detail;
    setActiveTab(panel as IPsTabName);
  };

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
              label: t('pci_additional_ips_title'),
            },
            {
              label:
                activeTab === IPsTabName.ADDITIONAL_IP_TAB_NAME
                  ? t('pci_additional_ips_failover_ip_title')
                  : t('pci_additional_ips_floating_ip_title'),
            },
          ]}
        />
      )}
      <div className="header mb-10 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_additional_ips_title')}
          </OsdsText>
          <PciGuidesHeader category="storage"></PciGuidesHeader>
        </div>
        <div className="mt-4">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          >
            {t('pci_additional_ips_additional_ips_description')}
          </OsdsText>
        </div>
      </div>
      <OsdsTabs onOdsTabsChanged={(event) => handlerTabChanged(event)}>
        <OsdsTabBar slot="top">
          <OsdsTabBarItem
            panel={IPsTabName.FLOATING_IP_TAB_NAME}
            className="flex items-center justify-center"
          >
            {t('pci_additional_ips_floating_ip_title')}
          </OsdsTabBarItem>
          <OsdsTabBarItem
            panel={IPsTabName.ADDITIONAL_IP_TAB_NAME}
            className="flex items-center justify-center"
          >
            {t('pci_additional_ips_failover_ip_title')}
          </OsdsTabBarItem>
        </OsdsTabBar>

        <OsdsTabPanel name={IPsTabName.FLOATING_IP_TAB_NAME}>
          <FloatingIPComponent projectId={projectId} projectUrl={projectUrl} />
        </OsdsTabPanel>
        <OsdsTabPanel name={IPsTabName.ADDITIONAL_IP_TAB_NAME}></OsdsTabPanel>
      </OsdsTabs>
    </>
  );
}

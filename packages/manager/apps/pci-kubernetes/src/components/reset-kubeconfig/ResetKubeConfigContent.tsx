import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE, ODS_TEXT_COLOR_INTENT, ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import { OsdsMessage, OsdsText } from '@ovhcloud/ods-components/react';

type ResetKubeConfigContentProps = {
  isClusterReady: boolean;
};
export default function ResetKubeConfigContent({
  isClusterReady,
}: Readonly<ResetKubeConfigContentProps>) {
  const { t } = useTranslation('reset-kubeconfig');
  return isClusterReady ? (
    <>
      <OsdsMessage
        type={ODS_MESSAGE_TYPE.warning}
        color={ODS_THEME_COLOR_INTENT.warning}
        className="mt-6"
      >
        {t('pci_projects_project_kubernetes_service_reset_kubeconfig_message')}
      </OsdsMessage>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('pci_projects_project_kubernetes_service_reset_kubeconfig_description1')}
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('pci_projects_project_kubernetes_service_reset_kubeconfig_description2')}
      </OsdsText>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('pci_projects_project_kubernetes_service_reset_kubeconfig_description3')}
      </OsdsText>
    </>
  ) : (
    <OsdsText
      color={ODS_TEXT_COLOR_INTENT.text}
      level={ODS_TEXT_LEVEL.body}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      className="mt-6 block"
    >
      {t('pci_projects_project_kubernetes_service_reset_kubeconfig_cluster_not_ready')}
    </OsdsText>
  );
}

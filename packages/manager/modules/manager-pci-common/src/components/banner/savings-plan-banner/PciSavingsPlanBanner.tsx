import { ActionBanner, useProjectUrl } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

const PciSavingsPlanBanner = ({ className }: { className: string }) => {
  const { t } = useTranslation('savings-plan-banner');
  const projectURL = useProjectUrl('public-cloud');
  const {
    navigation: { navigateTo },
  } = useContext(ShellContext).shell;
  const navigateToSavingsPlan = async () => {
    await navigateTo(
      'public-cloud',
      `#/pci/projects/${projectURL}/savings-plan`,
      {},
    );
  };

  return (
    <ActionBanner
      message={t('pci_projects_savings_plan_banner')}
      cta={t('pci_projects_savings_plan_cta')}
      type={ODS_MESSAGE_TYPE.info}
      onClick={navigateToSavingsPlan}
      className={className}
    />
  );
};

export default PciSavingsPlanBanner;

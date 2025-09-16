import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Link } from 'react-router-dom';

import { DashboardItem } from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

const otherActionsItems: DashboardItem[] = [
  {
    iconODS: ODS_ICON_NAME.book,
    labelTranslationKey: 'pci_projects_project_create_ai_notebook',
    link: `ai-ml/auth`,
  },
  {
    iconODS: ODS_ICON_NAME.network,
    labelTranslationKey: 'pci_projects_project_create_load_balancer',
    link: `octavia-load-balancer/load-balancers`,
  },
  {
    iconODS: ODS_ICON_NAME.bill,
    labelTranslationKey: 'pci_projects_project_billing',
    link: `billing`,
  },
  {
    iconODS: ODS_ICON_NAME.cog,
    labelTranslationKey: 'pci_projects_project_quotas',
    link: `quota`,
  },
];

function Others() {
  const { t } = useTranslation('project');

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center">
        <OdsText
          preset={ODS_TEXT_PRESET.heading3}
          className="whitespace-nowrap mr-4"
        >
          {t('pci_projects_project_others')}
        </OdsText>
        {otherActionsItems.map((item, idx) =>
          item.link ? (
            <Link to={item.link} style={{ textDecoration: 'none' }} key={idx}>
              <OdsButton
                variant="outline"
                className="whitespace-nowrap flex items-center m-3"
                icon={item.iconODS}
                label={t(item.labelTranslationKey)}
              />
            </Link>
          ) : (
            <OdsButton
              key={idx}
              variant="outline"
              className="whitespace-nowrap flex items-center m-3"
              icon={item.iconODS}
              label={t(item.labelTranslationKey)}
            />
          ),
        )}
      </div>
    </div>
  );
}

export default Others;

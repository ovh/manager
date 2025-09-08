import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export type OtherActionItem = {
  icon: keyof typeof ODS_ICON_NAME;
  label: string;
  link: string;
};

export function Others({ items }: { items: OtherActionItem[] }) {
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
        {items.map((action, idx) => (
          <Link to={action.link} style={{ textDecoration: 'none' }} key={idx}>
            <OdsButton
              variant="outline"
              className="whitespace-nowrap flex items-center m-3"
              icon={ODS_ICON_NAME[action.icon]}
              label={action.label}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

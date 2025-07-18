import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { Link } from 'react-router-dom';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

export type OtherActionItem = {
  icon: keyof typeof ODS_ICON_NAME;
  label: string;
  link: string;
};

export function Others({ items }: { items: OtherActionItem[] }) {
  const { t } = useTranslation(['home']);

  return (
    <div className="my-8">
      <div className="flex flex-wrap items-center gap-3 mt-4 sm:flex-nowrap">
        <Subtitle className="mr-4 whitespace-nowrap">{t('others')}</Subtitle>
        <div className="flex flex-wrap gap-3 flex-1">
          {items.map((action, idx) => (
            <Link to={action.link} style={{ textDecoration: 'none' }} key={idx}>
              <OdsButton
                variant="outline"
                className="whitespace-nowrap flex items-center gap-2 px-4 py-2"
                icon={ODS_ICON_NAME[action.icon]}
                label={action.label}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

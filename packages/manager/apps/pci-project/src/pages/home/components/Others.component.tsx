import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { Link } from 'react-router-dom';

import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

function Others() {
  const { t } = useTranslation('home');

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center">
        <OdsText
          preset={ODS_TEXT_PRESET.heading3}
          className="whitespace-nowrap mr-4"
        >
          {t('pci_projects_home_others')}
        </OdsText>
        {DASHBOARD_OTHER_ACTIONS_ITEMS.map((item, idx) =>
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

import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { useDashboardLinks } from '@/hooks/home/useDashboardLinks';

function Others() {
  const { t } = useTranslation('home');

  // Convert paths to absolute URLs
  const otherActionItems = useDashboardLinks(DASHBOARD_OTHER_ACTIONS_ITEMS);

  return (
    <div className="my-4">
      <div className="flex flex-wrap items-center">
        <OdsText
          preset={ODS_TEXT_PRESET.heading3}
          className="whitespace-nowrap mr-4"
        >
          {t('pci_projects_home_others')}
        </OdsText>
        {otherActionItems.map((item, idx) =>
          item.link ? (
            <a href={item.link} style={{ textDecoration: 'none' }} key={idx}>
              <OdsButton
                variant="outline"
                className="whitespace-nowrap flex items-center m-3"
                icon={item.iconODS}
                label={t(item.labelTranslationKey)}
              />
            </a>
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

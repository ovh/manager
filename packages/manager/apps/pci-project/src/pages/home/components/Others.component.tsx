import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';
import { DashboardItem } from '@/data/types/dashboard.type';
import { useProjectIdInLinks } from '@/hooks/home/useProjectIdInLinks';
import { useDashboardItemsFilteredByFA } from '@/hooks/useDashboardItemsFilteredByFA';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

function Others() {
  const { t } = useTranslation('home');
  const { trackClick } = useOvhTracking();

  const filteredOtherActionItems = useDashboardItemsFilteredByFA(
    DASHBOARD_OTHER_ACTIONS_ITEMS,
  );

  const otherActionItems = useProjectIdInLinks(filteredOtherActionItems);

  const handleOtherActionClick = (item: DashboardItem) => {
    trackClick({
      actionType: 'action',
      actions: ['page', 'button', item.trackingName || ''],
    });
  };

  return (
    <div className="flex flex-wrap items-center">
      <OdsText preset="heading-4" className="whitespace-nowrap mr-4">
        {t('pci_projects_home_others')}
      </OdsText>
      {otherActionItems.map((item, idx) =>
        item.link ? (
          <a
            href={item.link}
            style={{ textDecoration: 'none' }}
            key={idx}
            onClick={() => handleOtherActionClick(item)}
          >
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
            onClick={() => handleOtherActionClick(item)}
          />
        ),
      )}
    </div>
  );
}

export default Others;

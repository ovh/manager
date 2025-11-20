import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';
import { DashboardItem } from '@/data/models/Dashboard.type';
import { useProjectIdInLinks } from '@/hooks/home/useProjectIdInLinks';
import { useDashboardItemsFilteredByFA } from '@/hooks/useDashboardItemsFilteredByFA';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';

function Others() {
  const { t } = useTranslation('home');
  const { trackClick } = useOvhTracking();

  // Filter items by feature flags first, then convert paths to absolute URLs
  const filteredOtherActionItems = useDashboardItemsFilteredByFA(DASHBOARD_OTHER_ACTIONS_ITEMS);
  const otherActionItems = useProjectIdInLinks(filteredOtherActionItems);

  const handleOtherActionClick = (item: DashboardItem) => {
    trackClick({
      actionType: 'action',
      actions: ['page', 'button', item.trackingName || ''],
    });
  };

  return (
    <div className="flex flex-wrap items-center">
      <OdsText preset="heading-4" className="mr-4 whitespace-nowrap">
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
              className="m-3 flex items-center whitespace-nowrap"
              icon={item.iconODS}
              label={t(item.labelTranslationKey)}
            />
          </a>
        ) : (
          <OdsButton
            key={idx}
            variant="outline"
            className="m-3 flex items-center whitespace-nowrap"
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

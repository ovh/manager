import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { DASHBOARD_OTHER_ACTIONS_ITEMS } from '@/constants';
import useTranslation from '@/hooks/usePermissiveTranslation.hook';
import { useDashboardLinks } from '@/hooks/home/useDashboardLinks';
import { PROJECTS_TRACKING } from '@/tracking.constant';

function Others() {
  const { t } = useTranslation('home');
  const { trackClick } = useOvhTracking();

  // Convert paths to absolute URLs
  const otherActionItems = useDashboardLinks(DASHBOARD_OTHER_ACTIONS_ITEMS);

  const handleOtherActionClick = (item: { labelTranslationKey?: string }) => {
    // Track the click action
    trackClick({
      actionType: 'action',
      actions: [
        ...PROJECTS_TRACKING.PROJECT_HOME.CTA_OTHER_ACTIONS,
        item.labelTranslationKey || 'unknown',
      ],
    });
  };

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
    </div>
  );
}

export default Others;

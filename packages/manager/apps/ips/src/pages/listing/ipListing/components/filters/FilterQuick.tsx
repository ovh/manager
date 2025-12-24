import React, { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsCheckbox,
  OdsDivider,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';

import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { ListingContext } from '@/pages/listing/listingContext';

export const QuickFilter = ({ className }: { className?: string }) => {
  const { t } = useTranslation('listing');
  const { apiFilter, setApiFilter } = useContext(ListingContext);
  const { trackClick } = useOvhTracking();

  return (
    <>
      <OdsButton
        className={className}
        isLoading={!apiFilter}
        id="quick-filters"
        icon={ODS_ICON_NAME.filter}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.outline}
        aria-haspopup
        label={t('listingQuickFilterLabel')}
        data-testid="quick-filter"
      />
      <OdsPopover triggerId="quick-filters" withArrow>
        <div className="gap-2">
          <label
            htmlFor="show-ipv4"
            className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
          >
            <OdsCheckbox
              name="show-ipv4"
              inputId="show-ipv4"
              isChecked={[4, undefined].includes(apiFilter?.version)}
              onOdsChange={(e) => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.page,
                  actions: ['Quick-filters', 'IPv4'],
                });
                setApiFilter((prev) => ({
                  ...prev,
                  version: !e.detail.checked ? 6 : undefined,
                }));
              }}
              isDisabled={apiFilter?.version === 4}
            />
            <OdsText className="ml-1">
              {t('listingQuickFilterShowIPv4')}
            </OdsText>
          </label>

          <label
            htmlFor="show-ipv6"
            className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
          >
            <OdsCheckbox
              name="show-ipv6"
              inputId="show-ipv6"
              isChecked={[6, undefined].includes(apiFilter?.version)}
              onOdsChange={(e) => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.page,
                  actions: ['Quick-filters', 'IPv6'],
                });
                setApiFilter((prev) => ({
                  ...prev,
                  version: !e.detail.checked ? 4 : undefined,
                }));
              }}
              isDisabled={apiFilter?.version === 6}
            />
            <OdsText className="ml-1">
              {t('listingQuickFilterShowIPv6')}
            </OdsText>
          </label>
          <OdsDivider />

          <label
            htmlFor="show-parked-ips"
            className="flex cursor-pointer items-center p-2 hover:bg-gray-100"
          >
            <OdsCheckbox
              name="show-parked-ips"
              inputId="show-parked-ips"
              isChecked={apiFilter?.['routedTo.serviceName'] === null}
              onOdsChange={(e) => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.page,
                  actions: ['Quick-filters', 'Parked-IPs'],
                });
                setApiFilter((prev) => ({
                  ...prev,
                  // Set routedToserviceName to null if showing ONLY parked IPs
                  'routedTo.serviceName': e.detail.checked ? null : undefined,
                }));
              }}
            />
            <OdsText className="ml-1">
              {t('listingQuickFilterShowParkedIps')}
            </OdsText>
          </label>
        </div>
      </OdsPopover>
    </>
  );
};

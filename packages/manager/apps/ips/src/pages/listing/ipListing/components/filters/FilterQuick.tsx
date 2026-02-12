import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  Checkbox,
  Divider,
  Popover,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  ICON_NAME,
  CheckboxControl,
  CheckboxLabel,
  PopoverTrigger,
  PopoverContent,
  POPOVER_POSITION,
} from '@ovhcloud/ods-react';

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
    <Popover position={POPOVER_POSITION.top}>
      <PopoverTrigger asChild>
        <Button
          className={className}
          loading={!apiFilter}
          id="quick-filters"
          size={BUTTON_SIZE.sm}
          variant={BUTTON_VARIANT.outline}
          aria-haspopup
          data-testid="quick-filter"
        >
          <Icon name={ICON_NAME.filter} />
          {t('listingQuickFilterLabel')}
        </Button>
      </PopoverTrigger>
      <PopoverContent withArrow>
        <div className="grid gap-4">
          <Checkbox
            name="show-ipv4"
            className="hover:bg-gray-100 w-full p-2"
            checked={[4, undefined].includes(apiFilter?.version)}
            onCheckedChange={(e) => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.page,
                actions: ['Quick-filters', 'IPv4'],
              });
              setApiFilter((prev) => ({
                ...prev,
                version: !e.checked ? 6 : undefined,
              }));
            }}
            disabled={apiFilter?.version === 4}
          >
            <CheckboxControl />
            <CheckboxLabel>{t('listingQuickFilterShowIPv4')}</CheckboxLabel>
          </Checkbox>

          <Checkbox
            className="hover:bg-gray-100 w-full p-2"
            name="show-ipv6"
            checked={[6, undefined].includes(apiFilter?.version)}
            onCheckedChange={(e) => {
              trackClick({
                actionType: 'action',
                buttonType: ButtonType.button,
                location: PageLocation.page,
                actions: ['Quick-filters', 'IPv6'],
              });
              setApiFilter((prev) => ({
                ...prev,
                version: !e.checked ? 4 : undefined,
              }));
            }}
            disabled={apiFilter?.version === 6}
          >
            <CheckboxControl />
            <CheckboxLabel>{t('listingQuickFilterShowIPv6')}</CheckboxLabel>
          </Checkbox>

          <div>
            <Divider />

            <Checkbox
              className="hover:bg-gray-100 w-full p-2"
              name="show-parked-ips"
              checked={apiFilter?.['routedTo.serviceName'] === null}
              onCheckedChange={(e) => {
                trackClick({
                  actionType: 'action',
                  buttonType: ButtonType.button,
                  location: PageLocation.page,
                  actions: ['Quick-filters', 'Parked-IPs'],
                });
                setApiFilter((prev) => ({
                  ...prev,
                  // Set routedToserviceName to null if showing ONLY parked IPs
                  'routedTo.serviceName': e.checked ? null : undefined,
                }));
              }}
            >
              <CheckboxControl />
              <CheckboxLabel>
                {t('listingQuickFilterShowParkedIps')}
              </CheckboxLabel>
            </Checkbox>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

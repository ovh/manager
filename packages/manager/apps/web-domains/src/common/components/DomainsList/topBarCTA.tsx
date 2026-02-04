import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Icon,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { getOrderURL } from '@ovh-ux/manager-module-order';
import { handleOrderClick } from '@/common/utils/utils';
import { useGetEnvironmentData } from '@/common/hooks/environment/data';

interface TopBarCTAProps {
  readonly serviceNames: string[];
  readonly openModal: (serviceNames: string[]) => void;
  readonly openDrawer: (serviceNames: string[]) => void;
}

export default function TopBarCTA({
  serviceNames,
  openModal,
  openDrawer,
}: TopBarCTAProps) {
  const { t } = useTranslation([
    'domain',
    NAMESPACES.ACTIONS,
    'domain-reseller',
  ]);
  const { region, ovhSubsidiary } = useGetEnvironmentData();
  const orderUrl = getOrderURL('orderDomain', region, ovhSubsidiary);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  // Cancel the menu when the customer clicks outside
  const popoverRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setOpenPopover(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex items-center gap-4">
      <Button size={BUTTON_SIZE.sm} onClick={() => handleOrderClick(orderUrl)}>
        {t(`${NAMESPACES.ACTIONS}:order`)}
      </Button>
      <div ref={popoverRef}>
        <Popover position="bottom" open={openPopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenPopover(true)}
            >
              {t(`${NAMESPACES.ACTIONS}:export_as`, { format: 'CSV' })}
              <Icon name="chevron-down" />
            </Button>
          </PopoverTrigger>
          <PopoverContent withArrow className="w-min">
            <Button
              size="sm"
              variant="ghost"
              className="menu-item-button w-full rounded-none justify-start whitespace-nowrap"
              onClick={() => {
                openDrawer([]);
                setOpenPopover(false);
              }}
            >
              {t('domain_table_export_csv')}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="menu-item-button w-full rounded-none justify-start whitespace-nowrap"
              onClick={() => {
                openDrawer(serviceNames);
                setOpenPopover(false);
              }}
              disabled={serviceNames.length === 0}
            >
              {t('domain_table_export_csv_selection', {
                count: serviceNames.length,
              })}
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <Button
        size={BUTTON_SIZE.sm}
        variant={BUTTON_VARIANT.outline}
        onClick={() => openModal(serviceNames)}
        disabled={serviceNames.length === 0}
      >
        {t('domain_table_modal_renew_restore_button', {
          count: serviceNames.length,
        })}
      </Button>
    </div>
  );
}

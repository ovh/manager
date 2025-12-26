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
import { useContext, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getOrderURL } from '@ovh-ux/manager-module-order';

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
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const region = context.environment.getRegion();
  const orderUrl = getOrderURL('orderDomain', region, ovhSubsidiary);
  const [openPopover, setOpenPopover] = useState<boolean>(false);

  const handleOrderClick = () => {
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-4">
      <Button size={BUTTON_SIZE.sm} onClick={handleOrderClick}>
        {t(`${NAMESPACES.ACTIONS}:order`)}
      </Button>
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
        <PopoverContent
          withArrow
          className="pl-0 pr-0 w-min"
          onClick={() => {
            openDrawer([]);
            setOpenPopover(false);
          }}
        >
          <Button
            size="sm"
            variant="ghost"
            className="menu-item-button w-full rounded-none justify-start whitespace-nowrap"
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

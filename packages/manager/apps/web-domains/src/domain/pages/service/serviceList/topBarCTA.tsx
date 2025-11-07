import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
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

  const handleOrderClick = () => {
    window.open(orderUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex items-center gap-4">
      <Button size={BUTTON_SIZE.sm} onClick={handleOrderClick}>
        {t(`${NAMESPACES.ACTIONS}:order`)}
      </Button>
      <div className="whitespace-nowrap [&_button]:h-10">
        <ActionMenu
          id="cta-domain"
          label={t(`${NAMESPACES.ACTIONS}:export_as`, { format: 'CSV' })}
          items={[
            {
              id: 1,
              label: t('domain_table_export_csv'),
              onClick: () => openDrawer([]),
            },
            {
              id: 2,
              label: t('domain_table_export_csv_selection', {
                count: serviceNames.length,
              }),
              isDisabled: serviceNames.length === 0,
              onClick: () => openDrawer(serviceNames),
            },
          ]}
        />
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

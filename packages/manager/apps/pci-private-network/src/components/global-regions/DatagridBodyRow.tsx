import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TSubnet } from '@/api/data/subnets';
import { TAggregatedNetwork } from '@/api/data/network';

export type TDataGridBodyRow = {
  network: TAggregatedNetwork;
  projectUrl: string;
};

export default function DataGridBodyRow({
  projectUrl,
  network,
}: Readonly<TDataGridBodyRow>) {
  const { t } = useTranslation('listing');

  const renderText = (
    text: string | number | JSX.Element,
    className?: string,
  ) => (
    <OsdsText
      className={`text-center ${className || ''}`}
      level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
      color={ODS_THEME_COLOR_INTENT.text}
      size={ODS_THEME_TYPOGRAPHY_SIZE._400}
    >
      {text}
    </OsdsText>
  );

  const renderChip = (text: string, color: ODS_THEME_COLOR_INTENT) => (
    <OsdsChip className="inline-flex m-3" color={color} size={ODS_CHIP_SIZE.sm}>
      {text}
    </OsdsChip>
  );

  const renderTooltipButton = (
    icon: ODS_ICON_NAME,
    tooltipContent: string,
    href?: string,
  ) => (
    <OsdsTooltip>
      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-testid="dataGridBodyRow-delete_button"
        href={href}
      >
        <OsdsIcon
          name={icon}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
      <OsdsTooltipContent slot="tooltip-content">
        {tooltipContent}
      </OsdsTooltipContent>
    </OsdsTooltip>
  );

  const renderSubnetRow = (subnetDetail: TSubnet, index: number) => (
    <tr
      key={`${network.vlanId}-${index}`}
      className="text-center h-[3rem] border-solid border-[1px] border-[var(--ods-color-blue-200)]"
    >
      {index === 0 && (
        <>
          <td rowSpan={network.subnets.length}>{renderText(network.vlanId)}</td>
          <td rowSpan={network.subnets.length}>{renderText(network.name)}</td>
        </>
      )}
      <td>{renderText(subnetDetail.region)}</td>
      <td>{renderText(subnetDetail.cidr)}</td>
      <td>
        {subnetDetail.gatewayName && (
          <OsdsLink
            href={`${projectUrl}/gateway`}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="block"
          >
            {subnetDetail.gatewayName}
          </OsdsLink>
        )}
        {subnetDetail.gatewayIp &&
          subnetDetail.dhcpEnabled &&
          renderText(subnetDetail.gatewayIp)}
      </td>
      <td>
        {renderText(
          subnetDetail.dhcpEnabled
            ? renderChip(
                t('pci_projects_project_network_private_dhcp_active'),
                ODS_THEME_COLOR_INTENT.success,
              )
            : renderChip(
                t('pci_projects_project_network_private_dhcp_disabled'),
                ODS_THEME_COLOR_INTENT.warning,
              ),
        )}
      </td>
      <td>{renderText(subnetDetail.allocatedIp)}</td>
      <td className="text-right pr-6 min-w-16">
        {subnetDetail.gatewayIp &&
          renderTooltipButton(
            ODS_ICON_NAME.SETTINGS,
            t('pci_projects_project_network_private_assign_gateway'),
            `${projectUrl}/gateway/new?network=${subnetDetail.networkId}&region=${subnetDetail.region}`,
          )}
        {renderTooltipButton(
          ODS_ICON_NAME.BIN,
          t('pci_projects_project_network_private_delete'),
          useHref(
            `./delete?networkId=${subnetDetail.networkId}&region=${subnetDetail.region}`,
          ),
        )}
      </td>
    </tr>
  );

  return (
    <>
      {network.subnets.map((subnetDetail: TSubnet, index: number) =>
        renderSubnetRow(subnetDetail, index),
      )}
    </>
  );
}

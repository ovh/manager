import { useVcdIpBlocksMocks } from '@ovh-ux/manager-module-vcd-api';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import {
  ShellContext,
  useNavigationGetUrl,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  OdsMessage,
  OdsSkeleton,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { LABELS } from '@/utils/labels.constants';

export const IpBlockCount = () => {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { data: ipBlocks, error, isLoading } = useVcdIpBlocksMocks({ id });
  const { data: networkIpUrl } = useNavigationGetUrl(['dedicated', '#/ip', {}]);
  const { environment } = useContext(ShellContext);

  const ipBlockType =
    environment.region === 'EU'
      ? LABELS.ipBlockTypeRipe
      : LABELS.ipBlockTypeArin;

  if (isLoading) return <OdsSkeleton />;
  if (error) return <OdsMessage color="danger">{error.message}</OdsMessage>;

  return (
    <section className="flex justify-between items-center">
      <div className="flex flex-col">
        <OdsText className="[&::part(text)]:font-bold">{ipBlockType}</OdsText>
        <OdsText>{ipBlocks.length.toString()}</OdsText>
      </div>
      <ActionMenu
        id="ip_block_menu"
        isCompact
        variant={ODS_BUTTON_VARIANT.ghost}
        icon={ODS_ICON_NAME.ellipsisVertical}
        items={[
          {
            id: 1,
            label: t('managed_vcd_dashboard_ip_block_order'),
            href: networkIpUrl as string,
          },
          {
            id: 2,
            label: t('managed_vcd_dashboard_ip_block_reroute'),
            isDisabled: true,
          },
        ]}
      />
    </section>
  );
};

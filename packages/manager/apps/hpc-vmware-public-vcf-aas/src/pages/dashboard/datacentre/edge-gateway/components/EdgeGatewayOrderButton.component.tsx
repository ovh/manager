import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ODS_BUTTON_COLOR } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsIcon,
  OdsText,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import TEST_IDS from '@/utils/testIds.constants';

export const EdgeGatewayOrderButton = (
  props: React.HTMLAttributes<HTMLDivElement>,
) => {
  const { t } = useTranslation('datacentres/edge-gateway');
  const tooltipId = useId();

  return (
    <div
      {...props}
      className={clsx('flex gap-x-2 items-center w-fit', props.className)}
    >
      <OdsButton
        label={t('edge_add')}
        variant="outline"
        onClick={() => {}}
        data-testid={TEST_IDS.edgeGatewayOrderCta}
      />
      <OdsIcon
        id={tooltipId}
        name="circle-info"
        className="cursor-help"
        color={ODS_BUTTON_COLOR.primary}
      />
      <OdsTooltip triggerId={tooltipId}>
        <OdsText>{t('edge_add_tooltip')}</OdsText>
      </OdsTooltip>
    </div>
  );
};

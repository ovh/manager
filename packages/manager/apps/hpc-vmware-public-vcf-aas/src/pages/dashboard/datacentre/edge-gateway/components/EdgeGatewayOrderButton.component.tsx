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
import { useNavigate } from 'react-router-dom';
import TEST_IDS from '@/utils/testIds.constants';
import { subRoutes } from '@/routes/routes.constant';

type EdgeGatewayOrderButtonProps = React.HTMLAttributes<HTMLDivElement> & {
  isOrderDisabled?: boolean;
};

export const EdgeGatewayOrderButton = ({
  isOrderDisabled = false,
  ...props
}: EdgeGatewayOrderButtonProps) => {
  const { t } = useTranslation('datacentres/edge-gateway');
  const tooltipId = useId();
  const navigate = useNavigate();

  return (
    <div
      {...props}
      className={clsx('flex gap-x-2 items-center w-fit', props.className)}
    >
      <OdsButton
        label={t('edge_add')}
        variant="outline"
        onClick={() => navigate(subRoutes.addEdgeGateway)}
        data-testid={TEST_IDS.edgeGatewayOrderCta}
        isDisabled={isOrderDisabled}
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

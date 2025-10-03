import {
  Button as OdsButton,
  ButtonProp,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TOOLTIP_POSITION,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { ButtonProps } from './Button.props';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export const Button = ({
  children,
  iamActions,
  urn,
  displayTooltip = true,
  tooltipPosition = TOOLTIP_POSITION.bottom,
  isIamTrigger = true,
  ...restProps
}: ButtonProps & ButtonProp) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions || [], urn || '');

  if (isAuthorized || !(iamActions && urn)) {
    return (
      <OdsButton data-testid="manager-button" {...restProps}>
        {children}
      </OdsButton>
    );
  }

  return displayTooltip ? (
    <Tooltip position={tooltipPosition}>
      <TooltipTrigger data-testid="manager-button-tooltip" asChild>
        <OdsButton
          data-testid="manager-button-tooltip"
          {...restProps}
          disabled={true}
        >
          {children}
        </OdsButton>
      </TooltipTrigger>
      <TooltipContent>{t('common_iam_actions_message')}</TooltipContent>
    </Tooltip>
  ) : (
    <OdsButton
      data-testid="manager-button-without-tooltip"
      {...restProps}
      disabled={true}
    >
      {children}
    </OdsButton>
  );
};

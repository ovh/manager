import {
  Text as OdsText,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TOOLTIP_POSITION,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';
import { TextProps } from './Test.props';

export const Text = ({
  children,
  iamActions,
  urn,
  tooltipPosition = TOOLTIP_POSITION.bottom,
  ...restProps
}: TextProps) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn);

  console.info('restProps : ', restProps);
  if (!isAuthorized) {
    return (
      <Tooltip position={tooltipPosition}>
        <TooltipTrigger asChild>
          <OdsText {...restProps}>{t('iam_hidden_text').toUpperCase()}</OdsText>
        </TooltipTrigger>
        <TooltipContent>
          <div>{t('common_iam_get_message')}</div>
        </TooltipContent>
      </Tooltip>
    );
  }
  return <OdsText {...restProps}>{children}</OdsText>;
};

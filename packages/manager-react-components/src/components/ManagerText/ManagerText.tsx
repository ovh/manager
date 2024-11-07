import React, { PropsWithChildren, RefAttributes, HTMLAttributes } from 'react';
import { JSX } from '@ovhcloud/ods-components';
import {
  OsdsText,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import { useTranslation } from 'react-i18next';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export type ManagerTextProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
}>;

export const ManagerText = ({
  children,
  iamActions,
  urn,
  ...restProps
}: ManagerTextProps &
  Partial<
    JSX.OsdsText &
      Omit<HTMLAttributes<HTMLOsdsTextElement>, 'style'> &
      StyleReactProps &
      RefAttributes<HTMLOsdsTextElement>
  >) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn);
  if (!isAuthorized) {
    return (
      <OsdsTooltip>
        <OsdsText {...restProps}>
          {t('iam_hidden_text').toUpperCase()} TEST 1
        </OsdsText>
        <OsdsTooltipContent slot="tooltip-content">
          <div>{t('common_iam_get_message')} COUCOU</div>
        </OsdsTooltipContent>
      </OsdsTooltip>
    );
  }
  return <OsdsText {...restProps}>{children} TEST 4444</OsdsText>;
};

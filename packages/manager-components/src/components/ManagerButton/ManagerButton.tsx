import React, { PropsWithChildren } from 'react';
import {
  OsdsButton,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import './translations';

import { useIsAuthorized } from '../../hooks/iam';

export type ManagerButtonProps = PropsWithChildren<{
  action?: string;
  urn?: string;
}>;

export const ManagerButton = ({
  children,
  action,
  urn,
  ...restProps
}: ManagerButtonProps & any) => {
  const { t } = useTranslation('iam');
  const isAuthorized = useIsAuthorized(action, urn);
  if (!isAuthorized) {
    return (
      <OsdsTooltip>
        <OsdsButton disabled={!isAuthorized ? true : undefined} {...restProps}>
          {children}
        </OsdsButton>
        <OsdsTooltipContent slot="tooltip-content">
          <div>{t('common_iam_actions_message')}</div>
        </OsdsTooltipContent>
      </OsdsTooltip>
    );
  }
  return <OsdsButton {...restProps}>{children}</OsdsButton>;
};

import React, { PropsWithChildren, RefAttributes, HTMLAttributes } from 'react';
import {
  OsdsButton,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { JSX } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export type ManagerButtonProps = PropsWithChildren<{
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
}>;

export const ManagerButton = ({
  children,
  iamActions,
  urn,
  displayTooltip = true,
  isIamTrigger = true,
  ...restProps
}: ManagerButtonProps &
  Partial<
    JSX.OsdsButton &
      Omit<HTMLAttributes<HTMLOsdsButtonElement>, 'style' | 'id'> &
      StyleReactProps &
      RefAttributes<HTMLOsdsButtonElement>
  >) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn, isIamTrigger);

  if (isAuthorized) {
    return <OsdsButton {...restProps}>{children}</OsdsButton>;
  }

  return !displayTooltip ? (
    <OsdsButton {...restProps} disabled onClick={null}>
      {children}
    </OsdsButton>
  ) : (
    <OsdsTooltip>
      <OsdsButton {...restProps} disabled onClick={null}>
        {children}
      </OsdsButton>
      <OsdsTooltipContent slot="tooltip-content">
        <div>{t('common_iam_actions_message')}</div>
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
};

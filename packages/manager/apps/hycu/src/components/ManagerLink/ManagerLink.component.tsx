import React from 'react';
import {
  OsdsLink,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useAuthorizationIam } from '@ovh-ux/manager-react-components';

export type ManagerLinkProps = React.ComponentProps<typeof OsdsLink> & {
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
};

export const ManagerLink = ({
  children,
  iamActions,
  urn,
  displayTooltip = true,
  isIamTrigger = true,
  ...restProps
}: ManagerLinkProps) => {
  const { t } = useTranslation('hycu');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn, isIamTrigger);

  if (isAuthorized) {
    return <OsdsLink {...restProps}>{children}</OsdsLink>;
  }

  return !displayTooltip ? (
    <OsdsLink {...restProps} disabled onClick={null}>
      {children}
    </OsdsLink>
  ) : (
    <OsdsTooltip>
      <OsdsLink {...restProps} disabled onClick={null}>
        {children}
      </OsdsLink>
      <OsdsTooltipContent slot="tooltip-content">
        <div>{t('common_iam_actions_message')}</div>
      </OsdsTooltipContent>
    </OsdsTooltip>
  );
};

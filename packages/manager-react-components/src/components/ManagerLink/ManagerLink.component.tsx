import React, { useId, useMemo } from 'react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OdsLink, OdsTooltip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useAuthorizationIam } from '../../hooks';

export type ManagerLinkProps = React.ComponentProps<typeof OdsLink> & {
  iamActions?: string[];
  urn?: string;
  isDisplayTooltip?: boolean;
  isIamCheckDisabled?: boolean;
};

export const ManagerLink = ({
  children,
  iamActions,
  urn,
  isDisplayTooltip,
  isIamCheckDisabled,
  isDisabled,
  ...restProps
}: ManagerLinkProps) => {
  const tooltipTriggerRawId = useId();
  const tooltipTriggerId = useMemo(
    () => tooltipTriggerRawId.replace(/:/g, ''),
    [tooltipTriggerRawId],
  );

  const { t } = useTranslation(NAMESPACES.IAM);
  const { isAuthorized } = useAuthorizationIam(
    iamActions,
    urn,
    !isIamCheckDisabled,
  );

  if (!isDisabled && (isAuthorized || iamActions === undefined)) {
    return <OdsLink {...restProps}>{children}</OdsLink>;
  }

  return !isDisplayTooltip || isDisabled ? (
    <OdsLink {...restProps} isDisabled onClick={null}>
      {children}
    </OdsLink>
  ) : (
    <div>
      <span id={tooltipTriggerId}>
        <OdsLink {...restProps} isDisabled onClick={null}>
          {children}
        </OdsLink>
      </span>
      <OdsTooltip triggerId={tooltipTriggerId} position="bottom">
        <div>{t('iam_actions_message')}</div>
      </OdsTooltip>
    </div>
  );
};

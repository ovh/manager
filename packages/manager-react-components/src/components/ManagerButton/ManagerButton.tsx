import React, { PropsWithChildren, RefAttributes, HTMLAttributes } from 'react';
import { OdsButton, OdsTooltip } from '@ovhcloud/ods-components/react';
import { JSX } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import './translations';

import { useAuthorizationIam } from '../../hooks/iam';

export type ManagerButtonProps = PropsWithChildren<{
  id: string;
  iamActions?: string[];
  urn?: string;
  displayTooltip?: boolean;
  isIamTrigger?: boolean;
  label: string;
}>;

export const ManagerButton = ({
  id,
  children,
  label,
  iamActions,
  urn,
  displayTooltip = true,
  isIamTrigger = true,
  ...restProps
}: ManagerButtonProps &
  Partial<
    JSX.OdsButton &
      Omit<HTMLAttributes<HTMLOdsButtonElement>, 'style' | 'id'> &
      StyleReactProps &
      RefAttributes<HTMLOdsButtonElement>
  >) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn, isIamTrigger);

  if (isAuthorized) {
    return (
      <OdsButton data-testid="manager-button" {...restProps} label={label} />
    );
  }
  return displayTooltip ? (
    <>
      <div id={id} className="w-fit">
        <OdsButton
          data-testid="manager-button-tooltip"
          {...restProps}
          isDisabled={true}
          label={label}
          onClick={null}
        />
      </div>
      <OdsTooltip triggerId={id} with-arrow>
        <div>{t('common_iam_actions_message')}</div>
      </OdsTooltip>
    </>
  ) : (
    <OdsButton
      data-testid="manager-button-without-tooltip"
      {...restProps}
      isDisabled={true}
      onClick={null}
      label={label}
    />
  );
};

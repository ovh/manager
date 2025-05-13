import React, { PropsWithChildren, RefAttributes, HTMLAttributes } from 'react';
import { JSX } from '@ovhcloud/ods-components';
import { OdsText, OdsTooltip } from '@ovhcloud/ods-components/react';
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
    JSX.OdsText &
      Omit<HTMLAttributes<HTMLOdsTextElement>, 'style'> &
      StyleReactProps &
      RefAttributes<HTMLOdsTextElement>
  >) => {
  const { t } = useTranslation('iam');
  const { isAuthorized } = useAuthorizationIam(iamActions, urn);

  if (!isAuthorized) {
    return (
      <>
        <div id="tooltip-iam" className="w-fit">
          <OdsText preset="span" {...restProps}>
            {t('iam_hidden_text').toUpperCase()}
          </OdsText>
        </div>
        <OdsTooltip triggerId="tooltip-iam" with-arrow>
          <div>{t('common_iam_get_message')}</div>
        </OdsTooltip>
      </>
    );
  }
  return <OdsText {...restProps}>{children}</OdsText>;
};

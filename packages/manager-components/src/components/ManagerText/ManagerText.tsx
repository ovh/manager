import React, { PropsWithChildren } from 'react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import './translations';

import { useIsAuthorized } from '../../hooks/iam';

export type ManagerTextProps = PropsWithChildren<{
  isIamAuthorized?: boolean;
  action?: string;
  urn?: string;
}>;

export const ManagerText = ({
  children,
  action,
  urn,
  ...restProps
}: ManagerTextProps) => {
  const { t } = useTranslation('iam');
  const isAuthorized = useIsAuthorized(action, urn);
  if (!isAuthorized) {
    return (
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.error}
        size={ODS_TEXT_SIZE._300}
        {...restProps}
      >
        {t('common_iam_get_message')}
      </OsdsText>
    );
  }
  return <OsdsText {...restProps}>{children}</OsdsText>;
};

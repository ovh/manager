import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsClipboardAttribute } from '@ovhcloud/ods-components';
import { OsdsClipboard, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './translations';

interface IClipboardAttibutes extends OdsClipboardAttribute {
  'data-testid': string;
}

export const Clipboard: React.FC<IClipboardAttibutes> = ({
  'data-testid': testId = 'clipboard',
  ...props
}) => {
  const { t } = useTranslation('clipboard');

  return (
    <OsdsClipboard {...props} data-testid={testId}>
      <span slot="success-message">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.success}
          data-testid={`${testId}-success`}
        >
          {t('clipboard_copy_success')}
        </OsdsText>
      </span>
      <span slot="error-message">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.error}
          data-testid={`${testId}-error`}
        >
          {t('clipboard_copy_error')}
        </OsdsText>
      </span>
    </OsdsClipboard>
  );
};

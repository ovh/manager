import { OsdsClipboard } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export default function Key({ publicKey }: { publicKey: string }) {
  const { t } = useTranslation();

  return (
    <OsdsClipboard
      value={publicKey}
      color={ODS_THEME_COLOR_INTENT.primary}
      data-testid="Key-clipboard"
      className="mr-8"
    >
      <span slot="success-message">{t('common_clipboard_copied')}</span>
      <span slot="error-message">Error</span>
    </OsdsClipboard>
  );
}

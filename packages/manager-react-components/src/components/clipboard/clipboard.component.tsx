import { OdsClipboard as OdsClipboardAttribute } from '@ovhcloud/ods-components';
import { OdsClipboard } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './translations';

export const Clipboard: React.FC<Partial<OdsClipboardAttribute>> = (props) => {
  const { t } = useTranslation('clipboard');

  return (
    <OdsClipboard
      {...props}
      data-testid="clipboard"
      labelCopySuccess={t('clipboard_copy_success')}
      labelCopy={t('clipboard_copy')}
    />
  );
};

import { JSX } from '@ovhcloud/ods-components';
import { OdsClipboard } from '@ovhcloud/ods-components/react';
import React, { HTMLAttributes, RefAttributes } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleReactProps } from '@ovhcloud/ods-components/react/dist/types/react-component-lib/interfaces';
import './translations';

export const Clipboard: React.FC<
  Partial<
    JSX.OdsClipboard &
      HTMLAttributes<HTMLOdsClipboardElement> &
      StyleReactProps &
      RefAttributes<HTMLOdsClipboardElement>
  >
> = (props) => {
  const { t } = useTranslation('clipboard');

  return (
    <OdsClipboard
      data-testid="clipboard"
      labelCopySuccess={t('clipboard_copy_success')}
      labelCopy={t('clipboard_copy')}
      {...props}
    />
  );
};

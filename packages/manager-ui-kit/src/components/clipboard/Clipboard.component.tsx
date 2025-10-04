import {
  Clipboard as OdsClipboard,
  ClipboardControl,
  ClipboardTrigger,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import './translations';
import { ClipboardProps } from './Clipboard.props';

export const Clipboard = ({
  loading = false,
  masked = false,
  ...others
}: ClipboardProps) => {
  const { t } = useTranslation('clipboard');

  return (
    <OdsClipboard data-testid="clipboard" {...others}>
      <ClipboardControl
        loading={loading}
        maskOption={{
          enable: masked,
        }}
      />
      <ClipboardTrigger
        labelCopy={t('clipboard_copy')}
        labelCopySuccess={t('clipboard_copy_success')}
      />
    </OdsClipboard>
  );
};

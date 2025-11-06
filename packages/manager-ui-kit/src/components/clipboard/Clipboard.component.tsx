import { useTranslation } from 'react-i18next';

import { ClipboardControl, ClipboardTrigger, Clipboard as OdsClipboard } from '@ovhcloud/ods-react';

import { ClipboardProps } from '@/components/clipboard/Clipboard.props';

import './translations';

export const Clipboard = ({ loading = false, masked = false, ...others }: ClipboardProps) => {
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

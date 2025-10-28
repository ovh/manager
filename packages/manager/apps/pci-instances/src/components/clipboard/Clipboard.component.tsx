import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Clipboard as OdsClipboard,
  ClipboardControl,
  ClipboardTrigger,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

type TClipboardProps = {
  value: string;
  buttonSize?: BUTTON_SIZE;
  buttonVariant?: BUTTON_VARIANT;
};

export const Clipboard: FC<TClipboardProps> = ({
  value,
  buttonSize = BUTTON_SIZE.xs,
  buttonVariant = BUTTON_VARIANT.ghost,
}) => {
  const { t } = useTranslation(NAMESPACES.CLIPBOARD);
  return (
    <OdsClipboard className="flex-grow" value={value}>
      <ClipboardControl className="w-full" />
      <ClipboardTrigger
        labelCopy={t('clipboard_copy')}
        labelCopySuccess={t('clipboard_copy_success')}
      >
        <Button size={buttonSize} variant={buttonVariant}>
          <Icon name={ICON_NAME.fileCopy} className="text-base/3" />
        </Button>
      </ClipboardTrigger>
    </OdsClipboard>
  );
};

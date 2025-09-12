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

type TClipboardProps = {
  value: string;
  buttonSize?: BUTTON_SIZE;
  buttonVariant?: BUTTON_VARIANT;
};

export const Clipboard: FC<TClipboardProps> = ({
  value,
  buttonSize = BUTTON_SIZE.xs,
  buttonVariant = BUTTON_VARIANT.ghost,
}) => (
  <OdsClipboard className="flex-grow" value={value}>
    <ClipboardControl className="w-full" />
    <ClipboardTrigger>
      <Button size={buttonSize} variant={buttonVariant}>
        <Icon name={ICON_NAME.fileCopy} className="text-base/3" />
      </Button>
    </ClipboardTrigger>
  </OdsClipboard>
);

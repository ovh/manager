import {
  Button,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Clipboard,
  ClipboardControl,
  ClipboardTrigger,
  Icon,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { FC } from 'react';

type DashboardClipboardProps = {
  value: string | undefined;
};

export const DashboardClipboard: FC<DashboardClipboardProps> = ({ value }) => (
  <Clipboard className="flex-grow" value={value || ''}>
    <ClipboardControl className="w-full" />
    <ClipboardTrigger>
      <Button size={BUTTON_SIZE.xs} variant={BUTTON_VARIANT.ghost}>
        <Icon name={ICON_NAME.fileCopy} className="text-base/3" />
      </Button>
    </ClipboardTrigger>
  </Clipboard>
);

import { ClipboardProp } from '@ovhcloud/ods-react';

export type ClipboardProps = ClipboardProp & {
  loading?: boolean;
  masked?: boolean;
};

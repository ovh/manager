import { SpinnerColor, SpinnerSize } from '@ovhcloud/ods-react';

export interface LoaderProps {
  message?: string;
  details?: string;
  size?: SpinnerSize;
  color?: SpinnerColor;
}

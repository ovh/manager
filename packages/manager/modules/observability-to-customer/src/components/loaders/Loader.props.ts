import { SPINNER_COLOR, SPINNER_SIZE } from '@ovh-ux/muk';

export interface LoaderProps {
  message?: string;
  details?: string;
  size?: SPINNER_SIZE;
  color?: SPINNER_COLOR;
}

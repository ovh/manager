import { OdsInputChangeEvent } from '@ovhcloud/ods-components';

type InputBaseChangeProps = {
  e: OdsInputChangeEvent;
};
type InputChangeWithoutValidationProps = InputBaseChangeProps & {
  isValid?: never;
  error?: never;
};
type InputChangeWithValidationProps = InputBaseChangeProps & {
  isValid: boolean;
  error: string;
};

export type HandleInputChangeProps =
  | InputChangeWithoutValidationProps
  | InputChangeWithValidationProps;

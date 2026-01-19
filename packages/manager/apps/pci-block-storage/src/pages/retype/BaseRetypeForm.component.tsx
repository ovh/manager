import { FC, FormEventHandler, PropsWithChildren } from 'react';
import {
  Button,
  BUTTON_VARIANT,
  Spinner,
  SPINNER_COLOR,
  SPINNER_SIZE,
} from '@ovhcloud/ods-react';

type BaseFormComponentProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
  isValidationDisabled?: boolean;
  cancelButtonText: string;
  validateButtonText: string;
  isLoading?: boolean;
};

export const BaseRetypeForm: FC<PropsWithChildren<BaseFormComponentProps>> = ({
  onSubmit,
  onClose,
  isValidationDisabled = false,
  cancelButtonText,
  validateButtonText,
  isLoading = false,
  children,
}) => (
  <form onSubmit={onSubmit} className="h-full flex flex-col">
    {children}
    <div className="flex gap-8 mt-auto">
      <Button
        variant={BUTTON_VARIANT.ghost}
        onClick={onClose}
        disabled={isLoading}
        type="button"
      >
        {cancelButtonText}
      </Button>
      <Button disabled={isValidationDisabled || isLoading} type="submit">
        {validateButtonText}
        {isLoading && (
          <Spinner color={SPINNER_COLOR.neutral} size={SPINNER_SIZE.sm} />
        )}
      </Button>
    </div>
  </form>
);

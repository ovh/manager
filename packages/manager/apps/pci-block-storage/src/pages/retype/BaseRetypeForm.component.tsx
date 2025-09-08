import { FC, FormEventHandler, PropsWithChildren } from 'react';
import { Button, BUTTON_VARIANT } from '@ovhcloud/ods-react';

type BaseFormComponentProps = {
  onSubmit: FormEventHandler<HTMLFormElement>;
  onClose: () => void;
  isValidationDisabled: boolean;
  cancelButtonText: string;
  validateButtonText: string;
};

export const BaseRetypeForm: FC<PropsWithChildren<BaseFormComponentProps>> = ({
  onSubmit,
  onClose,
  isValidationDisabled,
  cancelButtonText,
  validateButtonText,
  children,
}) => (
  <form onSubmit={onSubmit} className="h-full flex flex-col">
    {children}
    <div className="flex gap-8 mt-auto">
      <Button variant={BUTTON_VARIANT.ghost} onClick={onClose} type="button">
        {cancelButtonText}
      </Button>
      <Button disabled={isValidationDisabled} type="submit">
        {validateButtonText}
      </Button>
    </div>
  </form>
);

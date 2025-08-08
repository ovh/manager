import { FC } from 'react';
import { Button, Icon, Input, InputProp } from '@ovhcloud/ods-react';
import { clsx } from 'clsx';

type TInputCancellableProps = {
  onCancel?: () => void;
  onSubmit?: () => void;
} & InputProp;

export const InputCancellable: FC<TInputCancellableProps> = ({
  onCancel: onClear,
  onSubmit,
  className,
  ...props
}) => (
  <form className="flex items-center">
    <Input className={clsx('mr-4', className)} {...props} />
    <Button aria-label="Cancel" variant="ghost" size="sm" onClick={onClear}>
      <Icon name="xmark" />
    </Button>
    <Button aria-label="Submit" variant="ghost" size="sm" onClick={onSubmit}>
      <Icon name="check" className="text-xl" />
    </Button>
  </form>
);

export default InputCancellable;

import { FC, FormEvent } from 'react';
import { Button, Icon, Input, InputProp } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
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
}) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <Input className={clsx('mr-4', className)} {...props} />
      <Button
        aria-label={t('cancel')}
        variant="ghost"
        size="sm"
        onClick={onClear}
      >
        <Icon name="xmark" />
      </Button>
      <Button
        aria-label={t('validate')}
        variant="ghost"
        size="sm"
        type="submit"
      >
        <Icon name="check" className="text-xl" />
      </Button>
    </form>
  );
};

export default InputCancellable;

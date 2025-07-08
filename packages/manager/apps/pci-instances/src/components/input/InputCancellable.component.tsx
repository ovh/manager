import { DetailedHTMLProps, InputHTMLAttributes, FC } from 'react';
import { Input as DatatrInput } from '@datatr-ux/uxlib';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { clsx } from 'clsx';

type TInputCancellableProps = {
  onClear?: () => void;
  onSubmit?: () => void;
  isValid?: boolean;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
>;

export const InputCancellable: FC<TInputCancellableProps> = ({
  onClear,
  onSubmit,
  isValid = true,
  className,
  ...props
}) => (
  <form className="flex">
    <DatatrInput
      className={clsx(
        'focus-visible:ring-transparent focus-visible:bg-primary-300 text-[var(--ods-typography-heading-500-font-size)]',
        className,
      )}
      {...props}
    />
    <div className="flex">
      <OsdsButton
        aria-label="Cancel"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        onClick={onClear}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.CLOSE}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
      <OsdsButton
        aria-label="Submit"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        {...(!isValid && { disabled: true })}
        onClick={onSubmit}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.CHECK}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
    </div>
  </form>
);

export default InputCancellable;

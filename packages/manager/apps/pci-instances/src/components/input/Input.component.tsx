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

type InputProps = {
  handleClear?: () => void;
  handleValidate?: () => void;
  isValid?: boolean;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'ref'
>;

export const Input: FC<InputProps> = ({
  handleClear,
  handleValidate,
  isValid = true,
  className,
  ...props
}) => (
  <div className="flex">
    <DatatrInput
      autoFocus
      className={clsx(
        'focus-visible:ring-transparent focus-visible:bg-primary-300 text-primary-100',
        className,
      )}
      {...props}
    />
    <div className="flex">
      <OsdsButton
        data-testid="cancel-change"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        onClick={handleClear}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.CLOSE}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
      <OsdsButton
        data-testid="validate-change"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        size={ODS_BUTTON_SIZE.sm}
        {...(!isValid && { disabled: true })}
        onClick={handleValidate}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.CHECK}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
    </div>
  </div>
);

export default Input;

import React from 'react';
import {
  OsdsInput,
  OsdsButton,
  OsdsIcon,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { handleClick } from '../../../utils/click-utils';

export type EditableTextProps = React.PropsWithChildren<{
  type?: ODS_INPUT_TYPE;
  disabled?: boolean;
  defaultValue: string;
  emptyValueLabel?: string;
  onEditSubmitted: (newValue: string) => Promise<void>;
}>;

export type EditStatus = 'display' | 'editing' | 'loading';

export const EditableText: React.FC<EditableTextProps> = ({
  children,
  emptyValueLabel = '',
  defaultValue,
  disabled,
  type = ODS_INPUT_TYPE.text,
  onEditSubmitted,
}) => {
  const [editStatus, setEditStatus] = React.useState<EditStatus>('display');
  const [value, setValue] = React.useState(defaultValue);
  const submitButton = React.useRef<HTMLOsdsButtonElement>();
  const input = React.useRef<HTMLOsdsInputElement>();

  React.useEffect(() => {
    if (editStatus === 'editing') {
      setTimeout(() => {
        input.current?.setFocus();
      });
    }
  }, [editStatus]);

  if (['editing', 'loading'].includes(editStatus)) {
    return (
      <form
        className="flex"
        onSubmit={async (event) => {
          event.preventDefault();
          setEditStatus('loading');
          try {
            await onEditSubmitted(value);
          } finally {
            setEditStatus('display');
          }
        }}
      >
        <OsdsInput
          ref={input}
          inline
          size={ODS_INPUT_SIZE.md}
          type={type}
          value={value}
          loading={editStatus === 'loading' || undefined}
          disabled={editStatus === 'loading' || undefined}
          onKeyDown={(event: React.KeyboardEvent) => {
            if (event.key === 'Enter') {
              submitButton.current.click();
            }
          }}
          onOdsValueChange={(e: OdsInputValueChangeEvent) => {
            setValue(e.detail.value);
          }}
        />
        <OsdsButton
          ref={submitButton}
          className="ml-2"
          inline
          color={ODS_THEME_COLOR_INTENT.success}
          variant={ODS_BUTTON_VARIANT.stroked}
          type={ODS_BUTTON_TYPE.submit}
          size={ODS_BUTTON_SIZE.sm}
          disabled={editStatus === 'loading' || undefined}
        >
          <OsdsIcon
            color={ODS_THEME_COLOR_INTENT.success}
            name={ODS_ICON_NAME.CHECK}
            size={ODS_ICON_SIZE.xs}
          />
        </OsdsButton>
      </form>
    );
  }

  return (
    <span className="inline-flex items-center">
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={children ? ODS_TEXT_SIZE._800 : ODS_TEXT_SIZE._300}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {children ?? emptyValueLabel}
      </OsdsText>
      <OsdsButton
        className="ml-2"
        inline
        circle
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        {...handleClick(() => {
          setEditStatus('editing');
        })}
        disabled={disabled || undefined}
      >
        <OsdsIcon
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
    </span>
  );
};

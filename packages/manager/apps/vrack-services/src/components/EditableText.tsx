import React from 'react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import { OsdsButton } from '@ovhcloud/ods-components/button/react';
import { OsdsInput } from '@ovhcloud/ods-components/input/react';
import {
  ODS_INPUT_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components/input';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components/button';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';

export type EditableTextProps = React.PropsWithChildren<{
  type?: ODS_INPUT_TYPE;
  disabled?: boolean;
  defaultValue: string;
  onEditSubmitted: (newValue: string) => Promise<void>;
}>;

export type EditStatus = 'display' | 'editing' | 'loading';

export const EditableText: React.FC<EditableTextProps> = ({
  children,
  defaultValue,
  disabled,
  type = ODS_INPUT_TYPE.text,
  onEditSubmitted,
}) => {
  const [editStatus, setEditStatus] = React.useState('display' as EditStatus);
  const [value, setValue] = React.useState(defaultValue);
  const submitButton = React.useRef<HTMLButtonElement>();
  const input = React.useRef<any>();

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
        onSubmit={async (event) => {
          event.preventDefault();
          setEditStatus('loading');
          await onEditSubmitted(value);
          setEditStatus('display');
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
    <>
      {children}
      <OsdsButton
        className="ml-2"
        inline
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        onClick={() => setEditStatus('editing')}
        onKeyDown={(event: React.KeyboardEvent) => {
          if ([' ', 'Enter'].includes(event.key)) {
            setEditStatus('editing');
          }
        }}
        disabled={disabled || undefined}
      >
        <OsdsIcon
          color={ODS_THEME_COLOR_INTENT.primary}
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xs}
        />
      </OsdsButton>
    </>
  );
};

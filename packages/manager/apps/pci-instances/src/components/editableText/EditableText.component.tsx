import { FC, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import InputCancellable from '../inputCancellable/InputCancellable.component';

const EditableText: FC<{
  defaultValue: string;
  handleValidate: (value: string) => void;
}> = ({ defaultValue, handleValidate }) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [text, setText] = useState(defaultValue);

  const closeEdit = () => setEditing(false);

  const onCancel = () => {
    setText(defaultValue);
    closeEdit();
  };

  const onValidate = () => {
    handleValidate(text);
    closeEdit();
  };

  return (
    <>
      {isEditing ? (
        <InputCancellable
          value={text}
          className="text-[var(--ods-typography-heading-500-font-size)]"
          onChange={(e) => setText(e.target.value)}
          handleClear={onCancel}
          handleValidate={onValidate}
        />
      ) : (
        <div className="flex">
          {defaultValue}
          <OsdsButton
            data-testid="edit-btn"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => setEditing(true)}
          >
            <OsdsIcon
              name={ODS_ICON_NAME.PEN}
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_ICON_SIZE.xs}
            />
          </OsdsButton>
        </div>
      )}
    </>
  );
};

export default EditableText;

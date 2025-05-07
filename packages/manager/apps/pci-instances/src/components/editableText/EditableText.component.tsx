import { FC, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import Input from '../input/Input.component';

const EditableText: FC<{
  value: string;
  handleValidate: (value: string) => void;
}> = ({ value, handleValidate }) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [text, setText] = useState(value);

  const closeEdit = () => {
    setEditMode(false);
  };

  const onCancel = () => {
    setText(value);
    closeEdit();
  };

  const onValidate = () => {
    handleValidate(text);
    closeEdit();
  };

  return (
    <>
      {editMode ? (
        <Input
          value={text}
          className="text-[var(--ods-typography-heading-500-font-size)]"
          onChange={(e) => setText(e.target.value)}
          handleClear={onCancel}
          handleValidate={onValidate}
        />
      ) : (
        <div className="flex">
          {value}
          <OsdsButton
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_THEME_COLOR_INTENT.primary}
            size={ODS_BUTTON_SIZE.sm}
            onClick={() => setEditMode(true)}
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

import { FC, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import InputCancellable from '../InputCancellable.component';

const EditableContent: FC<{
  defaultValue: string;
  onSubmit: (value: string) => void | Promise<void>;
}> = ({ defaultValue, onSubmit }) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [text, setText] = useState(defaultValue);

  const closeEdit = () => setEditing(false);

  const handleCancel = () => {
    setText(defaultValue);
    closeEdit();
  };

  const handleSubmit = async () => {
    await onSubmit(text);
    closeEdit();
  };

  return (
    <>
      {isEditing ? (
        <InputCancellable
          value={text}
          autoFocus
          className="text-[var(--ods-typography-heading-500-font-size)]"
          onChange={(e) => setText(e.target.value)}
          onClear={handleCancel}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="flex">
          {text}
          <OsdsButton
            aria-label="Edit"
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

export default EditableContent;

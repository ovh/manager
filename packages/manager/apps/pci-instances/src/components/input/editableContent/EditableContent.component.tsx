import { AriaAttributes, FC, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import InputCancellable from '../InputCancellable.component';

type TEditableContentProps = {
  defaultValue: string;
  onSubmit: (value: string) => void;
} & AriaAttributes;

const EditableContent: FC<TEditableContentProps> = ({
  defaultValue,
  onSubmit,
  ...props
}) => {
  const [isEditing, setEditing] = useState<boolean>(false);
  const [text, setText] = useState(defaultValue);

  const closeEdit = () => setEditing(false);

  const handleCancel = () => {
    setText(defaultValue);
    closeEdit();
  };

  const handleSubmit = () => {
    onSubmit(text);
    closeEdit();
  };

  return (
    <>
      {isEditing ? (
        <InputCancellable
          value={text}
          onChange={(e) => setText(e.target.value)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          {...props}
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

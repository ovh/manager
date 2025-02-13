import { memo } from 'react';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
} from '@ovhcloud/ods-components/react';

const Checkboxes = ({
  ipBlock,
  updateChecked,
  checked,
}: {
  updateChecked: (ipBlock: string, allIsSelected?: boolean) => void;
  ipBlock: string;
  checked: boolean;
}) => (
  <div className="flex justify-center items-center mt-2 position-relative">
    <OsdsCheckbox
      onOdsCheckedChange={() => updateChecked(ipBlock)}
      color="primary"
      checked={checked}
    >
      <OsdsCheckboxButton
        color={ODS_TEXT_COLOR_INTENT.primary}
        size={ODS_CHECKBOX_BUTTON_SIZE.sm}
      />
    </OsdsCheckbox>
  </div>
);

export default memo(Checkboxes);

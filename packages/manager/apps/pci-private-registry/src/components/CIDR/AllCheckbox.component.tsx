import { memo } from 'react';
import {
  ODS_CHECKBOX_BUTTON_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  OsdsCheckbox,
  OsdsCheckboxButton,
} from '@ovhcloud/ods-components/react';

const AllCheckBox = ({
  updateChecked,
  isAllDataSelected,
}: {
  updateChecked: (ipBlock: string | null, allIsSelected?: boolean) => void;
  isAllDataSelected: boolean;
}) => (
  <div className="flex justify-center items-center mt-2 relative">
    <OsdsCheckbox
      onOdsCheckedChange={() => updateChecked(null, true)}
      color="primary"
      checked={isAllDataSelected || undefined}
    >
      <OsdsCheckboxButton
        className="absolute top-1/2 left-1/2 -translate-x-1/2 "
        color={ODS_TEXT_COLOR_INTENT.primary}
        size={ODS_CHECKBOX_BUTTON_SIZE.sm}
      />
    </OsdsCheckbox>
  </div>
);

export default memo(AllCheckBox);

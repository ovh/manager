import clsx from 'clsx';
import {
  OdsText,
  OdsFormField,
  OdsCheckbox,
  OdsIcon,
  OdsTooltip,
} from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';

import { IamPolicy } from '@/data/api/iam-policies';

export const ServiceAccountsPolicyTile = ({
  policy,
  selected,
  setSelected,
}: {
  policy: IamPolicy;
  selected: boolean;
  setSelected: (policy: IamPolicy, selected: boolean) => void;
}) => {
  const checkboxId = `policy-checkbox_${policy.id}`;
  const triggerId = `policy-tooltip-trigger_${policy.id}`;

  return (
    <OdsFormField
      className={clsx('policy-tile m-4 p-4', selected ? 'selected' : '')}
    >
      <div className="flex flex-row gap-4 justify-start items-center">
        <OdsCheckbox
          inputId={checkboxId}
          name={checkboxId}
          isChecked={selected}
          onOdsChange={(e) => setSelected(policy, e.detail.checked)}
        />
        <label
          className="flex flex-row flex-grow-1 items-center w-full justify-between"
          htmlFor={checkboxId}
        >
          <p className="policy-name overflow-hidden text-ellipsis flex-grow-1 my-0">
            <strong>{policy.name}</strong>
          </p>
          <OdsIcon name={ODS_ICON_NAME.circleInfo} id={triggerId} />
          <OdsTooltip triggerId={triggerId}>
            <div className="flex flex-col">
              <OdsText>{policy.name}</OdsText>
              <OdsText>{policy.description}</OdsText>
            </div>
          </OdsTooltip>
        </label>
      </div>
    </OdsFormField>
  );
};

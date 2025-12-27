import { Dispatch, ReactNode, SetStateAction } from 'react';

import clsx from 'clsx';

import { ODS_CARD_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsCard, OdsText } from '@ovhcloud/ods-components/react';

type IdentitiesBaseTileProps = {
  title: string;
  updateCallback: (isSelected: boolean) => void;
  isChecked: boolean;
  setIsChecked: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
};

const IdentitiesBaseTile = ({
  title,
  updateCallback,
  isChecked,
  setIsChecked,
  children,
}: IdentitiesBaseTileProps) => (
  <OdsCard
    className={clsx(
      'cursor-pointer p-3',
      !isChecked && 'border-[--ods-color-form-element-border-default]',
      !isChecked && 'hover:border-[--ods-color-form-element-border-hover-default]',
      isChecked && 'border-[--ods-color-primary-500] bg-[--ods-color-primary-050]',
    )}
    color={isChecked ? ODS_CARD_COLOR.primary : ODS_CARD_COLOR.neutral}
    onClick={() => {
      setIsChecked(!isChecked);
      updateCallback(!isChecked);
    }}
  >
    <OdsText preset={ODS_TEXT_PRESET.heading5}>{title}</OdsText>
    <div className="grid gap-1">{children}</div>
  </OdsCard>
);

export default IdentitiesBaseTile;

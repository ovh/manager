import { Dispatch, ReactNode, SetStateAction } from 'react';

import clsx from 'clsx';

import { ODS_CARD_COLOR } from '@ovhcloud/ods-components';
import { Card, Text } from '@ovhcloud/ods-react';

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
  <Card
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
    <Text preset="heading-5" className="mb-2">
      {title}
    </Text>
    {children}
  </Card>
);

export default IdentitiesBaseTile;

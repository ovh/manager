import { PropsWithChildren } from 'react';

import clsx from 'clsx';

import { Card, Text } from '@ovhcloud/ods-react';

type IdentitiesBaseTileProps = PropsWithChildren<{
  title: string;
  onToggle: () => void;
  isSelected: boolean;
  testId: string;
}>;

export const IdentitiesBaseTile = ({
  title,
  onToggle,
  isSelected,
  children,
  testId,
}: IdentitiesBaseTileProps) => (
  <Card
    className={clsx(
      'cursor-pointer p-3',
      !isSelected && 'border-[--ods-color-form-element-border-default]',
      !isSelected && 'hover:border-[--ods-color-form-element-border-hover-default]',
      isSelected && 'border-[--ods-color-primary-500] bg-[--ods-color-primary-050]',
    )}
    color={isSelected ? 'primary' : 'neutral'}
    onClick={onToggle}
    data-testid={testId}
  >
    <Text preset="heading-5" className="mb-2">
      {title}
    </Text>
    {children}
  </Card>
);

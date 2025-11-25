import { clsx } from 'clsx';

import { Card, Text } from '@ovhcloud/ods-react';

interface PciTileProps {
  title: string;
  description?: string;
  isChecked?: boolean;
  onClick?: () => void;
  className?: string;
}

const checkedClass =
  'cursor-pointer font-bold bg-[--ods-color-blue-100] border-[--ods-color-blue-600]';
const uncheckedClass =
  'cursor-pointer border-[--ods-color-blue-100] hover:bg-[--ods-color-blue-050] hover:border-[--ods-color-blue-300]';

export function PciTile({
  title,
  description,
  isChecked,
  onClick,
  className,
}: Readonly<PciTileProps>) {
  return (
    <Card
      className={clsx(
        'p-6 overflow-x-hidden border-2',
        isChecked ? checkedClass : uncheckedClass,
        className,
      )}
      data-testid="pciTile-Tile"
      onClick={() => onClick?.()}
    >
      <div className="flex flex-col gap-4">
        <Text className="font-bold">{title}</Text>
        {description && <Text>{description}</Text>}
      </div>
    </Card>
  );
}

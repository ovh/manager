import { Card, Radio, RadioControl, RadioLabel } from '@ovhcloud/ods-react';
import clsx from 'clsx';

type VatTileProps = {
  vatId?: string;
  selected?: boolean;
  onClick?: () => void;
};

export default function VatTile({ vatId, selected, onClick }: VatTileProps) {
  return (
    <Card
      className={clsx(
        'w-full cursor-pointer p-4',
        selected && 'bg-[var(--ods-color-primary-100)]',
        !selected && 'border-[var(--ods-theme-input-border-color)]',
      )}
      onClick={() => onClick?.()}
    >
      <Radio value={vatId || ''} onChange={onClick} defaultChecked={!vatId}>
        <RadioControl />
        <RadioLabel>{vatId}</RadioLabel>
      </Radio>
    </Card>
  );
}

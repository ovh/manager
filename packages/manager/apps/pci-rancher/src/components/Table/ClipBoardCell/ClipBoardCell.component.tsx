import React from 'react';
import { Clipboard, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '@/types/api.type';

interface ClipBoardCellProps {
  readonly cell: Cell<RancherService, unknown>;
}

const ClipBoardCell = ({ cell }: ClipBoardCellProps) => {
  const id = cell.renderValue<RancherService['id']>();

  return (
    <DataGridTextCell>
      <Clipboard aria-label="clipboard" value={id} />
    </DataGridTextCell>
  );
};

export default ClipBoardCell;

import React from 'react';
import { Clipboard, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { Cell } from '@tanstack/react-table';
import './Table.scss';
import { RancherService } from '@/types/api.type';

interface DataGridCellInterface {
  readonly cell: Cell<RancherService, unknown>;
}

const DataGridCell = ({ cell }: DataGridCellInterface) => {
  const id = cell.renderValue() as RancherService['id'];

  return (
    <DataGridTextCell>
      <Clipboard aria-label="clipboard" value={id} />
    </DataGridTextCell>
  );
};

export default DataGridCell;

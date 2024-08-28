import React from 'react';
import { Clipboard, DataGridTextCell } from '@ovhcloud/manager-components';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '@/api/api.type';
import './Table.scss';

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

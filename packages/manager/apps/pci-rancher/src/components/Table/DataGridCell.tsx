import React from 'react';
import { Clipboard, DataGridTextCell } from '@ovhcloud/manager-components';
import { Cell } from '@tanstack/react-table';
import { RancherService } from '../../api/api.type';
import './Table.scss';

interface DisplayCellInterface {
  cell: Cell<RancherService, unknown>;
}

const ClipboardInput = ({ cell }: Readonly<DisplayCellInterface>) => {
  const id = cell.renderValue() as RancherService['id'];

  return (
    <DataGridTextCell>
      <Clipboard aria-label="clipboard" value={id} />
    </DataGridTextCell>
  );
};

export default ClipboardInput;

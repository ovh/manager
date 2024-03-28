/* eslint-disable import/prefer-default-export */
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

export type DataGridCellProps<Cell = string, Row = any> = {
  cellData?: Cell;
  rowData?: Row;
};

export const reactFormatter = (jsx: any) => (
  cellData: any,
  rowData: any,
  cell: any,
  onRendered: any,
): string => {
  let isFirstRender = true;
  let root: Root = null;

  const renderFn = () => {
    const cellEl = cell.getElement();
    if (cellEl) {
      const formatterCell = cellEl.querySelector('.formatterCell');

      if (formatterCell) {
        if (isFirstRender) {
          root = createRoot(formatterCell);
          isFirstRender = false;
        }
        const CompWithMoreProps = React.cloneElement(jsx, {
          cellData,
          rowData,
        });
        root.render(CompWithMoreProps);
      }
    }
  };

  onRendered(renderFn);

  setTimeout(() => {
    renderFn();
  }, 0);
  return '<div class="formatterCell"></div>';
};

export const handleClick = (
  fn: React.KeyboardEventHandler & React.MouseEventHandler,
) => ({
  onClick: fn,
  onKeyDown: (event: React.KeyboardEvent) => {
    if ([' ', 'Enter'].includes(event.key)) {
      fn(event as React.KeyboardEvent & React.MouseEvent);
    }
  },
});

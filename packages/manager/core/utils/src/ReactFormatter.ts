import React, { ReactElement } from 'react';

import { render } from 'react-dom';

interface CellLike {
  getElement(): HTMLElement | null;
}

type OnRendered = (callback: () => void) => void;

export function ReactFormatter<T = unknown>(jsxElement: ReactElement) {
  return function CustomFormatter(
    cellData: T,
    rowData: T,
    cell: CellLike,
    onRendered: OnRendered,
  ): string {
    const renderFn = () => {
      const cellEl = cell.getElement();
      if (cellEl) {
        const formatterCell = cellEl.querySelector<HTMLDivElement>('.formatterCell');
        if (formatterCell) {
          const CompWithMoreProps = React.cloneElement(jsxElement, {
            cellData,
            rowData,
          });
          render(CompWithMoreProps, formatterCell);
        }
      }
    };

    onRendered(renderFn); // initial render only.
    setTimeout(() => {
      renderFn(); // render every time cell value changed.
    }, 0);

    return '<div class="formatterCell"></div>';
  };
}

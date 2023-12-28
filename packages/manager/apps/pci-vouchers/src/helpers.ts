// eslint-disable-next-line @typescript-eslint/naming-convention
import React from 'react';
import { render } from 'react-dom';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function reactFormatter(JSX: JSX.Element) {
  return function customFormatter(cellData, rowData, cell, onRendered) {
    const renderFn = () => {
      const cellEl = cell.getElement();
      if (cellEl) {
        const formatterCell = cellEl.querySelector('.formatterCell');
        if (formatterCell) {
          const CompWithMoreProps = React.cloneElement(JSX, {
            cellData,
            rowData,
          });
          render(CompWithMoreProps, cellEl.querySelector('.formatterCell'));
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

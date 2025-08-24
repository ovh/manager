import React from 'react';

import { render } from 'react-dom';

export function ReactFormatter(jsxElement: any) {
  return function CustomFormatter(cellData: any, rowData: any, cell: any, onRendered: any) {
    const renderFn = () => {
      const cellEl = cell.getElement();
      if (cellEl) {
        const formatterCell = cellEl.querySelector('.formatterCell');
        if (formatterCell) {
          const CompWithMoreProps = React.cloneElement(jsxElement, {
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

export default ReactFormatter;

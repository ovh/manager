import React from 'react';
import { TMessageLevel } from '../../../../../data/api/logTailMessages';
import { HighlightSearch } from '../highligthSearch/HighlightSearch.component';

export const LogLevel = ({ level }: { level: TMessageLevel }) => {
  let label: string;
  let colorClass: string;

  switch (level) {
    case 0:
      label = 'EMERG';
      colorClass = 'text-red-400';
      break;
    case 1:
      label = 'ALERT';
      colorClass = 'text-red-400';
      break;
    case 2:
      label = 'CRIT';
      colorClass = 'text-red-400';
      break;
    case 3:
      label = 'ERROR';
      colorClass = 'text-red-400';
      break;
    case 4:
      label = 'WARN';
      colorClass = 'text-orange-300';
      break;
    case 5:
      label = 'NOTICE';
      colorClass = 'text-blue-400';
      break;
    case 6:
      label = 'INFO';
      colorClass = 'text-blue-400';
      break;
    case 7:
      label = 'DEBUG';
      colorClass = 'text-blue-400';
      break;

    default:
      break;
  }

  return (
    <span className={colorClass} data-testid="logTail-level">
      <HighlightSearch text={label} />
    </span>
  );
};

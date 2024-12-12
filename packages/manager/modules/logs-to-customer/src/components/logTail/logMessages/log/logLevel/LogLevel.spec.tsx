import React from 'react';
import { render } from '@testing-library/react';
import { TMessageLevel } from '../../../../../data/api/logTailMessages';
import { LogLevel } from './LogLevel.component';

type TtestCases = {
  level: TMessageLevel;
  label: string;
  colorClass: string;
};

const testCases: TtestCases[] = [
  {
    level: 0,
    label: 'EMERG',
    colorClass: 'text-red-400',
  },
  {
    level: 1,
    label: 'ALERT',
    colorClass: 'text-red-400',
  },
  {
    level: 2,
    label: 'CRIT',
    colorClass: 'text-red-400',
  },
  {
    level: 3,
    label: 'ERROR',
    colorClass: 'text-red-400',
  },
  {
    level: 4,
    label: 'WARN',
    colorClass: 'text-orange-300',
  },
  {
    level: 5,
    label: 'NOTICE',
    colorClass: 'text-blue-400',
  },
  {
    level: 6,
    label: 'INFO',
    colorClass: 'text-blue-400',
  },
  {
    level: 7,
    label: 'DEBUG',
    colorClass: 'text-blue-400',
  },
];

describe('LogLevel test suite', () => {
  test.each(testCases)(
    'should render correct configuration for level: $level',
    async ({ level, label, colorClass }) => {
      const { getByTestId } = render(<LogLevel level={level} />);

      const comp = getByTestId('logTail-level');
      expect(comp).toHaveTextContent(label);
      expect(comp).toHaveClass(colorClass);
    },
  );
});

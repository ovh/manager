import React from 'react';
import * as managerReactComponents from '@ovh-ux/manager-react-components';
import { Cell } from '@tanstack/react-table';
import { screen } from '@testing-library/react';
import ClipBoardCell from './ClipBoardCell.component';

import { render } from '@/utils/test/test.provider';
import { RancherService } from '@/types/api.type';

jest.mock('@ovh-ux/manager-react-components', () => ({
  ...jest.requireActual('@ovh-ux/manager-react-components'),
  Clipboard: jest.fn(),
  DataGridTextCell: jest.fn(),
}));

const mockCell = (value: string): Cell<RancherService, unknown> =>
  ({
    renderValue: () => value,
  } as Cell<RancherService, unknown>);

afterEach(() => {});

const setupSpecTest = (cell: Cell<RancherService, unknown>) =>
  render(<ClipBoardCell cell={cell} />);

describe('DataGridCell', () => {
  jest
    .spyOn(managerReactComponents, 'Clipboard')
    .mockImplementation(({ value }) => (
      <div data-testid="clipboard">{value}</div>
    ));
  jest
    .spyOn(managerReactComponents, 'DataGridTextCell')
    .mockImplementation(({ children }) => <>{children}</>);

  it('should render the component with the correct value', () => {
    const cell = mockCell('12345');
    setupSpecTest(cell);
    expect(screen.getByTestId('clipboard')).toHaveTextContent('12345');
  });

  it('should render the component with a different value', () => {
    const cell = mockCell('67890');
    setupSpecTest(cell);
    expect(screen.getByTestId('clipboard')).toHaveTextContent('67890');
  });
});

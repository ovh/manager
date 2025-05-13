import React from 'react';
import { afterEach, vi } from 'vitest';
import * as managerReactComponents from '@ovh-ux/manager-react-components';
import { Cell } from '@tanstack/react-table';
import { screen } from '@testing-library/react';
import ClipBoardCell from './ClipBoardCell.component';
import { render } from '@/utils/test/test.provider';
import { RancherService } from '@/types/api.type';

vi.mock('@ovh-ux/manager-react-components', async () => {
  const module = await vi.importActual('@ovh-ux/manager-react-components');

  return {
    ...module,
    Clipboard: vi.fn(),
    DataGridTextCell: vi.fn(),
  };
});

const mockCell = (value: string): Cell<RancherService, unknown> =>
  ({
    renderValue: () => value,
  } as Cell<RancherService, unknown>);

afterEach(() => {});

const setupSpecTest = (cell: Cell<RancherService, unknown>) =>
  render(<ClipBoardCell cell={cell} />);

describe('DataGridCell', () => {
  vi.spyOn(
    managerReactComponents,
    'Clipboard',
  ).mockImplementation(({ value }) => (
    <div data-testid="clipboard">{value}</div>
  ));
  vi.spyOn(
    managerReactComponents,
    'DataGridTextCell',
  ).mockImplementation(({ children }) => <>{children}</>);

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

import React from 'react';
import '@testing-library/jest-dom';
import { within } from '@testing-library/react';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Table, TableProps } from './table.component';
import { mockColumns, mockData } from './table.mock';
import { render } from '../../utils/test.provider';

const setupSpecTest = async (
  customProps?: Partial<TableProps>,
  table?: TableProps,
) =>
  render(
    <Table {...customProps}>
      <thead>
        <tr>
          {mockColumns.map((header) => (
            <th key={header.accessoryKey}>
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._500}
              >
                {header.header}
              </OsdsText>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mockData.map((header) => (
          <tr key={`${header.firstName}-tr`}>
            {Object.keys(header).map((element) => (
              <td key={header[element]}>{header[element]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>,
  );

function checkRowContents(
  row: HTMLElement,
  firstName: string,
  lastName: string,
  genre: string,
  role: string,
  birth: string,
) {
  const columns = within(row).getAllByRole('cell');
  expect(columns).toHaveLength(5);
  expect(columns[0]).toHaveTextContent(firstName);
  expect(columns[1]).toHaveTextContent(lastName);
  expect(columns[2]).toHaveTextContent(genre);
  expect(columns[3]).toHaveTextContent(role);
  expect(columns[4]).toHaveTextContent(birth);
}

describe('specs:table.component', () => {
  it('renders without error', async () => {
    const screen = await setupSpecTest();
    const header1 = screen.getByText('First Name');
    expect(header1).toBeTruthy();
  });

  describe('mode full width', () => {
    it('must not have class full width', async () => {
      const { getByRole } = await setupSpecTest();
      const table = getByRole('table');
      expect(table).not.toHaveClass('w-full');
    });
    it('must have class full width', async () => {
      const { getByRole } = await setupSpecTest({ fullWidth: true });
      const table = getByRole('table');
      expect(table).toHaveClass('w-full');
    });
  });

  describe('contents', () => {
    it('must display data columns', async () => {
      const { getByRole } = await setupSpecTest();
      const table = getByRole('table');
      const tbody = within(table).getAllByRole('rowgroup')[1];
      const rows = within(tbody).getAllByRole('row');
      checkRowContents(rows[0], 'Kylian', 'Mbappe', 'Male', 'AG', '20/12/1991');
      checkRowContents(
        rows[1],
        'Stephane',
        'Curry',
        'Male',
        'MO',
        '14/03/1988',
      );
      checkRowContents(
        rows[2],
        'Zinedine',
        'Zidane',
        'Male',
        'MO',
        '23/06/1972',
      );
    });
  });
});

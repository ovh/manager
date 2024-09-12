import React from 'react';
import { Meta } from '@storybook/react';
import { OdsText, OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';
import {
  ODS_ICON_NAME,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { Table, TableProps } from './table.component';
import { mockColumns, mocksData } from './table.mock';

const DisplayCellMenu = ({ id }) => (
  <div>
    <div id={`menu-button-${id}`} className="w-full">
      <OdsButton
        slot="menu-title"
        size={ODS_BUTTON_SIZE.sm}
        icon={ODS_ICON_NAME.ellipsisHorizontal}
        variant={ODS_BUTTON_VARIANT.outline}
        label=""
      />
    </div>
    <OdsPopover triggerId={`menu-button-${id}`}>
      <div>
        <OdsButton text-align="start" label="Manager" />
      </div>
      <div>
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.ghost}
          text-align="start"
          class="hydrated"
          label="Supprimer"
        />
      </div>
    </OdsPopover>
  </div>
);

export const defaultProps: TableProps = {
  fullWidth: true,
  children: (
    <>
      <thead>
        <tr>
          {mockColumns.map((header) => (
            <th scope="col" key={header.accessoryKey} className="text-center">
              {header.header}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {mocksData.map((header) => (
          <tr key={`${header.firstName}-tr`}>
            {Object.keys(header).map((element) => (
              <td
                key={`${header[element]}-${header[element].firstName}`}
                className="text-center"
              >
                <OdsText preset="span">{header[element]}</OdsText>
              </td>
            ))}
            <td key={`${header.firstName}-actions`} className="text-center">
              <DisplayCellMenu id={header.firstName} />
            </td>
          </tr>
        ))}
      </tbody>
    </>
  ),
};

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  decorators: [(story) => <div>{story()}</div>],
  component: Table,
  args: defaultProps,
};

export default meta;

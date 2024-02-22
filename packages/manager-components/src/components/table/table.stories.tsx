import React from 'react';
import { Meta } from '@storybook/react';
import {
  OsdsText,
  OsdsIcon,
  OsdsButton,
  OsdsMenuItem,
  OsdsMenu,
} from '@ovhcloud/ods-components/react';
import {
  ODS_TEXT_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Table, TableProps } from './table.component';
import { mockColumns, mocksData } from './table.mock';

const DisplayCellMenu = () => (
  <OsdsMenu className="absolute ml-[-15px] mt-[-15px]">
    <OsdsButton
      slot="menu-title"
      inline
      circle
      color={ODS_THEME_COLOR_INTENT.info}
      variant={ODS_BUTTON_VARIANT.stroked}
      type={ODS_BUTTON_TYPE.button}
      size={ODS_BUTTON_SIZE.sm}
    >
      <OsdsIcon
        color={ODS_THEME_COLOR_INTENT.primary}
        name={ODS_ICON_NAME.ELLIPSIS}
        size={ODS_ICON_SIZE.xs}
      />
    </OsdsButton>
    <OsdsMenuItem>
      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.ghost}
        text-align="start"
      >
        <span slot="start">
          <span>Manager</span>
        </span>
      </OsdsButton>
    </OsdsMenuItem>
    <OsdsMenuItem>
      <OsdsButton
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        color={ODS_THEME_COLOR_INTENT.error}
        variant={ODS_BUTTON_VARIANT.ghost}
        text-align="start"
        class="hydrated"
      >
        <span slot="start">
          <span>Supprimer</span>
        </span>
      </OsdsButton>
    </OsdsMenuItem>
  </OsdsMenu>
);

export const defaultProps: TableProps = {
  fullWidth: true,
  children: (
    <>
      <thead>
        <tr>
          {mockColumns.map((header) => (
            <th key={header.accessoryKey} className="text-center">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._500}
              >
                {header.header}
              </OsdsText>
            </th>
          ))}
          <th>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._500}
            >
              Button
            </OsdsText>
          </th>
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
                {header[element]}
              </td>
            ))}
            <td key={`${header.firstName}-actions`} className="text-center">
              <DisplayCellMenu />
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

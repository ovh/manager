import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  OsdsText,
  OsdsLink,
  OsdsIcon,
} from '@ovhcloud/ods-stencil/components/react/';
import {
  OdsThemeColorIntent,
  OdsThemeTypographyLevel,
} from '@ovhcloud/ods-theming';
import { OdsIconName, OdsIconSize } from '@ovhcloud/ods-core';
import './dataGrid.scss';

interface DataItem<T> {
  [key: string]: T;
}

const servicesLink = ['service', 'serviceName', 'domain', 'Name', 'Id'];

const Datagrid = <T,>(props: { data: DataItem<T>[] }) => {
  const { data } = props;
  const navigate = useNavigate();
  const tableHeaders = Object.keys(data[0]);
  const { t } = useTranslation('test-cdn/listing');

  const matchServiceLink = (name: string) => {
    return servicesLink.findIndex(
      (elem) => elem.toLocaleLowerCase() === name.toLocaleLowerCase(),
    );
  };
  return (
    <table className="datagrid">
      <thead>
        <tr>
          {tableHeaders.map((header, indexTh) => (
            <th key={`datagrid-th-${indexTh}`}>
              <OsdsText
                level={OdsThemeTypographyLevel.subheading}
                color={OdsThemeColorIntent.text}
              >
                {t(header)}
              </OsdsText>
            </th>
          ))}
          <th>
            <OsdsIcon
              size={OdsIconSize.xxs}
              name={OdsIconName.SETTINGS}
              color={OdsThemeColorIntent.primary}
            ></OsdsIcon>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((service: any, index: number) => (
          <tr key={index}>
            {tableHeaders.map((header, indexTd) => (
              <td className="p-3" key={`datagrid-td-${header}-${indexTd}`}>
                {matchServiceLink(header) > -1 ? (
                  <OsdsLink
                    color={OdsThemeColorIntent.primary}
                    onClick={() => navigate(`/dashboard/${service[header]}`)}
                  >
                    {String(service[header])}
                  </OsdsLink>
                ) : (
                  String(service[header]).slice(0, 20)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Datagrid;

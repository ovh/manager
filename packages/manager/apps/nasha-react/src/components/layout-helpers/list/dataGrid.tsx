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

interface DataItem {
  [key: string]: NasService;
}

type NasService = {
  canCreatePartition: boolean;
  customName: string;
  datacenter: string;
  diskType: string;
  ip: string;
  monitored: boolean;
  serviceName: string;
  zpoolCapacity: number;
  zpoolSize: number;
};

const Datagrid = (props: { data: DataItem[]; link: string }) => {
  const { data, link } = props;
  const navigate = useNavigate();
  const tableHeaders = Object.keys(data[0]);
  const { t } = useTranslation('nasha-react');
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
              <td
                key={`datagrid-td-${header}-${indexTd}`}
                onClick={() => navigate(`/details/${service.serviceName}`)}
              >
                {link && header === link ? (
                  <OsdsLink
                    color={OdsThemeColorIntent.primary}
                    href={`/details/${service.serviceName}`}
                  >
                    {String(service[header])}
                  </OsdsLink>
                ) : (
                  String(service[header])
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';
import './dataGrid.scss';

type Props = {
  data: {
    serviceName: string;
    [key: string]: string | number | boolean;
  }[];
  serviceKey: string;
};

const Datagrid: React.FC<Props> = ({ serviceKey, data }) => {
  const navigate = useNavigate();
  const tableHeaders = Object.keys(data[0]);
  const { t } = useTranslation('{{appName}}/listing');

  return (
    <table className="datagrid">
      <thead>
        <tr>
          {tableHeaders.map((header, indexTh) => (
            <th key={`datagrid-th-${indexTh}`}>
              <OsdsText
                level={ODS_TEXT_LEVEL.subheading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t(header)}
              </OsdsText>
            </th>
          ))}
          <th>
            <OsdsIcon
              size={ODS_ICON_SIZE.xxs}
              name={ODS_ICON_NAME.SETTINGS}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((service: any, index: number) => (
          <tr key={index}>
            {tableHeaders.map((header, indexTd) => (
              <td className="p-3" key={`datagrid-td-${header}-${indexTd}`}>
                {header === serviceKey ? (
                  <OsdsLink
                    color={ODS_THEME_COLOR_INTENT.primary}
                    onClick={() => navigate(`/${service[serviceKey]}`)}
                  >
                    {`${service[header]}`}
                  </OsdsLink>
                ) : (
                  `${service[header]}`.slice(0, 20)
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

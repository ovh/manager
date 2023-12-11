import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { OsdsIcon } from '@ovhcloud/ods-components/icon/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components/icon';

type Props = {
  data: {
    serviceName: string;
    [key: string]: string | number | boolean;
  }[];
  serviceKey: string;
};

export const Datagrid: React.FC<Props> = ({ serviceKey, data }) => {
  const navigate = useNavigate();
  const tableHeaders = Object.keys(data[0]).filter(
    (header) => header !== 'iam',
  );
  const { t } = useTranslation('{{appName}}/listing');

  return (
    <table className="w-full border-2 border-solid border-collapse table-auto border-ods-primary-100">
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th
              className="p-6 text-center background-ods-primary-100"
              key={`datagrid-th-${header}`}
            >
              <OsdsText
                level={ODS_TEXT_LEVEL.subheading}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t(header)}
              </OsdsText>
            </th>
          ))}
          <th className="background-ods-primary-100 p-6">
            <OsdsIcon
              size={ODS_ICON_SIZE.xxs}
              name={ODS_ICON_NAME.SETTINGS}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((service) => (
          <tr
            className="bg-white border-2 border-solid border-ods-primary-100 background-ods-primary-000"
            key={`datagrid-tr-${service.serviceName}`}
          >
            {tableHeaders.map((header) => (
              <td
                className="p-6 text-center"
                key={`datagrid-td-${header}-${serviceKey}`}
              >
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

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import './dataGrid.scss';

const Datagrid = (props: { data }) => {
  const { data } = props;
  const navigate = useNavigate();
  const tableHeaders = Object.keys(data[0]);
  const { t } = useTranslation('nasha-react');
  return (
    <table>
      <thead>
        <tr>
          {tableHeaders.map((header) => (
            <th key={header}>{t(header)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((service: any, index: number) => (
          <tr key={index}>
            {tableHeaders.map((header) => (
              <td
                key={header}
                onClick={() => navigate(`/details/${service.serviceName}`)}
              >
                {header === 'serviceName' ? (
                  <Link to={`/details/${service.serviceName}`}>
                    {String(service[header])}
                  </Link>
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

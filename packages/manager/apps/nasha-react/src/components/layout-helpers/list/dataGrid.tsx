import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './dataGrid.scss';

const Datagrid = (props: { data: string }) => {
  const { data } = props;
  const { t } = useTranslation('nasha-react');
  return (
    <table>
      <thead>
        <tr>
          <th>{t('Service Name')}</th>
          <th>{t('Custom Name')}</th>
          <th>{t('Zpool Size')}</th>
          <th>{t('Zpool Capacity')}</th>
          <th>{t('Can Create Partition')}</th>
          <th>{t('Disk Type')}</th>
          <th>{t('Settings')}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((service, index) => (
          <tr style={{ backgroundColor: '#FFF' }} key={index}>
            <td>
              {
                <Link to={`/details/${service.serviceName}`}>
                  {service.serviceName}
                </Link>
              }
            </td>
            <td>{service.customName}</td>
            <td>{service.zpoolSize}</td>
            <td>{service.zpoolCapacity}</td>
            <td>{String(service.canCreatePartition)}</td>
            <td>{service.diskType}</td>
            <td></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Datagrid;

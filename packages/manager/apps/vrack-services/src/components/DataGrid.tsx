import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import { OsdsChip } from '@ovhcloud/ods-components/chip/react';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components/text';
import { OsdsLink } from '@ovhcloud/ods-components/link/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Locale } from '@ovhcloud/msc-utils';
import { useEnvironment } from '@ovh-ux/manager-react-core-application';
import { ProductStatus, VrackServicesWithIAM } from '@/api';

type Props = {
  data: VrackServicesWithIAM[];
};

export const Datagrid: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('vrack-services/listing');
  const environment = useEnvironment();
  const locale = environment.getUserLocale() as Locale;

  const colorByProductStatus = {
    [ProductStatus.ACTIVE]: ODS_THEME_COLOR_INTENT.primary,
    [ProductStatus.DISABLED]: ODS_THEME_COLOR_INTENT.error,
    [ProductStatus.DRAFT]: ODS_THEME_COLOR_INTENT.info,
  };

  return (
    <table className="w-full border-2 border-solid border-collapse table-auto border-ods-primary-100">
      <thead>
        <tr>
          {['displayName', 'productStatus', 'zone', 'vrackId', 'createdAt'].map(
            (headerProp) => (
              <th
                key={`th-${headerProp}`}
                className="p-6 text-center background-ods-primary-100"
              >
                <OsdsText
                  level={ODS_TEXT_LEVEL.subheading}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {t(headerProp)}
                </OsdsText>
              </th>
            ),
          )}
        </tr>
      </thead>
      <tbody>
        {data.map((currentVs: VrackServicesWithIAM) => (
          <tr
            key={`tr-${currentVs.id}`}
            className="bg-white border-2 border-solid border-ods-primary-100 background-ods-primary-000"
          >
            <td className="p-6 text-center">
              <OsdsLink
                color={ODS_THEME_COLOR_INTENT.primary}
                onClick={() => navigate(`/${currentVs.id}`)}
              >
                {currentVs.currentState.displayName || currentVs.id}
              </OsdsLink>
            </td>
            <td className="p-6 text-center">
              <OsdsChip
                inline
                color={
                  colorByProductStatus[currentVs.currentState.productStatus]
                }
              >
                {t(currentVs.currentState.productStatus)}
              </OsdsChip>
            </td>
            <td className="p-6 text-center">
              {t(currentVs.currentState.zone)}
            </td>
            <td className="p-6 text-center">
              {currentVs.currentState.vrackId}
            </td>
            <td className="p-6 text-center">
              {currentVs.createdAt
                ? new Date(currentVs.createdAt).toLocaleDateString(
                    locale.replace('_', '-'),
                  )
                : '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Datagrid;

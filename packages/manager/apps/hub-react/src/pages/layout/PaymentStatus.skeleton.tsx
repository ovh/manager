import {
  OsdsSkeleton,
  OsdsTable,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import {
  ODS_SKELETON_SIZE,
  ODS_TEXT_COLOR_HUE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';

export default function PaymentStatusSkeleton() {
  const { t } = useTranslation('hub/payment-status');

  return (
    <OsdsTile
      className="w-full flex flex-col p-6"
      inline
      data-testid="payment_status"
    >
      <div className="flex mb-2 gap-4 items-start">
        <OsdsText
          className="block flex-1 mb-6"
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_TEXT_SIZE._400}
          hue={ODS_TEXT_COLOR_HUE._800}
          color={ODS_THEME_COLOR_INTENT.primary}
          data-testid="payment_status_title"
        >
          {t('ovh_manager_hub_payment_status_tile_title')}
          <OsdsSkeleton
            data-testid="my_services_link_skeleton"
            inline
            size={ODS_SKELETON_SIZE.xs}
          />
        </OsdsText>
        <OsdsSkeleton
          data-testid="my_services_link_skeleton"
          inline
          size={ODS_SKELETON_SIZE.xs}
        />
      </div>
      <OsdsTable
        className="block overflow-visible"
        data-testid="payment_status_table"
      >
        <table className="table-auto">
          <tbody>
            {[1, 2, 3, 4].map((line: number) => (
              <tr
                className="p-6"
                key={`billing_service_skeleton_${line}`}
                data-testid="billing_service"
              >
                <td scope="row" className="!p-4">
                  <OsdsSkeleton
                    className="block mb-3"
                    data-testid="service_name_skeleton"
                    inline
                    size={ODS_SKELETON_SIZE.xs}
                  />
                  <OsdsSkeleton
                    className="block"
                    data-testid="service_category_skeleton"
                    inline
                    size={ODS_SKELETON_SIZE.xs}
                  />
                </td>
                <td scope="row" className="!p-4">
                  <div className="lg:inline mb-1">
                    <OsdsSkeleton
                      className="block mb-5"
                      data-testid="service_status_skeleton"
                      inline
                      size={ODS_SKELETON_SIZE.xs}
                    />
                  </div>
                  <div
                    className="lg:inline mb-1"
                    data-testid="service_expiration_date_message"
                  >
                    <OsdsSkeleton
                      className="block"
                      data-testid="service_date_skeleton"
                      inline
                      size={ODS_SKELETON_SIZE.xs}
                    />
                  </div>
                </td>
                <td>
                  <OsdsSkeleton
                    data-testid="service_link_skeleton"
                    inline
                    size={ODS_SKELETON_SIZE.xs}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </OsdsTable>
    </OsdsTile>
  );
}

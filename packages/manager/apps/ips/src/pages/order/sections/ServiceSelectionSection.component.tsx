import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSkeleton,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { useQuery } from '@tanstack/react-query';
import { OrderSection } from '../../../components/OrderSection/OrderSection.component';
import { getVrackList } from '@/data/api/vrack';
import { OrderContext } from '../order.context';

export const ServiceSelectionSection: React.FC = () => {
  const { selectedService, setSelectedService } = React.useContext(
    OrderContext,
  );
  const { t } = useTranslation('order');
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['vrack'],
    queryFn: getVrackList,
  });

  return (
    <OrderSection title={t('service_selection_title')}>
      {isError && (
        <OdsMessage color={ODS_MESSAGE_COLOR.critical}>
          {t('error_message', { error })}
        </OdsMessage>
      )}
      <OdsFormField className="w-full">
        <label htmlFor="service" slot="label">
          {t('service_selection_select_label')}
        </label>
        {isLoading ? (
          <OdsSkeleton />
        ) : (
          <OdsSelect
            className="w-full max-w-[384px]"
            id="service"
            name="service"
            isDisabled={isLoading || isError}
            onOdsChange={(event) =>
              setSelectedService(event.target.value as string)
            }
            value={selectedService}
            placeholder={t('service_selection_select_placeholder')}
          >
            <optgroup
              label={t('service_selection_select_vrack_option_group_label')}
            >
              {data?.data?.map((vrack) => (
                <option key={vrack} value={vrack}>
                  {vrack}
                </option>
              ))}
            </optgroup>
          </OdsSelect>
        )}
      </OdsFormField>
    </OrderSection>
  );
};

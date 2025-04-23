import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useFormatDate } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import {
  ServiceInfoRenewMode,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';

interface ServiceDetailSubscribingRenewProps {
  readonly renewDate: string;
  readonly expirationDate: string;
  readonly renewMode: string;
}

export default function ServiceDetailSubscribingRenew({
  renewDate,
  expirationDate,
  renewMode,
}: ServiceDetailSubscribingRenewProps) {
  const { t } = useTranslation('allDom');
  const formatDate = useFormatDate();

  if (renewMode === ServiceInfoRenewMode.Automatic) {
    return (
      <div className="flex flex-col gap-y-2">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('allDom_page_detail_subscribing_automatic_renew')}
        </OdsText>
        <OdsText>
          {formatDate({
            date: renewDate,
            format: 'PP',
          })}
        </OdsText>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      <OdsText preset={ODS_TEXT_PRESET.heading6}>
        {t('allDom_page_detail_subscribing_manual_renew')}
      </OdsText>
      <OdsText>
        {formatDate({
          date: expirationDate,
          format: 'PP',
        })}
      </OdsText>
    </div>
  );
}

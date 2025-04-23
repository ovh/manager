import {
  ODS_CARD_COLOR,
  ODS_DIVIDER_COLOR,
  ODS_DIVIDER_SPACING,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { OdsCard, OdsDivider, OdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { TServiceDetail } from '@/alldoms/types';
import DatagridColumnRenewMode from '@/alldoms/components/AllDomDatagridColumns/DatagridColumnRenewMode';
import {
  ServiceInfoRenewMode,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';

interface ServiceDetailInformationProps {
  readonly allDomProperty: TServiceDetail['allDomProperty'];
  readonly extensionsList?: string[];
  readonly status: ServiceInfoRenewMode;
  readonly allDomResourceState: ServiceInfoUpdateEnum;
}

export default function ServiceDetailInformation({
  allDomProperty,
  extensionsList,
  status,
  allDomResourceState,
}: ServiceDetailInformationProps) {
  const { t } = useTranslation('allDom');
  return (
    <OdsCard
      color={ODS_CARD_COLOR.neutral}
      className="w-full p-6"
      data-testid="ServiceDetailInformation"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading4}>
        {t('allDom_detail_page_information_title')}
      </OdsText>

      <OdsDivider
        color={ODS_DIVIDER_COLOR.light}
        spacing={ODS_DIVIDER_SPACING._24}
      />

      <div className="flex flex-col gap-y-3">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('allDom_page_detail_information_general_pack', {
            t0: allDomProperty.type,
          })}
        </OdsText>
        <OdsText>
          <Trans
            t={t}
            i18nKey="allDom_page_detail_information_general_extensions"
            values={{
              t0: extensionsList
                .map((extension) => `.${extension.toLowerCase()}`)
                .join('; '),
            }}
            components={{ strong: <strong /> }}
          />
        </OdsText>
        <DatagridColumnRenewMode
          renewMode={status}
          allDomResourceState={allDomResourceState}
        />
      </div>
    </OdsCard>
  );
}

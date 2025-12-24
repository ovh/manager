import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsDivider,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { Price } from '@/components/price';
import { IpMigrationOrder } from '@/types/ipMigrationOrder';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { PRICE_MULTIPLIER } from '../importIpFromSys.constant';
import ModalButtonGroup from './ModalButtonGroup.component';

export type Step5Props = {
  onCancel: () => void;
  onPrevious: () => void;
  onConfirm: () => void;
  orderData: IpMigrationOrder;
};

export default function Step5({
  onCancel,
  onPrevious,
  orderData,
  onConfirm,
}: Step5Props) {
  const { environment } = React.useContext(ShellContext);
  const { t, i18n } = useTranslation([
    TRANSLATION_NAMESPACES.importIpFromSys,
    NAMESPACES.ACTIONS,
  ]);

  return (
    <>
      <div className="flex flex-col">
        <OdsMessage
          className="mb-4 block"
          color={ODS_MESSAGE_COLOR.information}
          isDismissible={false}
        >
          {t('step5Description')}
        </OdsMessage>
      </div>
      <div className="mb-6 flex flex-col gap-3">
        {orderData?.details?.map((detail) => (
          <div key={`${detail.domain}-${detail.detailType}`}>
            <div className="flex justify-between">
              <OdsText>{detail.description}</OdsText>
              <Price
                value={detail.totalPrice.value * PRICE_MULTIPLIER}
                tax={0}
                ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
                locale={i18n.language}
              />
            </div>
            <OdsDivider />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('step5TotalPriceHT', {
            price: orderData?.prices?.withoutTax?.text,
          })}
        </OdsText>
      </div>
      <OdsDivider className="mb-2 block" />
      <div className="flex justify-end">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('step5TotalPriceTTC', { price: orderData?.prices?.withTax?.text })}
        </OdsText>
      </div>
      <OdsDivider className="mb-6 block" />
      <OdsText className="mb-3 block">
        {t('step5ConfirmTextPart1', {
          confirmButtonLabel: t('confirm', { ns: NAMESPACES.ACTIONS }),
        })}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="mb-4 block">
        {t('step5ConfirmTextPart2')}
      </OdsText>
      <ModalButtonGroup
        currentStep={5}
        onCancel={onCancel}
        onPrevious={onPrevious}
        onConfirm={onConfirm}
      />
    </>
  );
}

import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsDivider,
  OdsMessage,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_MESSAGE_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary, Price } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TRANSLATION_NAMESPACES } from '@/utils';
import ModalButtonGroup from './ModalButtonGroup.component';
import { PRICE_MULTIPLIER } from '../importIpFromSys.constant';
import { IpMigrationOrder } from '@/types/ipMigrationOrder';

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
          className="block mb-4"
          color={ODS_MESSAGE_COLOR.information}
          isDismissible={false}
        >
          {t('step5Description')}
        </OdsMessage>
      </div>
      <div className="flex flex-col gap-3 mb-6">
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
      <OdsDivider className="block mb-2" />
      <div className="flex justify-end">
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('step5TotalPriceTTC', { price: orderData?.prices?.withTax?.text })}
        </OdsText>
      </div>
      <OdsDivider className="block mb-6" />
      <OdsText className="block mb-3">
        {t('step5ConfirmTextPart1', {
          confirmButtonLabel: t('confirm', { ns: NAMESPACES.ACTIONS }),
        })}
      </OdsText>
      <OdsText preset={ODS_TEXT_PRESET.caption} className="block mb-4">
        {t('step5ConfirmTextPart2')}
      </OdsText>
      <ModalButtonGroup
        onCancel={onCancel}
        onPrevious={onPrevious}
        onConfirm={onConfirm}
      />
    </>
  );
}

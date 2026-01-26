import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  MessageBody,
  TEXT_PRESET,
  Divider,
  Message,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary } from '@ovh-ux/muk';
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
        <Message
          className="mb-4 block"
          color={MESSAGE_COLOR.information}
          dismissible={false}
        >
          <MessageBody>{t('step5Description')}</MessageBody>
        </Message>
      </div>
      <div className="mb-6 flex flex-col gap-4">
        {orderData?.details?.map((detail) => (
          <div key={`${detail.domain}-${detail.detailType}`}>
            <div className="flex justify-between">
              <Text>{detail.description}</Text>
              <Price
                value={detail.totalPrice.value * PRICE_MULTIPLIER}
                tax={0}
                ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
                locale={i18n.language}
              />
            </div>
            <Divider />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Text preset={TEXT_PRESET.heading6}>
          {t('step5TotalPriceHT', {
            price: orderData?.prices?.withoutTax?.text,
          })}
        </Text>
      </div>
      <Divider className="mb-2 block" />
      <div className="flex justify-end">
        <Text preset={TEXT_PRESET.heading6}>
          {t('step5TotalPriceTTC', { price: orderData?.prices?.withTax?.text })}
        </Text>
      </div>
      <Divider className="mb-6 block" />
      <Text className="mb-3 block">
        {t('step5ConfirmTextPart1', {
          confirmButtonLabel: t('confirm', { ns: NAMESPACES.ACTIONS }),
        })}
      </Text>
      <Text preset={TEXT_PRESET.caption} className="mb-4 block">
        {t('step5ConfirmTextPart2')}
      </Text>
      <ModalButtonGroup
        currentStep={5}
        onCancel={onCancel}
        onPrevious={onPrevious}
        onConfirm={onConfirm}
      />
    </>
  );
}

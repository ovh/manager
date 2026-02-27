import React from 'react';

import { useTranslation } from 'react-i18next';

import { SPINNER_SIZE, TEXT_PRESET, Spinner, Text } from '@ovhcloud/ods-react';

import { IntervalUnit, OvhSubsidiary } from '@ovh-ux/muk';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { Price } from '@/components/price';

export type PriceFooterProps = {
  price: number | null;
  suffix?: string;
  isStartingPrice?: boolean;
  shouldOverrideStyle?: boolean;
};

export const PriceDescription: React.FC<PriceFooterProps> = ({
  price,
  suffix,
  isStartingPrice,
  shouldOverrideStyle = false,
}) => {
  const { t, i18n } = useTranslation();
  const { environment } = React.useContext(ShellContext);
  return (
    <Text
      preset={TEXT_PRESET.paragraph}
      className={`${shouldOverrideStyle ? '' : 'flex justify-center'}`}
    >
      {price === null ? (
        <Spinner size={SPINNER_SIZE.xs} />
      ) : (
        <Price
          isStartingPrice={isStartingPrice}
          suffix={suffix}
          value={price}
          tax={0}
          intervalUnit={IntervalUnit.month}
          ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
          locale={i18n.language}
          freePriceLabel={t('free_price')}
        />
      )}
    </Text>
  );
};

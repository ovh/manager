import React from 'react';
import {
  IntervalUnitType,
  OvhSubsidiary,
  Price,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

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
    <OdsText
      preset={ODS_TEXT_PRESET.paragraph}
      className={`${shouldOverrideStyle ? '' : 'flex justify-center'}`}
    >
      {price === null ? (
        <OdsSpinner size={ODS_SPINNER_SIZE.xs} />
      ) : (
        <Price
          isStartingPrice={isStartingPrice}
          suffix={suffix}
          value={price}
          tax={0}
          intervalUnit={IntervalUnitType.month}
          ovhSubsidiary={environment.user.ovhSubsidiary as OvhSubsidiary}
          locale={i18n.language}
          freePriceLabel={t('free_price')}
        />
      )}
    </OdsText>
  );
};

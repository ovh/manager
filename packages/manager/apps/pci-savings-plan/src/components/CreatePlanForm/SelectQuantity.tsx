import { ODS_ICON_NAME, OdsInputChangeEvent } from '@ovhcloud/ods-components';

import React from 'react';
import { usePciUrl } from '@ovh-ux/manager-pci-common';

import { Subtitle } from '@ovh-ux/manager-react-components';
import {
  OdsText,
  OdsQuantity,
  OdsMessage,
  OdsLink,
  OdsCard,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { DescriptionWrapper } from './CreatePlanForm';
import { Block } from '../SimpleTile/SimpleTile';

export const DEFAULT_QUANTITY = 1;
export const MAX_QUANTITY = 1000;

export type SelectQuantityProps = {
  isInstance: boolean;
  quantity: number;
  handleQuantityChange: (event: OdsInputChangeEvent) => void;
};

const SelectQuantity = ({
  isInstance,
  quantity,
  handleQuantityChange,
}: SelectQuantityProps) => {
  const { t } = useTranslation('create');
  const pciUrl = usePciUrl();

  return (
    <Block>
      <Subtitle>{t('select_quantity')}</Subtitle>
      <DescriptionWrapper className="mb-[12px]">
        {t(
          `select_quantity_description_${isInstance ? 'instance' : 'rancher'}`,
        )}
      </DescriptionWrapper>
      {!isInstance && (
        <DescriptionWrapper className="mb-[12px]">
          {t('select_quantity_description_rancher_info')}
        </DescriptionWrapper>
      )}
      <OdsMessage className="my-2" isDismissible={false}>
        <OdsText className="inline-block">
          {t(`quantity_banner_${isInstance ? 'instance' : 'rancher'}`)}
          {isInstance && (
            <OdsLink
              href={`${pciUrl}/quota`}
              target="_blank"
              icon={ODS_ICON_NAME.externalLink}
              label={t('quantity_banner_instance_link')}
            />
          )}
        </OdsText>
      </OdsMessage>
      <OdsCard className="flex flex-row items-center mr-5 p-4 text-center justify-between w-full mb-[32px] mt-[16px] border">
        <OdsText>
          {t(`quantity_label_${isInstance ? 'instance' : 'rancher'}`)}
        </OdsText>

        <OdsQuantity
          onOdsChange={handleQuantityChange}
          value={quantity}
          min={DEFAULT_QUANTITY}
          max={MAX_QUANTITY}
          name="quantity"
        />
      </OdsCard>
    </Block>
  );
};

export default SelectQuantity;

import { useEffect, useState } from 'react';

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT, ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';

import { QuantitySelector } from '@ovh-ux/manager-pci-common';
import { useMe } from '@ovh-ux/manager-react-components';

import { ANTI_AFFINITY_MAX_NODES, AUTOSCALING_LINK, NODE_RANGE } from '@/constants';
import { TScalingState } from '@/types';

function getDesiredQuantity(quantity: { min: number; desired: number }, maxValue: number) {
  if (quantity.min >= NODE_RANGE.MAX) return 0;
  if (quantity.min >= maxValue) return maxValue;
  return quantity.desired;
}

export interface AutoscalingProps {
  initialScaling?: TScalingState['quantity'];
  isMonthlyBilling?: boolean;
  isAntiAffinity?: boolean;
  autoscale?: TScalingState['isAutoscale'];
  onChange?: (scaling: TScalingState) => void;
}

export function Autoscaling({
  initialScaling,
  isAntiAffinity,
  autoscale,
  onChange,
}: Readonly<AutoscalingProps>) {
  const { t } = useTranslation('autoscaling');
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  const infosURL =
    AUTOSCALING_LINK[ovhSubsidiary as keyof typeof AUTOSCALING_LINK] || AUTOSCALING_LINK.DEFAULT;
  const [isAutoscale, setIsAutoscale] = useState<boolean>(!!autoscale);
  const [quantity, setQuantity] = useState({
    desired: initialScaling ? initialScaling.desired : NODE_RANGE.MIN,
    min: initialScaling ? initialScaling.min : 0,
    max: initialScaling ? initialScaling.max : NODE_RANGE.MAX,
  });
  const maxValue = isAntiAffinity ? ANTI_AFFINITY_MAX_NODES : NODE_RANGE.MAX;

  useEffect(() => {
    onChange?.({
      quantity,
      isAutoscale,
    });
  }, [quantity, isAutoscale]);

  return (
    <>
      <QuantitySelector
        className="mt-4"
        label={t('kubernetes_node_pool_autoscaling_desired_nodes_size')}
        value={quantity.desired}
        onValueChange={(desired) => {
          setQuantity((q) => ({
            ...q,
            desired,
          }));
        }}
        min={0}
        max={maxValue}
      />
      <OsdsFormField className="mt-8" inline>
        <OsdsToggle
          disabled={isAntiAffinity || undefined}
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={isAutoscale || undefined}
          onClick={() => !isAntiAffinity && setIsAutoscale((auto) => !auto)}
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {t(`kubernetes_node_pool_autoscaling_autoscale_toggle_${isAutoscale}`)}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="block"
      >
        {t('kubernetes_node_pool_autoscaling_description')}
        {ovhSubsidiary && (
          <OsdsLink
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={infosURL}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {t('kubernetes_node_pool_autoscaling_description_link')}
            <OsdsIcon
              className="ml-3"
              slot="end"
              name={ODS_ICON_NAME.EXTERNAL_LINK}
              size={ODS_ICON_SIZE.xxs}
              color={ODS_THEME_COLOR_INTENT.primary}
            ></OsdsIcon>
          </OsdsLink>
        )}
      </OsdsText>
      {isAutoscale && (
        <div className={clsx('gap-4 flex')}>
          <QuantitySelector
            className="mt-8 max-w-32"
            label={t('kubernetes_node_pool_autoscaling_lowest_nodes_size')}
            value={quantity.min}
            onValueChange={(min) =>
              setQuantity((q) => ({
                ...q,
                min,
              }))
            }
            min={0}
            max={quantity.max <= maxValue ? quantity.desired : maxValue}
          />
          <QuantitySelector
            className="mt-8 max-w-32"
            label={t('kubernetes_node_pool_autoscaling_highest_nodes_size')}
            value={quantity.max}
            onValueChange={(max) =>
              setQuantity((q) => ({
                ...q,
                max,
              }))
            }
            min={getDesiredQuantity(quantity, maxValue)}
            max={maxValue}
          />
        </div>
      )}

      {quantity.desired < NODE_RANGE.MIN && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
          {t('kubernetes_node_pool_autoscaling_desired_nodes_warning')}
        </OsdsMessage>
      )}
    </>
  );
}

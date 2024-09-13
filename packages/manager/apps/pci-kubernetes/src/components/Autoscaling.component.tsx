import {
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
} from '@ovhcloud/ods-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  OsdsFormField,
  OsdsIcon,
  OsdsLink,
  OsdsMessage,
  OsdsText,
  OsdsToggle,
} from '@ovhcloud/ods-components/react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useMe } from '@ovh-ux/manager-react-components';
import { useEffect, useState } from 'react';
import { QuantitySelector } from '@ovh-ux/manager-pci-common';
import {
  ANTI_AFFINITY_MAX_NODES,
  NODE_RANGE,
  AUTOSCALING_LINK,
} from '@/constants';

export interface AutoscalingState {
  quantity: {
    desired: number;
    min: number;
    max: number;
  };
  isAutoscale: boolean;
}

export interface AutoscalingProps {
  initialScaling?: { min: number; max: number; desired: number };
  isMonthlyBilling?: boolean;
  isAntiAffinity?: boolean;
  autoscale: boolean;
  onChange?: (scaling: AutoscalingState) => void;
}

export function Autoscaling({
  initialScaling,
  isMonthlyBilling,
  isAntiAffinity,
  autoscale,
  onChange,
}: Readonly<AutoscalingProps>) {
  const { t } = useTranslation('autoscaling');
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  const infosURL = AUTOSCALING_LINK[ovhSubsidiary] || AUTOSCALING_LINK.DEFAULT;
  const [isAutoscale, setIsAutoscale] = useState(autoscale);
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

  useEffect(() => {
    setQuantity({
      desired: initialScaling ? initialScaling.desired : NODE_RANGE.MIN,
      min: initialScaling ? initialScaling.min : 0,
      max: initialScaling ? initialScaling.max : NODE_RANGE.MAX,
    });
  }, [isAutoscale]);

  return (
    <>
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

      <OsdsFormField className="mt-8" inline>
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._200}
          slot="label"
        >
          {t('kubernetes_node_pool_autoscaling_autoscale')}
        </OsdsText>
        <OsdsToggle
          color={ODS_THEME_COLOR_INTENT.primary}
          checked={isAutoscale || undefined}
          onClick={() => setIsAutoscale((auto) => !auto)}
        >
          <OsdsText
            className="ml-4 font-bold"
            color={ODS_TEXT_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            slot="end"
          >
            {t(
              `kubernetes_node_pool_autoscaling_autoscale_toggle_${isAutoscale}`,
            )}
          </OsdsText>
        </OsdsToggle>
      </OsdsFormField>

      {isAutoscale && (
        <>
          <QuantitySelector
            className="mt-8"
            label={t('kubernetes_node_pool_autoscaling_lowest_nodes_size')}
            value={quantity.min}
            onValueChange={(min) =>
              setQuantity((_quantity) => ({
                ..._quantity,
                min,
              }))
            }
            min={0}
            max={quantity.max < maxValue ? quantity.max : maxValue}
          />
          <QuantitySelector
            className="mt-8"
            label={t('kubernetes_node_pool_autoscaling_highest_nodes_size')}
            value={quantity.max}
            onValueChange={(max) =>
              setQuantity((_quantity) => ({
                ..._quantity,
                max,
              }))
            }
            min={quantity.min > maxValue ? maxValue : quantity.min}
            max={maxValue}
          />
          {isMonthlyBilling && isAutoscale && (
            <OsdsMessage className="mt-8" type={ODS_MESSAGE_TYPE.warning}>
              {t('kubernetes_node_pool_billing_auto_scaling_monthly_warning')}
            </OsdsMessage>
          )}
        </>
      )}

      {!isAutoscale && (
        <>
          <QuantitySelector
            className="mt-8"
            label={t('kubernetes_node_pool_autoscaling_desired_nodes_size')}
            value={quantity.desired}
            onValueChange={(desired) => {
              setQuantity((_quantity) => ({
                ..._quantity,
                desired,
              }));
            }}
            min={0}
            max={maxValue}
          />
          {quantity.desired < NODE_RANGE.MIN && (
            <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
              {t('kubernetes_node_pool_autoscaling_desired_nodes_warning')}
            </OsdsMessage>
          )}
        </>
      )}
    </>
  );
}

import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_MESSAGE_TYPE } from '@ovhcloud/ods-components';
import { OsdsMessage } from '@ovhcloud/ods-components/react';
import {
  FormField,
  FormFieldLabel,
  Icon,
  Link,
  Quantity,
  QuantityControl,
  QuantityInput,
  Text,
  Toggle,
  ToggleControl,
  ToggleLabel,
} from '@ovhcloud/ods-react';

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
  isAutoscale: TScalingState['isAutoscale'];
  onChange?: (scaling: TScalingState) => void;
  totalNodes?: number | null;
}

export function Autoscaling({
  initialScaling,
  isAutoscale,
  isAntiAffinity,
  onChange,
  totalNodes,
}: Readonly<AutoscalingProps>) {
  const { t } = useTranslation('autoscaling');
  const ovhSubsidiary = useMe()?.me?.ovhSubsidiary;
  const infosURL =
    AUTOSCALING_LINK[ovhSubsidiary as keyof typeof AUTOSCALING_LINK] || AUTOSCALING_LINK.DEFAULT;

  const maxValue = isAntiAffinity ? ANTI_AFFINITY_MAX_NODES : NODE_RANGE.MAX;

  const quantity = {
    desired: initialScaling ? initialScaling.desired : NODE_RANGE.MIN,
    min: initialScaling ? initialScaling.min : 0,
    max: initialScaling ? initialScaling.max : NODE_RANGE.MAX,
  };

  return (
    <div className="max-w-3xl">
      <FormField className="mt-4">
        <FormFieldLabel>
          {t('kubernetes_node_pool_autoscaling_desired_nodes_size')}{' '}
          {totalNodes && `(${t('kubernetes_node_pool_autoscaling_by_zone')})`}
        </FormFieldLabel>
        <Quantity
          className="mt-4"
          value={quantity.desired.toString()}
          onValueChange={({ valueAsNumber }) => {
            onChange?.({
              isAutoscale,
              quantity: { ...quantity, desired: isNaN(valueAsNumber) ? 0 : valueAsNumber },
            });
          }}
          min={0}
          max={maxValue}
        >
          <QuantityControl>
            <QuantityInput />
          </QuantityControl>
        </Quantity>
      </FormField>
      {totalNodes && (
        <Text color="text">
          {t('kubernetes_node_pool_autoscaling_total_nodes', { totalNodes })}
        </Text>
      )}
      <FormField className="mt-8">
        <Toggle
          disabled={isAntiAffinity}
          checked={isAutoscale}
          onChange={() => {
            if (!isAntiAffinity) {
              onChange?.({ isAutoscale: !isAutoscale, quantity });
            }
          }}
        >
          <ToggleControl />
          <ToggleLabel>
            <Text className="ml-4 font-bold" color="text">
              {t(`kubernetes_node_pool_autoscaling_autoscale_toggle_${isAutoscale}`)}
            </Text>
          </ToggleLabel>
        </Toggle>
      </FormField>
      <Text className="mt-6" color={'text'}>
        {t('kubernetes_node_pool_autoscaling_description')}
        {ovhSubsidiary && (
          <Link
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.primary}
            href={infosURL}
            target={OdsHTMLAnchorElementTarget._blank}
          >
            {t('kubernetes_node_pool_autoscaling_description_link')}
            <Icon className="ml-3" slot="end" name="external-link" color="primary" />
          </Link>
        )}
      </Text>
      {isAutoscale && (
        <div className="mt-8">
          <div className={clsx('gap-4 flex')}>
            <FormField id="min-nodes">
              <FormFieldLabel>
                {t('kubernetes_node_pool_autoscaling_lowest_nodes_size')}
              </FormFieldLabel>
              <Quantity
                className="mt-2 max-w-32"
                value={quantity.min.toString()}
                onValueChange={({ valueAsNumber }) => {
                  onChange?.({
                    isAutoscale,
                    quantity: { ...quantity, min: isNaN(valueAsNumber) ? 0 : valueAsNumber },
                  });
                }}
                min={0}
                max={quantity.max <= maxValue ? quantity.desired : maxValue}
              >
                <QuantityControl>
                  <QuantityInput />
                </QuantityControl>
              </Quantity>
            </FormField>
            <FormField id="max-nodes">
              <FormFieldLabel>
                {t('kubernetes_node_pool_autoscaling_highest_nodes_size')}
              </FormFieldLabel>
              <Quantity
                className="mt-2 max-w-32"
                value={quantity.max.toString()}
                onValueChange={({ valueAsNumber }) => {
                  onChange?.({
                    isAutoscale,
                    quantity: { ...quantity, max: isNaN(valueAsNumber) ? 0 : valueAsNumber },
                  });
                }}
                min={getDesiredQuantity(quantity, maxValue)}
                max={maxValue}
              >
                <QuantityControl>
                  <QuantityInput />
                </QuantityControl>
              </Quantity>
            </FormField>
          </div>
        </div>
      )}

      {quantity.desired < NODE_RANGE.MIN && (
        <OsdsMessage className="mt-4" type={ODS_MESSAGE_TYPE.warning}>
          {t('kubernetes_node_pool_autoscaling_desired_nodes_warning')}
        </OsdsMessage>
      )}
    </div>
  );
}

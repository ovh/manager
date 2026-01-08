import { useMemo } from 'react';

import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { Cart, TCartItem } from '@/components/cart/Cart.component';
import { TClusterPlanEnum } from '@/types';

import { TCreateClusterSchema } from '../CreateClusterForm.schema';

export const CreationCart = () => {
  const { t } = useTranslation(['listing', 'add', 'kube']);

  const form = useFormContext<TCreateClusterSchema>();
  const nameInput = useWatch<TCreateClusterSchema>({ name: 'name' });
  const planInput = useWatch<TCreateClusterSchema>({ name: 'plan' });

  const cartItems = useMemo<Array<TCartItem>>(
    () => [
      {
        title: t('listing:kube_list_title'),
        id: '0',
        name: nameInput,
        details: [
          {
            name: t('kube:kube_service_cluster_plan'),
            description: (
              <Text preset="heading-6">
                {t(`add:kube_add_plan_title_${planInput ?? TClusterPlanEnum.STANDARD}`)}
              </Text>
            ),
          },
        ],
        expanded: true,
      },
    ],
    [nameInput, planInput, t],
  );

  return <Cart items={cartItems} isSubmitDisabled={!form.formState.isValid} />;
};

import { useContext } from 'react';

import { UseMutationResult, useMutation } from '@tanstack/react-query';

import { TApiCustomError } from '@ovh-ux/manager-core-api';
import { Contract } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  ResolvedOrderNode,
  addBackupServicesCartItem,
  addBackupServicesCartItemOption,
  assignOrderCart,
  configureCartItemFromRequirements,
  createOrderCart,
  discoverBackupServicesOrderParameters,
  getOrderCartCheckout,
} from '@/data/api/order/order.requests';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { buildBackupLicensesOrderComposition } from '@/utils/orderComposition/orderComposition';

export type BackupLicensesCartComposition = {
  form: ServerVaultFormState;
  licenseType: LicenseApiValue;
};

export type PreparedBackupLicensesCart = {
  cartId: string;
  contractList: Contract[];
};

const addOrderNodeOptions = async (
  cartId: string,
  parentItemId: number,
  nodes: readonly ResolvedOrderNode[],
  configurationValues: Record<string, string | undefined>,
): Promise<void> => {
  for (const { options, ...parameters } of nodes) {
    const { itemId } = await addBackupServicesCartItemOption(cartId, {
      itemId: parentItemId,
      ...parameters,
    });
    await configureCartItemFromRequirements(cartId, itemId, configurationValues);
    await addOrderNodeOptions(cartId, itemId, options, configurationValues);
  }
};

export const prepareBackupLicensesCart = async ({
  ovhSubsidiary,
  form,
  licenseType,
}: BackupLicensesCartComposition & {
  ovhSubsidiary: string;
}): Promise<PreparedBackupLicensesCart> => {
  const { product, configurationValues } = buildBackupLicensesOrderComposition(form, licenseType);

  const { cartId } = await createOrderCart(ovhSubsidiary);
  const { options, ...productParameters } = await discoverBackupServicesOrderParameters(
    cartId,
    product,
  );
  const { itemId } = await addBackupServicesCartItem(cartId, productParameters);
  await configureCartItemFromRequirements(cartId, itemId, configurationValues);
  await addOrderNodeOptions(cartId, itemId, options, configurationValues);

  await assignOrderCart(cartId);

  const { contracts } = await getOrderCartCheckout(cartId);

  return { cartId, contractList: contracts };
};

export const usePrepareBackupLicensesCart = (): UseMutationResult<
  PreparedBackupLicensesCart,
  TApiCustomError,
  BackupLicensesCartComposition
> => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment.getUser();

  return useMutation({
    mutationFn: (composition: BackupLicensesCartComposition) =>
      prepareBackupLicensesCart({ ...composition, ovhSubsidiary }),
  });
};

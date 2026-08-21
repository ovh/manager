import { useContext } from 'react';

import { UseMutationResult, useMutation } from '@tanstack/react-query';

import { ApiError, TApiCustomError } from '@ovh-ux/manager-core-api';
import { Contract } from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  ResolvedOrderNode,
  addBackupServicesCartItem,
  addBackupServicesCartItemOption,
  addBackupServicesOption,
  assignOrderCart,
  configureCartItemFromRequirements,
  createOrderCart,
  discoverBackupServicesOrderParameters,
  discoverBackupServicesServiceOrderParameters,
  getOrderCartCheckout,
} from '@/data/api/order/order.requests';
import { getBackupServicesTenants } from '@/data/api/tenants/tenants.requests';
import { LicenseApiValue, ServerVaultFormState } from '@/types/Order.type';
import { buildBackupLicensesOrderComposition } from '@/utils/orderComposition/orderComposition';

const TENANT_NOT_FOUND_STATUS = 404;

const findExistingBackupTenantServiceName = async (): Promise<string | undefined> => {
  try {
    const [tenant] = await getBackupServicesTenants();
    return tenant?.currentState.name;
  } catch (error) {
    if ((error as ApiError)?.response?.status === TENANT_NOT_FOUND_STATUS) {
      return undefined;
    }
    throw error;
  }
};

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

const addServiceOrderNode = async (
  cartId: string,
  serviceName: string,
  node: ResolvedOrderNode,
  configurationValues: Record<string, string | undefined>,
): Promise<void> => {
  const { options, ...parameters } = node;
  const { itemId } = await addBackupServicesOption(serviceName, { cartId, ...parameters });
  await configureCartItemFromRequirements(cartId, itemId, configurationValues);
  await addOrderNodeOptions(cartId, itemId, options, configurationValues);
};

export const prepareBackupLicensesCart = async ({
  ovhSubsidiary,
  form,
  licenseType,
}: BackupLicensesCartComposition & {
  ovhSubsidiary: string;
}): Promise<PreparedBackupLicensesCart> => {
  const { product, configurationValues } = buildBackupLicensesOrderComposition(form, licenseType);
  const existingTenantServiceName = await findExistingBackupTenantServiceName();

  const { cartId } = await createOrderCart(ovhSubsidiary);

  if (existingTenantServiceName) {
    await assignOrderCart(cartId);

    for (const node of product.options) {
      const resolved = await discoverBackupServicesServiceOrderParameters(
        cartId,
        existingTenantServiceName,
        node,
      );
      await addServiceOrderNode(cartId, existingTenantServiceName, resolved, configurationValues);
    }
  } else {
    const { options, ...productParameters } = await discoverBackupServicesOrderParameters(
      cartId,
      product,
    );
    const { itemId } = await addBackupServicesCartItem(cartId, productParameters);
    await configureCartItemFromRequirements(cartId, itemId, configurationValues);
    await addOrderNodeOptions(cartId, itemId, options, configurationValues);
    await assignOrderCart(cartId);
  }

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

import { v2, v6 } from '@ovh-ux/manager-core-api';
import { ServiceInfoUpdateEnum } from '@/common/enum/common.enum';
import {
  TDomainContact,
  TMxPlan,
  TServiceInfo,
  TServiceOption,
  TZimbra,
  TZimbraPlateform,
} from '@/common/types/common.types';

export const getServiceInformation = async (
  serviceName: string,
  serviceRoutes: string,
): Promise<TServiceInfo> => {
  const { data: serviceNameId } = await v6.get(
    `/services?resourceName=${serviceName}&routes=${serviceRoutes}`,
  );

  const { data } = await v6.get(`/services/${serviceNameId}`);
  return data;
};

/**
 *  : Update the service (terminate or cancel the terminate)
 */
export const updateService = async (
  serviceName: string,
  terminationPolicy: ServiceInfoUpdateEnum,
  serviceRoute: string,
  useServiceOptions: boolean,
): Promise<TServiceInfo> => {
  // First call to retrieve serviceID in order to update it
  const { data: serviceId } = await v6.get(
    `/services?resourceName=${serviceName}&routes=${serviceRoute}`,
  );
  let serviceIdToTerminate = serviceId as number;

  if (useServiceOptions) {
    const { data: optionId } = await v6.get(`/services/${serviceId}/options`);
    serviceIdToTerminate = optionId;
  }

  const { data } = await v6.put(`/services/${serviceIdToTerminate}`, {
    terminationPolicy,
  });
  return data;
};

/**
 *  : Update the service option(terminate or cancel the terminate)
 */
export const updateServiceOption = async (
  serviceName: string,
  terminationPolicy: ServiceInfoUpdateEnum,
  planCode: string,
  serviceRoute: string,
): Promise<TServiceInfo> => {
  // First call to retrieve serviceID in order to update it
  const { data: serviceId } = await v6.get(
    `/services?resourceName=${serviceName}&routes=${serviceRoute}`,
  );

  const { data: optionsDetails } = await v6.get<TServiceOption[]>(
    `/services/${serviceId}/options`,
  );

  const optionDetails = optionsDetails.find(
    (option) => option.billing.plan.code === planCode,
  );
  const { data } = await v6.put(`/services/${optionDetails.serviceId}`, {
    terminationPolicy,
  });
  return data;
};

export const getDomainContact = async (
  contactID: string,
): Promise<TDomainContact> => {
  const { data } = await v6.get(`/domain/contact/${contactID}`);
  return data;
};

export const getZimbra = async (serviceName: string): Promise<TZimbra[]> => {
  const { data: zimbraPlateform } = await v2.get<TZimbraPlateform[]>(
    `/zimbra/platform`,
  );

  const { data: zimbraDetails } = await v2.get<TZimbra[]>(
    `/zimbra/platform/${zimbraPlateform[0].id}/domain?domainName=${serviceName}`,
  );
  if (zimbraDetails.length > 0) {
    return zimbraDetails.map((val) => ({
      ...val,
      plateformId: zimbraPlateform[0].id,
    }));
  }

  return zimbraDetails;
};

export const getMXPlan = async (serviceName: string): Promise<TMxPlan> => {
  const { data: mxPlan } = await v6.get(`/email/domain/${serviceName}`);
  return mxPlan;
};

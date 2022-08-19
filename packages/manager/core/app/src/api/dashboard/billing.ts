import { checkFeaturesAvailability } from '@/api/features';
import { getServiceInfos } from '@/api/nutanix';
import { getServiceDetails } from '@/api/service';
import { OvhContextShellType } from '@/core';

import { SERVICE_TYPE } from '@/consts/services';

export type BillingData = {
  autorenewLink?: string;
  billingLink: string;
  buyingLink?: string;
  canDeleteAtExpiration: boolean;
  contactManagemenLink: string;
  // contacts linked to this service
  contacts: BillingContacts;
  // creation date
  creationDate: Date;
  engagedUpTo?: string;
  engagementDetails?: EngagementDetails;
  featureBillingManagementAvailable: boolean;
  featureContactAvailable: boolean;
  featureContactManagementAvailable: boolean;
  // service id (e.g. '123456789')
  id: number;
  // next payment date
  nextBillingDate: Date;
  recreditLink?: string;
  // data about renew process
  renewalMode: RenewalMode;
  // same as service name?
  serviceId: string;
  // service name (e.g. 'my-awesome-cluster')
  serviceName: string;
  // service type (e.g. 'NUTANIX', 'SMS'...)
  serviceType: string;
  // current service status (e.g. 'active')
  status: string;
  // path with service type & name (e.g. '/my-service-type/my-awesome-cluster')
  url: string;
};

export type BillingContacts = {
  // nic linked to administrator contact
  admin: string;
  // nic linked to billing contact
  billing: string;
  // nic linked to technical contact
  tech: string;
};

type EngagementDetails = {
  endRule?: EndRule;
}

type EndRule = {
  possibleStrategies: string[];
  strategy: string;
}

type RenewalMode = {
  // whether or not renewal is automatically renewed
  automatic: boolean;
  deleteAtExpiration: boolean;
  forced: boolean;
  manualPayment: boolean;
  // whether or not the renew is automatic (either 'automatic' or 'manual')
  type: string; // TODO stop using this and simply use automatic field?
};

export async function fetchBillingData(serviceName: string, shell: OvhContextShellType): Promise<BillingData> {
  const serviceType = SERVICE_TYPE.NUTANIX; // TODO pass that from parent

  const serviceInfos = await getServiceInfos(serviceName);
  const serviceDetails = await getServiceDetails(serviceInfos?.serviceId);
  const features = await checkFeaturesAvailability(
    [ 'billing:management', 'contact', 'contact:management' ],
    'dedicated'
  );
  const featureBillingManagementAvailable = features['billing:management'];
  const featureContactAvailable = features['contact'];
  const featureContactManagementAvailable = features['contact:management'];

  const autorenewLink = featureBillingManagementAvailable ? (
    `${await shell.navigation.getURL('dedicated', '#/billing/autorenew', null)}`
  ) : null;
  const billingLink = `${await shell.navigation.getURL(
    'dedicated', '#/billing/history',
    undefined
  )}`;
  const contactManagemenLink = `${await shell.navigation.getURL(
    'dedicated',
    '#/contacts/services',
    { serviceName: serviceInfos.domain },
  )}`;

  let buyingLink;
  let recreditLink;
  if (serviceType === SERVICE_TYPE.SMS) {
    buyingLink = `${await shell.navigation.getURL(
      'telecom', '#/sms/:serviceName/order',
      { serviceName: this.serviceId },
    )}`;
    recreditLink = `${await shell.navigation.getURL(
      'telecom', '#/sms/:serviceName/options/recredit',
      { serviceName: this.serviceId },
    )}`;
  }

  const data: BillingData = {
    autorenewLink,
    billingLink,
    buyingLink,
    canDeleteAtExpiration: serviceInfos?.canDeleteAtExpiration,
    contactManagemenLink,
    contacts: {
      admin: serviceInfos?.contactAdmin,
      billing: serviceInfos?.contactBilling,
      tech: serviceInfos?.contactTech,
    },
    creationDate: new Date(serviceDetails?.billing?.lifecycle?.current?.creationDate),
    engagedUpTo: serviceInfos?.engagedUpTo,
    engagementDetails: serviceDetails?.billing?.engagement,
    featureBillingManagementAvailable,
    featureContactAvailable,
    featureContactManagementAvailable,
    id: serviceInfos?.serviceId,
    nextBillingDate: new Date(serviceDetails?.billing?.nextBillingDate),
    recreditLink,
    renewalMode: {
      automatic: serviceInfos?.renew?.automatic,
      deleteAtExpiration: serviceInfos?.renew?.deleteAtExpiration,
      forced: serviceInfos?.renew?.forced,
      manualPayment: serviceInfos?.renew?.manualPayment,
      type: serviceInfos?.renew?.automatic === true ? 'automatic' : 'manual',
    },
    serviceId: serviceInfos?.domain,
    serviceName,
    serviceType,
    status: serviceInfos?.status,
    url: serviceDetails?.route?.url,
  };

  return data;
}

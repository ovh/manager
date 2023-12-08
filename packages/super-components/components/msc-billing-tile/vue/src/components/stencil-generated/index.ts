/* eslint-disable */
/* tslint:disable */
/* auto-generated vue proxies */
import { defineContainer } from './vue-component-lib/utils';

import type { JSX } from '@ovhcloud/msc-stencil-billing-tile/custom-elements';

import { defineCustomElement as defineMenuCustom } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/menu-custom.js';
import { defineCustomElement as defineMscBillingCommitment } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/msc-billing-commitment.js';
import { defineCustomElement as defineMscBillingContact } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/msc-billing-contact.js';
import { defineCustomElement as defineMscBillingOffer } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/msc-billing-offer.js';
import { defineCustomElement as defineMscBillingRenewal } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/msc-billing-renewal.js';
import { defineCustomElement as defineMscBillingTile } from '@ovhcloud/msc-stencil-billing-tile/custom-elements/msc-billing-tile.js';


export const MenuCustom = /*@__PURE__*/ defineContainer<JSX.MenuCustom>('menu-custom', defineMenuCustom);


export const MscBillingCommitment = /*@__PURE__*/ defineContainer<JSX.MscBillingCommitment>('msc-billing-commitment', defineMscBillingCommitment, [
  'servicePath',
  'nextBillingDate',
  'locale',
  'localeStrings',
  'serviceDetails',
  'commitmentDataTracking',
  'urls'
]);


export const MscBillingContact = /*@__PURE__*/ defineContainer<JSX.MscBillingContact>('msc-billing-contact', defineMscBillingContact, [
  'serviceName',
  'serviceType',
  'serviceInfos',
  'changeOwnerDataTracking',
  'updateOwnerDataTracking',
  'subscriptionManagementDataTracking',
  'localeStrings',
  'urls'
]);


export const MscBillingOffer = /*@__PURE__*/ defineContainer<JSX.MscBillingOffer>('msc-billing-offer', defineMscBillingOffer, [
  'serviceType',
  'servicePath',
  'serviceInfos',
  'serviceDetails',
  'changeOfferDataTracking',
  'localeStrings',
  'urls'
]);


export const MscBillingRenewal = /*@__PURE__*/ defineContainer<JSX.MscBillingRenewal>('msc-billing-renewal', defineMscBillingRenewal, [
  'renewLinkDataTracking',
  'cancelResiliationDataTracking',
  'manageRenewDataTracking',
  'resiliateDataTracking',
  'anticipateRenewDataTracking',
  'urls',
  'serviceName',
  'serviceType',
  'servicePath',
  'nextBillingDate',
  'serviceInfos',
  'serviceDetails',
  'localeStrings'
]);


export const MscBillingTile = /*@__PURE__*/ defineContainer<JSX.MscBillingTile>('msc-billing-tile', defineMscBillingTile, [
  'locale',
  'servicePath',
  'appPublicUrl',
  'region',
  'subsidiary',
  'commitmentDataTracking',
  'changeOwnerDataTracking',
  'updateOwnerDataTracking',
  'subscriptionManagementDataTracking',
  'renewLinkDataTracking',
  'cancelResiliationDataTracking',
  'manageRenewDataTracking',
  'resiliateDataTracking',
  'anticipateRenewDataTracking',
  'changeOfferDataTracking'
]);


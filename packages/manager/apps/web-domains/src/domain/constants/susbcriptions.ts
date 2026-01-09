export const contactsMapping: Record<string, string> = {
  contactOwner: 'domain_tab_general_information_subscription_contact_owner',
  contactAdministrator:
    'domain_tab_general_information_subscription_contact_administrator',
  contactBilling: 'domain_tab_general_information_subscription_contact_billing',
  contactTechnical:
    'domain_tab_general_information_subscription_contact_technical',
};

export const domainIsPremium = (pricingMode: string) => {
  return pricingMode.includes('premium');
};

export const emailOfferRedirect = 'redirect';

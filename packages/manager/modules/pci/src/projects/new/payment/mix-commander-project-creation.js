export const getMixCommanderProjectCreationScript = (
  orderAmoutTaxFree,
  currencyCode,
  paymentMethod,
  discountPrice,
  isNewCustomer,
) => {
  window.tC = window.tC || {};
  window.tC.msr = window.tC.msr || [];

  // eslint-disable-next-line camelcase
  const params = new URLSearchParams(window.parent.tC?.msr?.additional_params);

  window.tC.msr.dns = window.parent.tC?.msr?.dns;
  // eslint-disable-next-line camelcase
  window.tC.msr.id_site = window.parent.tC?.msr?.id_site;
  window.tC.msr.idorder =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 12)
      .padStart(12, 0);
  window.tC.msr.amount = orderAmoutTaxFree;
  window.tC.msr.currency = currencyCode;
  window.tC.msr.user_id = params.get('user_id');

  window.tC.msr.additional_params = `&dev=${window.parent.tC?.detectDevice()}`;
  window.tC.msr.additional_params += `&cty=${params.get('cty')}`;
  window.tC.msr.additional_params += `&moyens_de_paiement=${paymentMethod}&discount_price=${discountPrice}`;
  window.tC.msr.additional_params += `&n_customer=${isNewCustomer}&nc=${isNewCustomer}&site_domain=${params.get(
    'site_domain',
  )}`;
  window.tC.msr.additional_params += '&pcat=publiccloud';
  window.tC.msr.additional_params += '&ot=pci_project_creation';
  window.tC.msr.additional_params += '&newcustom=0';

  const conversionTimestamp = new Date();

  const conversionTimestampString = `${conversionTimestamp.getFullYear()}-${String(
    conversionTimestamp.getMonth() + 1,
  ).padStart(2, '0')}-${String(conversionTimestamp.getDate()).padStart(
    2,
    '0',
  )} ${String(conversionTimestamp.getHours()).padStart(2, '0')}:${String(
    conversionTimestamp.getMinutes(),
  ).padStart(2, '0')}:${String(conversionTimestamp.getSeconds()).padStart(
    2,
    '0',
  )} Europe/Paris`;

  window.tC.msr.additional_params += `&conversion_timestamp=${conversionTimestampString}`;

  window.tC.msr.tc_rand = Math.random();
  window.tC.msr.pixel = document.createElement('img');
  window.tC.msr.pixel.style.display = 'none';
  window.tC.msr.pixel.src = `https://${window.tC.msr.dns}/mix/o3/?tcs=${window.tC.msr.id_site}&idorder=${window.tC.msr.idorder}&amount=${window.tC.msr.amount}&currency=${window.tC.msr.currency}&user_id=${window.tC.msr.user_id}${window.tC.msr.additional_params}&rand=${window.tC.msr.tc_rand}`;
  document.head.appendChild(window.tC.msr.pixel);
  return null;
};

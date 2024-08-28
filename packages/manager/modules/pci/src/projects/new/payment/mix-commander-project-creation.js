const getMixCommanderProjectCreationScript = (
  userId,
  region,
  orderAmoutTaxFree,
  currencyCode,
  paymentMethod,
  discountPrice,
  isNewCustomer,
) => {
  if (typeof window.tC === 'undefined') {
    window.tC = {
      detect_device() {
        const ua = navigator ? navigator.userAgent : 'No User-Agent Provided';

        if (
          ua.match(
            /GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE-HTML/i,
          )
        ) {
          return 'tv';
        }
        if (ua.match(/Xbox|PLAYSTATION.3|Wii/i)) {
          return 'tv';
        }
        if (
          ua.match(/iPad/i) ||
          (ua.match(/tablet/i) && !ua.match(/RX-34/i)) ||
          ua.match(/FOLIO/i)
        ) {
          return 'tablet';
        }
        if (
          ua.match(/Linux/i) &&
          ua.match(/Android/i) &&
          !ua.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i)
        ) {
          return 'tablet';
        }
        if (ua.match(/Kindle/i) || (ua.match(/Mac.OS/i) && ua.match(/Silk/i))) {
          return 'tablet';
        }
        if (
          ua.match(
            /GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i,
          ) ||
          (ua.match(/MB511/i) && ua.match(/RUTEM/i))
        ) {
          return 'tablet';
        }
        if (
          ua.match(
            /BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i,
          )
        ) {
          return 'mobile';
        }
        if (
          ua.match(/Opera/i) &&
          ua.match(/Windows.NT.5/i) &&
          ua.match(/HTC|Xda|Mini|Vario|SAMSUNG-GT-i8000|SAMSUNG-SGH-i9/i)
        ) {
          return 'mobile';
        }
        if (
          (ua.match(/Windows.(NT|XP|ME|9)/) && !ua.match(/Phone/i)) ||
          ua.match(/Win(9|.9|NT)/i)
        ) {
          return 'desktop';
        }
        if (ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i)) {
          return 'desktop';
        }
        if (ua.match(/Linux/i) && ua.match(/X11/i)) {
          return 'desktop';
        }
        if (ua.match(/Solaris|SunOS|BSD/i)) {
          return 'desktop';
        }
        if (
          ua.match(
            /Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i,
          ) &&
          !ua.match(/Mobile/i)
        ) {
          return 'desktop';
        }
        return 'mobile';
      },
    };
  }

  if (typeof window.tC.msr !== 'object') {
    window.tC.msr = [];
  }
  window.tC.msr.dns = 'ovh.commander1.com';
  window.tC.msr.id_site = '3810';
  window.tC.msr.idorder =
    Date.now().toString(36) +
    Math.random()
      .toString(36)
      .substring(2, 12)
      .padStart(12, 0);
  window.tC.msr.amount = orderAmoutTaxFree;
  window.tC.msr.currency = currencyCode;
  window.tC.msr.user_id = userId;

  window.tC.msr.additional_params = `&dev=${window.tC.detect_device()}`;
  window.tC.msr.additional_params += `&cty=${region}`;

  window.tC.msr.additional_params += `&moyens_de_paiement=${paymentMethod}&discount_price=${discountPrice}`;
  window.tC.msr.additional_params += `&n_customer=${isNewCustomer}&nc=${isNewCustomer}&site_domain=www.ovh.com`;
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

const mixCommanderProjectCreation = ({
  userId,
  region,
  orderAmoutTaxFree,
  currencyCode,
  paymentMethod,
  discountPrice,
  isNewCustomer,
}) => {
  getMixCommanderProjectCreationScript(
    userId,
    region,
    orderAmoutTaxFree,
    currencyCode,
    paymentMethod,
    discountPrice,
    isNewCustomer,
  );
};

export default mixCommanderProjectCreation;

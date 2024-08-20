const getMixCommanderProjectCreationScript = (
  clientId,
  region,
  orderAmoutTaxFree,
  currencyCode,
  paymentMethod,
  discountPrice,
  isNewCustomer,
) => `
if (typeof window.tC === "undefined") {
    window.tC = {
        "detect_device": function() {
            var ua = (navigator ? navigator.userAgent : 'No User-Agent Provided');
            return ua.match(/GoogleTV|SmartTV|Internet.TV|NetCast|NETTV|AppleTV|boxee|Kylo|Roku|DLNADOC|CE-HTML/i) ? 'tv' : ua.match(/Xbox|PLAYSTATION.3|Wii/i) ? 'tv' : ua.match(/iPad/i) || ua.match(/tablet/i) && !ua.match(/RX-34/i) || ua.match(/FOLIO/i) ? 'tablet' : ua.match(/Linux/i) && ua.match(/Android/i) && !ua.match(/Fennec|mobi|HTC.Magic|HTCX06HT|Nexus.One|SC-02B|fone.945/i) ? 'tablet' : ua.match(/Kindle/i) || ua.match(/Mac.OS/i) && ua.match(/Silk/i) ? 'tablet' : ua.match(/GT-P10|SC-01C|SHW-M180S|SGH-T849|SCH-I800|SHW-M180L|SPH-P100|SGH-I987|zt180|HTC(.Flyer|_Flyer)|Sprint.ATP51|ViewPad7|pandigital(sprnova|nova)|Ideos.S7|Dell.Streak.7|Advent.Vega|A101IT|A70BHT|MID7015|Next2|nook/i) || ua.match(/MB511/i) && ua.match(/RUTEM/i) ? 'tablet' : ua.match(/BOLT|Fennec|Iris|Maemo|Minimo|Mobi|mowser|NetFront|Novarra|Prism|RX-34|Skyfire|Tear|XV6875|XV6975|Google.Wireless.Transcoder/i) ? 'mobile' : ua.match(/Opera/i) && ua.match(/Windows.NT.5/i) && ua.match(/HTC|Xda|Mini|Vario|SAMSUNG-GT-i8000|SAMSUNG-SGH-i9/i) ? 'mobile' : ua.match(/Windows.(NT|XP|ME|9)/) && !ua.match(/Phone/i) || ua.match(/Win(9|.9|NT)/i) ? 'desktop' : ua.match(/Macintosh|PowerPC/i) && !ua.match(/Silk/i) ? 'desktop' : ua.match(/Linux/i) && ua.match(/X11/i) ? 'desktop' : ua.match(/Solaris|SunOS|BSD/i) ? 'desktop' : ua.match(/Bot|Crawler|Spider|Yahoo|ia_archiver|Covario-IDS|findlinks|DataparkSearch|larbin|Mediapartners-Google|NG-Search|Snappy|Teoma|Jeeves|TinEye/i) && !ua.match(/Mobile/i) ? 'desktop' : 'mobile';
        }
    };
}
var discount_price = "";
if (typeof tC.msr !== "object") {
    tC.msr = [];
}
tC.msr.dns = 'ovh.commander1.com';
tC.msr.id_site = '3810';
tC.msr.idorder = (Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0));
tC.msr.amount = "${orderAmoutTaxFree}";
tC.msr.currency = "${currencyCode}";
tC.msr.user_id = "${clientId}";
tC.msr.additional_params = '&dev=' + tC.detect_device();
tC.msr.additional_params += '&cty=' + "${region}";
tC.msr.additional_params += '&moyens_de_paiement=' + "${paymentMethod}" + '&discount_price=' + "${discountPrice}";
tC.msr.additional_params += '&n_customer=' + "${isNewCustomer}" + '&nc=' + "${isNewCustomer}" + '&site_domain=' + "www.ovh.com";
tC.msr.additional_params += '&pcat=' + 'publiccloud';
tC.msr.additional_params += '&ot=' + 'pci_project_creation';
tC.msr.additional_params += '&newcustom=0';
var conversionTimestamp = new Date();
tC.msr.additional_params += '&conversion_timestamp=' + conversionTimestamp.getFullYear() + '-' + ("0" + (conversionTimestamp.getMonth() + 1)).slice(-2) + '-' + ("0" + conversionTimestamp.getDate()).slice(-2) + ' ' + ("0" + conversionTimestamp.getHours()).slice(-2) + ':' + ("0" + conversionTimestamp.getMinutes()).slice(-2) + ':' + ("0" + conversionTimestamp.getSeconds()).slice(-2) + ' ' + 'Europe/Paris';
tC.msr.tc_rand = Math.random();
tC.msr.pixel = document.createElement("img");
tC.msr.pixel.style.display = "none";
tC.msr.pixel.src = ('https://' + tC.msr.dns + '/mix/o3/?tcs=' + tC.msr.id_site + '&idorder=' + tC.msr.idorder + '&amount=' + tC.msr.amount + '&currency=' + tC.msr.currency + '&user_id=' + tC.msr.user_id + tC.msr.additional_params + '&rand=' + tC.msr.tc_rand);
document.head.appendChild(tC.msr.pixel);
`;

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

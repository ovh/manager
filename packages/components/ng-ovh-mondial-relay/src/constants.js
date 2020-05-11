import defaultImage from './assets/default.png';
import gmapsPr02AImage from './assets/gmaps_pr02A.png';
import gmapsPr02BImage from './assets/gmaps_pr02B.png';
import gmapsPr02CImage from './assets/gmaps_pr02C.png';
import gmapsPr02DImage from './assets/gmaps_pr02D.png';
import gmapsPr02EImage from './assets/gmaps_pr02E.png';
import gmapsPr02FImage from './assets/gmaps_pr02F.png';
import gmapsPr02GImage from './assets/gmaps_pr02G.png';
import gmapsPr02HImage from './assets/gmaps_pr02H.png';
import gmapsPr02IImage from './assets/gmaps_pr02I.png';
import gmapsPr02JImage from './assets/gmaps_pr02J.png';
import gmapsPr02KImage from './assets/gmaps_pr02K.png';
import gmapsPr02LImage from './assets/gmaps_pr02L.png';
import gmapsPr02MImage from './assets/gmaps_pr02M.png';
import gmapsPr02NImage from './assets/gmaps_pr02N.png';
import gmapsPrShadowImage from './assets/gmaps_pr_shadow.png';

export const PICTURES = {
  default: defaultImage,
  gmaps_pr02A: gmapsPr02AImage,
  gmaps_pr02B: gmapsPr02BImage,
  gmaps_pr02C: gmapsPr02CImage,
  gmaps_pr02D: gmapsPr02DImage,
  gmaps_pr02E: gmapsPr02EImage,
  gmaps_pr02F: gmapsPr02FImage,
  gmaps_pr02G: gmapsPr02GImage,
  gmaps_pr02H: gmapsPr02HImage,
  gmaps_pr02I: gmapsPr02IImage,
  gmaps_pr02J: gmapsPr02JImage,
  gmaps_pr02K: gmapsPr02KImage,
  gmaps_pr02L: gmapsPr02LImage,
  gmaps_pr02M: gmapsPr02MImage,
  gmaps_pr02N: gmapsPr02NImage,
  gmaps_pr_shadow: gmapsPrShadowImage,
};

export const MONDIAL_RELAY = {
  weekDays: [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ],
  iconSize: [30, 36], // size of the icon
  shadowSize: [41, 26], // size of the shadow
  iconAnchor: [15, 36], // point of the icon which will correspond to marker's location
  shadowAnchor: [6, 22], // the same for the shadow
  popupAnchor: [-3, -36], // point from which the popup should open relative to the iconAnchor,
  initialBoundingBox: [
    [51.201, -4.056],
    [42.466, 7.923],
  ],
  initialLocation: {
    lat: 45.8556,
    lng: 2.3466,
    zoom: 5,
  },
  defaultCountry: 'fr',
  ipLocUrl: 'https://freegeoip.net/json/',
  metroFrZipValidator: /^((0[1-9])|([1-8][0-9])|(9[0-8])|(2A)|(2B))[0-9]{3}$/,
};

export const MONDIAL_RELAY_ELEMENT = 'ovh-mondial-relay';

export default {
  MONDIAL_RELAY,
  MONDIAL_RELAY_ELEMENT,
  PICTURES,
};

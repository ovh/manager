import dataAdp from './assets/Hero16-9_Data_ADP.png';
import orchestrationKs8 from './assets/Hero16-9_Orchestration_Ks8.png';
import orchestrationPrivateImageCatalogue from './assets/Hero16-9_Orchestration_PrivateImageCatalogue.png';
import stockageBlockStorage from './assets/Hero16-9_Stockage_BlockStorage.png';
import stockageCloudArchive from './assets/Hero16-9_Stockage_CloudArchive.png';
import stockageInstanceBackup from './assets/Hero16-9_Stockage_InstanceBackup.png';
import stockageObjectStorage from './assets/Hero16-9_Stockage_ObjectStorage.png';
import stockageSnapshotVolume from './assets/Hero16-9_Stockage_SnapshotVolume.png';

export const GUIDE_URLS = {
  DE: 'https://docs.ovh.com/de/public-cloud/',
  CZ: 'https://docs.ovh.com/cz/cs/public-cloud/',
  ASIA: 'https://docs.ovh.com/asia/en/public-cloud/',
  AU: 'https://docs.ovh.com/au/en/public-cloud/',
  GB: 'https://docs.ovh.com/gb/en/public-cloud/',
  IE: 'https://docs.ovh.com/ie/en/public-cloud/',
  SG: 'https://docs.ovh.com/sg/en/public-cloud/',
  US: 'https://docs.ovh.com/us/en/public-cloud/',
  ES: 'https://docs.ovh.com/es/public-cloud/',
  FI: 'https://docs.ovh.com/fi/public-cloud/',
  CA: 'https://docs.ovh.com/ca/fr/public-cloud/',
  FR: 'https://docs.ovh.com/fr/public-cloud/',
  IT: 'https://docs.ovh.com/it/public-cloud/',
  LT: 'https://docs.ovh.com/lt/public-cloud/',
  NL: 'https://docs.ovh.com/nl/public-cloud/',
  PL: 'https://docs.ovh.com/pl/public-cloud/',
  PT: 'https://docs.ovh.com/pt/public-cloud/',
};

export const SLIDE_ANIMATION_INTERVAL = 5000;

export const SLIDE_IMAGES = [
  dataAdp,
  orchestrationKs8,
  orchestrationPrivateImageCatalogue,
  stockageBlockStorage,
  stockageCloudArchive,
  stockageInstanceBackup,
  stockageObjectStorage,
  stockageSnapshotVolume,
];

export default {
  GUIDE_URLS,
  SLIDE_ANIMATION_INTERVAL,
  SLIDE_IMAGES,
};

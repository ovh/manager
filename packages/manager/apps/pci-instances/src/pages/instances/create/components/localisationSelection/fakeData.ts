import { TLocalizationCardProps } from '@/components/localizationCard/LocalizationCard.component';

// TODO: fake data to remove after api plug
export const localizations: TLocalizationCardProps[] = [
  {
    title: 'Paris',
    region: 'eu-west-par',
    countryCode: 'fr',
    deploymentMode: '3AZ',
  },
  {
    title: 'Strasbourg',
    region: 'eu-west-sbg',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Gravelines',
    region: 'eu-west-gra',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Varosvie',
    region: 'WAW1',
    countryCode: 'pl',
    deploymentMode: '1AZ',
  },
  {
    title: 'Francfort',
    region: 'DE1',
    countryCode: 'de',
    deploymentMode: '1AZ',
  },
  {
    title: 'Roubaix',
    region: 'eu-west-rbx',
    countryCode: 'fr',
    deploymentMode: '1AZ',
  },
  {
    title: 'Bucarest',
    region: 'eu-central-lz-buh-a',
    countryCode: 'ro',
    deploymentMode: 'LZ',
  },
  {
    title: 'Londres',
    region: 'UK1',
    countryCode: 'gb',
    deploymentMode: '1AZ',
  },
];

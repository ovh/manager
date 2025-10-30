import { GuideMenuItem } from '@ovh-ux/muk';

export const useGuideItems = (t: (key: string) => string): GuideMenuItem[] => [
  {
    id: 1,
    href: 'www.ovh.com',
    target: '_blank',
    label: t('test'),
  }, // @todo: to change soon the guides are availables
];

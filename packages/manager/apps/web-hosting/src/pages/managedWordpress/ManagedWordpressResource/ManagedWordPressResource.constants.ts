import { GuideItem } from '@ovh-ux/manager-react-components';

export const useGuideItems = (t: (key: string) => string): GuideItem[] => [
  {
    id: 1,
    href: 'www.ovh.com',
    target: '_blank',
    label: t('test'),
  }, // @todo: to change soon the guides are availables
];

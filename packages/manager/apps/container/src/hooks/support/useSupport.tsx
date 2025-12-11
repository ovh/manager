import { useShell } from '@/context';
import { useURL, ContentURLS } from '@/container/common/urls-constants';

export const useSupport = (): string => {
  const shell = useShell();
  const environment = shell.getPlugin('environment').getEnvironment();
  const urls = useURL(environment);
  const region = environment.getRegion();
  const ticketLink =
    region === 'US'
      ? {
          id: 'tickets',
          translation: 'sidebar_assistance_tickets',
          isExternal: false,
          routing: {
            application: 'dedicated',
            hash: '#/ticket',
          },
          hasService: false,
          region: ['US'],
        }
      : {
          id: 'tickets',
          translation: 'sidebar_assistance_tickets',
          isExternal: true,
          url: 'support',
          hasService: false,
          region: ['EU', 'CA'],
        };
  return urls.get(ticketLink.url as keyof ContentURLS);
};

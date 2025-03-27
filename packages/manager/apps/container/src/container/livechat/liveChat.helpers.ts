import { SnowChatContext } from '@/types/live-chat.type';
import { SupportLevel } from '@ovh-ux/manager-config';
import { adriellyChatUrl } from './liveChat.constants';

/**
 * Utility function to construct query parameters
 * @param {Record<string, string | undefined>} params - An object containing query parameters as key-value pairs
 * @returns {string} - A query string
 */
export const constructQueryParams = (
  params: Record<string, string | undefined>,
): string => {
  return Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `sysparm_${key}=${encodeURIComponent(value)}`)
    .join('&');
};

export const generateSnowChatUrl = (
  instance: string,
  context: SnowChatContext,
) => {
  return `${instance}/sn_va_web_client_app_embed.do?${constructQueryParams(
    context,
  )}`;
};

export const getCustomerLevel = (level: string) => {
  switch (level) {
    case 'standard':
      return 'STD';
    case 'premium':
      return 'PRM';
    case 'business':
      return 'BUS';
    case 'enterprise':
      return 'ENT';
    case 'premium-accredited':
      return 'PRP';
    default:
      return 'STD';
  }
};

export const generateAdriellyChatUrl = (
  ovhSupportLevel: SupportLevel,
  ovhSubsidiary: string,
  language: string,
) => adriellyChatUrl(getCustomerLevel(ovhSupportLevel.level), ovhSubsidiary.toUpperCase(), language);

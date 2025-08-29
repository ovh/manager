import { Contact } from '@/data/types/notification.type';

export function getCleanEmail(mailAddress: string): string {
  // <(\w+([\.\-\+]?\w+)*@\w+([\.\-]?\w+)*(\.\w+)+)> if we want it to be more strict
  return /<(.*)>/.exec(mailAddress)?.[1] ?? mailAddress ?? '';
}

/**
 * Look through the contacts and return the first email address without any formatting
 * @param contacts array of contacts from the notification
 * @returns the first email address without any formatting or null if none found
 */
export function getFirstCleanEmail(contacts: Contact[]): string | null {
  return (
    getCleanEmail(
      contacts.find((contact) => contact.type === 'EMAIL')?.to ?? '',
    ) ?? null
  );
}

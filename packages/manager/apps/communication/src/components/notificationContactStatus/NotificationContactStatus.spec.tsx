import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import NotificationContactStatus from './NotificationContactStatus.component';
import { Contact } from '@/data/types';

const mockedContacts: Contact[] = [
  {
    error: null,
    id: '610660a7-3a5d-4725-9c20-8a106a383394',
    sentAt: '2025-01-01T13:00:00+00:00',
    status: 'SENT',
    to: 'test@example.com',
    type: 'EMAIL',
  },
  {
    error: 'Email queued',
    id: '01978dd8-0a35-70c0-bf90-b90a6deee881',
    sentAt: '2025-01-01T14:00:00+00:00',
    status: 'QUEUED',
    to: 'test2@example.com',
    type: 'EMAIL',
  },
  {
    error: 'Email bounced',
    id: '01978dd8-0a35-70c0-bf90-b90a6d94e881',
    sentAt: '2025-01-01T14:00:00+00:00',
    status: 'DROPPED',
    to: 'test2@example.com',
    type: 'EMAIL',
  },
];

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
  Trans: ({
    i18nKey,
    t,
  }: {
    i18nKey: string;
    t: (key: string) => string;
    values: Record<string, string>;
    components: Record<string, React.ReactNode>;
  }) => <span>{t(i18nKey)}</span>,
}));

describe('NotificationPriorityChip.component', () => {
  it.each([
    mockedContacts.map((contact) => ({
      notificationId: '01975e44-9b60-77b4-8af3-58efdcd12e90',
      contacts: [contact],
    })),
  ])(
    'should render with the the severity color',
    ({ notificationId, contacts }) => {
      const { container } = render(
        <NotificationContactStatus
          notificationId={notificationId}
          contacts={contacts}
        />,
      );
      const contactStatusElement = container.querySelector('ods-icon');
      if (contacts[0].status === 'SENT') {
        expect(contactStatusElement).not.toBeInTheDocument();
        return;
      }

      expect(contactStatusElement).toBeInTheDocument();
      expect(contactStatusElement).toHaveAttribute(
        'name',
        ODS_ICON_NAME.triangleExclamation,
      );

      if (contacts[0].status === 'DROPPED') {
        expect(contactStatusElement).toHaveClass(
          'text-[--ods-color-critical-500]',
        );
      } else {
        expect(contactStatusElement).toHaveClass(
          'text-[--ods-color-warning-500]',
        );
      }
    },
  );

  it('should pick the highest severity contact (dropped)', () => {
    const { container } = render(
      <NotificationContactStatus
        notificationId="01975e44-9b60-77b4-8af3-58efdcd12e90"
        contacts={mockedContacts}
      />,
    );
    const contactStatusElement = container.querySelector('ods-icon');
    expect(contactStatusElement).toHaveClass('text-[--ods-color-critical-500]');
  });
});

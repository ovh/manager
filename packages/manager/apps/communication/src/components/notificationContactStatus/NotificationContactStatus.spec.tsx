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
    error: null,
    id: '01978dd8-0a35-70c0-bf90-b90a6d94e881',
    sentAt: '2025-01-01T14:00:00+00:00',
    status: 'BOUNCED' as Contact['status'],
    to: 'test3@example.com',
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

describe('NotificationContactStatus.component', () => {
  it('should not render when no contact has error or BOUNCED status', () => {
    const contactWithoutError = mockedContacts[0];
    if (!contactWithoutError) {
      throw new Error('Test contact not found');
    }
    const { container } = render(
      <NotificationContactStatus
        notificationId="01975e44-9b60-77b4-8af3-58efdcd12e90"
        contacts={[contactWithoutError]}
      />,
    );
    const contactStatusElement = container.querySelector('ods-icon');
    expect(contactStatusElement).not.toBeInTheDocument();
  });

  it('should render when a contact has an error', () => {
    const contactWithError = mockedContacts[1];
    if (!contactWithError) {
      throw new Error('Test contact not found');
    }
    const { container } = render(
      <NotificationContactStatus
        notificationId="01975e44-9b60-77b4-8af3-58efdcd12e90"
        contacts={[contactWithError]}
      />,
    );
    const contactStatusElement = container.querySelector('ods-icon');
    expect(contactStatusElement).toBeInTheDocument();
    expect(contactStatusElement).toHaveAttribute(
      'name',
      ODS_ICON_NAME.triangleExclamation,
    );
    expect(contactStatusElement).toHaveClass(
      'text-[var(--ods-color-warning-500)]',
    );
  });

  it('should render when a contact has BOUNCED status', () => {
    const contactWithBounced = mockedContacts[2];
    if (!contactWithBounced) {
      throw new Error('Test contact not found');
    }
    const { container } = render(
      <NotificationContactStatus
        notificationId="01975e44-9b60-77b4-8af3-58efdcd12e90"
        contacts={[contactWithBounced]}
      />,
    );
    const contactStatusElement = container.querySelector('ods-icon');
    expect(contactStatusElement).toBeInTheDocument();
    expect(contactStatusElement).toHaveAttribute(
      'name',
      ODS_ICON_NAME.triangleExclamation,
    );
    expect(contactStatusElement).toHaveClass(
      'text-[var(--ods-color-warning-500)]',
    );
  });

  it('should pick the first contact with error or BOUNCED status', () => {
    const { container } = render(
      <NotificationContactStatus
        notificationId="01975e44-9b60-77b4-8af3-58efdcd12e90"
        contacts={mockedContacts}
      />,
    );
    const contactStatusElement = container.querySelector('ods-icon');
    expect(contactStatusElement).toBeInTheDocument();
    expect(contactStatusElement).toHaveClass(
      'text-[var(--ods-color-warning-500)]',
    );
  });
});

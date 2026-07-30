import React from 'react';

import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithProviders } from '@/test-utils/renderWithProviders';

import ContactsList from './ContactsList.component';

const { useNavigationGetUrlMock } = vi.hoisted(() => ({
  useNavigationGetUrlMock: vi.fn().mockReturnValue({ data: 'https://account.example.com' }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', async () => {
  const actual = await vi.importActual('@ovh-ux/manager-react-shell-client');
  return { ...actual, useNavigationGetUrl: useNavigationGetUrlMock };
});

describe('ContactsList', () => {
  it('renders nothing when there are no contacts', async () => {
    const { container } = await renderWithProviders(<ContactsList contacts={[]} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the three roles in a fixed order, regardless of the API order', async () => {
    await renderWithProviders(
      <ContactsList
        contacts={[
          { customerCode: 'bi-1', type: 'billing' },
          { customerCode: 'ad-1', type: 'administrator' },
          { customerCode: 'te-1', type: 'technical' },
        ]}
      />,
    );

    const codes = screen.getAllByText(/-1$/).map((node) => node.textContent);
    expect(codes).toEqual(['ad-1', 'te-1', 'bi-1']);
  });

  it('links to the account app with the resolved URL', async () => {
    await renderWithProviders(
      <ContactsList
        contacts={[{ customerCode: 'ad-1', type: 'administrator' }]}
        resourceName="my-resource"
      />,
    );

    expect(useNavigationGetUrlMock).toHaveBeenCalledWith([
      'account',
      '/contacts/services',
      { serviceName: 'my-resource', category: 'BACKUP_LICENSES' },
    ]);
    expect(document.querySelector('ods-link')).toHaveAttribute(
      'href',
      'https://account.example.com',
    );
  });
});

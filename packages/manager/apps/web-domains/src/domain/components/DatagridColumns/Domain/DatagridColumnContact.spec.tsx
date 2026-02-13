import '@/common/setupTests';
import React from 'react';
import { render, screen } from '@/common/utils/test.provider';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';
import DatagridColumnContact from './DatagridColumnContact';
import { useGetDomainContact } from '@/domain/hooks/data/query';
import { useNichandleInformation } from '@/common/hooks/nichandle/useNichandleInformation';
import { wrapper } from '@/common/utils/test.provider';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetDomainContact: vi.fn(),
}));

vi.mock('@/common/hooks/nichandle/useNichandleInformation', () => ({
  useNichandleInformation: vi.fn(() => ({ nichandleInformation: null })),
}));

describe('DatagridColumnContact', () => {
  const mockContactId = 'contact-123';
  const mockUserAccountUrl = 'https://ovh.test/account';

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigationGetUrl as ReturnType<typeof vi.fn>).mockReturnValue({
      data: mockUserAccountUrl,
    });
  });

  describe('when isOwner is true', () => {
    it('should render contact details when domain contact is loaded', () => {
      const mockDomainContact = {
        organisationName: 'Test Company',
        firstName: 'John',
        lastName: 'Doe',
      };

      (useGetDomainContact as ReturnType<typeof vi.fn>).mockReturnValue({
        domainContact: mockDomainContact,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={true} />,
        { wrapper },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toHaveTextContent('Test Company');
    });

    it('should render first and last name when no organisation', () => {
      const mockDomainContact = {
        organisationName: null as string | null,
        firstName: 'John',
        lastName: 'Doe',
      };

      (useGetDomainContact as ReturnType<typeof vi.fn>).mockReturnValue({
        domainContact: mockDomainContact,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={true} />,
        { wrapper },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toHaveTextContent('John Doe');
    });

    it('should render contact ID when no domain contact data', () => {
      (useGetDomainContact as ReturnType<typeof vi.fn>).mockReturnValue({
        domainContact: null,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={true} />,
        { wrapper },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toHaveTextContent(mockContactId);
    });
  });

  describe('when isOwner is false', () => {
    beforeEach(() => {
      (useGetDomainContact as ReturnType<typeof vi.fn>).mockReturnValue({
        domainContact: null,
      });
      (useNichandleInformation as ReturnType<typeof vi.fn>).mockReturnValue({
        nichandleInformation: null,
      });
    });

    it('should render nichandle link when contact matches current user', () => {
      const mockNichandleInfo = {
        nichandle: mockContactId,
        organisation: 'User Company',
        name: 'User',
        firstname: 'Test',
      };

      (useNichandleInformation as ReturnType<typeof vi.fn>).mockReturnValue({
        nichandleInformation: mockNichandleInfo,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={false} />,
        { wrapper },
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockUserAccountUrl);
      expect(link).toHaveTextContent(mockContactId);
    });

    it('should render contact ID in link when no organisation for current user', () => {
      const mockNichandleInfo = {
        nichandle: mockContactId,
        organisation: null as string | null,
        name: 'User',
        firstname: 'Test',
      };

      (useNichandleInformation as ReturnType<typeof vi.fn>).mockReturnValue({
        nichandleInformation: mockNichandleInfo,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={false} />,
        { wrapper },
      );

      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', mockUserAccountUrl);
      expect(link).toHaveTextContent(mockContactId);
    });

    it('should render contact ID when not current user', () => {
      const mockNichandleInfo = {
        nichandle: 'different-user',
        organisation: 'Different Company',
      };

      (useNichandleInformation as ReturnType<typeof vi.fn>).mockReturnValue({
        nichandleInformation: mockNichandleInfo,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={false} />,
        { wrapper },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toHaveTextContent(mockContactId);
    });

    it('should render contact ID when no nichandle information', () => {
      (useNichandleInformation as ReturnType<typeof vi.fn>).mockReturnValue({
        nichandleInformation: null,
      });

      render(
        <DatagridColumnContact contactId={mockContactId} isOwner={false} />,
        { wrapper },
      );

      const textCell = screen.getByTestId('datagrid-text-cell');
      expect(textCell).toHaveTextContent(mockContactId);
    });
  });
});

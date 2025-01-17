import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, waitFor, act } from '@/utils/test.provider';
import { domainDetailMock } from '@/api/_mock_';
import ModalEditDomain from '../ModalEditDomain.component';
import domainsEditTranslation from '@/public/translations/domains/edit/Messages_fr_FR.json';
import { putZimbraDomain } from '@/api/domain';

vi.mocked(useSearchParams).mockReturnValue([
  new URLSearchParams({
    editDomainId: domainDetailMock.id,
  }),
  vi.fn(),
]);

describe('Domains edit modal', () => {
  it('check if it is displayed', async () => {
    const { findByText } = render(<ModalEditDomain />);
    expect(
      await findByText(domainsEditTranslation.zimbra_domain_edit_modal_title),
    ).toBeVisible();
  });

  it('check if disabled input have the domain name', async () => {
    const { getByTestId } = render(<ModalEditDomain />);

    await waitFor(() => {
      expect(getByTestId('input-domain')).toBeInTheDocument();
    });

    expect(getByTestId('input-domain')).toHaveProperty(
      'value',
      domainDetailMock.currentState.name,
    );
  });

  it('check the status of confirm cta', async () => {
    const { getByTestId } = render(<ModalEditDomain />);
    const confirmCta = getByTestId('edit-btn');
    const selectOrganization = getByTestId('select-organization');
    expect(confirmCta).toHaveAttribute('is-disabled', 'true');

    act(() => {
      selectOrganization.odsChange.emit({
        name: 'organization',
        value: '1903b491-4d10-4000-8b70-f474d1abe601',
      });
    });

    expect(confirmCta).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(confirmCta);
    });

    expect(putZimbraDomain).toHaveBeenCalledOnce();
  });
});

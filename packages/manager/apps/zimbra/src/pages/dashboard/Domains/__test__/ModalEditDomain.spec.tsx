import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, waitFor, act } from '@/utils/test.provider';
import { domainDetailMock } from '@/api/_mock_';
import ModalEditDomain from '../ModalEditDomain.component';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
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
    expect(await findByText(commonTranslation.edit_domain)).toBeVisible();
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

    await act(() => {
      fireEvent.blur(selectOrganization);
      selectOrganization.odsBlur.emit({});
    });

    expect(confirmCta).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(selectOrganization, {
        target: { value: '1903b491-4d10-4000-8b70-f474d1abe601' },
      });
      selectOrganization.odsChange.emit({
        name: 'organizationId',
        value: '1903b491-4d10-4000-8b70-f474d1abe601',
      });
    });

    expect(selectOrganization).toHaveAttribute('has-error', 'false');
    expect(confirmCta).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.click(confirmCta);
    });

    expect(putZimbraDomain).toHaveBeenCalledOnce();
  });
});

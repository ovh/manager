import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { domainMock, platformMock, putZimbraDomain } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

import ModalEditDomain from './Edit.modal';

vi.mocked(useParams).mockReturnValue({
  platformId: platformMock[0].id,
  domainId: domainMock.id,
});

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

    expect(getByTestId('input-domain')).toHaveProperty('value', domainMock.currentState.name);
  });

  it('check the status of confirm cta', async () => {
    const { getByTestId } = render(<ModalEditDomain />);
    const confirmCta = getByTestId('edit-btn');
    const selectOrganization = getByTestId('select-organization') as OdsHTMLElement;

    expect(confirmCta).toHaveAttribute('is-disabled', 'true');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.blur(selectOrganization);
      selectOrganization.odsBlur.emit({});
    });

    expect(confirmCta).toHaveAttribute('is-disabled', 'true');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
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

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(confirmCta);
    });

    expect(putZimbraDomain).toHaveBeenCalledOnce();
  });
});

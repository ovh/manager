import React from 'react';

import { useParams } from 'react-router-dom';

import { screen, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { domainMock, platformMock, putZimbraDomain } from '@/data/api';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';
import { render } from '@/utils/test.provider';

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

  it.skip('check the status of confirm cta', async () => {
    render(<ModalEditDomain />);

    const selectOrganizationContainer = screen.getByTestId('select-organization');
    const selectOrganization = selectOrganizationContainer.querySelector('select');

    const editButton = screen.queryByTestId('edit-btn');

    expect(editButton).toHaveAttribute('disabled');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      userEvent.click(selectOrganizationContainer);
      const firstOption = selectOrganization.querySelector('option');
      userEvent.click(firstOption);
      // fireEvent.change(selectOrganization, { target: { value: firstOption.value } });
    });

    await waitFor(() => expect(editButton).not.toHaveAttribute('disabled'));

    userEvent.click(editButton);

    expect(putZimbraDomain).toHaveBeenCalledOnce();
  });
});

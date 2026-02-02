import React from 'react';

import { useParams } from 'react-router-dom';

import { waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import {
  organizationMock,
  platformMock,
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/data/api';
import { render } from '@/utils/test.provider';

import AddEditRedirectionModal from './AddEdit.modal';

describe('Organizations add and edit modal', () => {
  it('should add a new organization', async () => {
    const { getByTestId, queryByTestId } = render(<AddEditRedirectionModal />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name');
    const inputLabel = getByTestId('input-label');

    await user.clear(inputName);
    await user.clear(inputLabel);
    await user.tab();

    expect(inputName).toHaveAttribute('data-invalid', 'true');
    expect(inputLabel).toHaveAttribute('data-invalid', 'true');
    expect(button).toBeDisabled();

    await user.type(inputName, 'Name');
    await user.type(inputLabel, 'Label');

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    await user.click(button);

    expect(postZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });

  it('should edit an organization', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      organizationId: organizationMock.id,
    });
    const user = userEvent.setup();

    const { getByTestId, queryByTestId } = render(<AddEditRedirectionModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name');
    const inputLabel = getByTestId('input-label');

    await user.type(inputName, 'Name');
    await user.type(inputLabel, 'Label');
    await user.tab();

    await waitFor(() => {
      expect(button).toBeEnabled();
    });

    await user.click(button);

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

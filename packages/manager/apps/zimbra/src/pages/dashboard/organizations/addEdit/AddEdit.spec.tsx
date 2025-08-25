import React from 'react';

import { useParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import {
  organizationMock,
  platformMock,
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/data/api';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

import AddEditRedirectionModal from './AddEdit.modal';

describe('Organizations add and edit modal', () => {
  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('check validity form', async () => {
    const { getByTestId, queryByTestId } = render(<AddEditRedirectionModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name') as OdsHTMLElement;
    const inputLabel = getByTestId('input-label') as OdsHTMLElement;

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      fireEvent.change(inputName, {
        target: { value: '' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: '',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'true');

    act(() => {
      fireEvent.change(inputLabel, {
        target: { value: 'NotAValidLabelWithMore12Chars' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'NotAValidLabelWithMore12Chars',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'true');

    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('should add a new organization', async () => {
    const { getByTestId, queryByTestId } = render(<AddEditRedirectionModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name') as OdsHTMLElement;
    const inputLabel = getByTestId('input-label') as OdsHTMLElement;

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(button);
    });

    expect(postZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });

  it('should edit an organization', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      organizationId: organizationMock.id,
    });

    const { getByTestId, queryByTestId } = render(<AddEditRedirectionModal />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputName = getByTestId('input-name') as OdsHTMLElement;
    const inputLabel = getByTestId('input-label') as OdsHTMLElement;

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});

      fireEvent.change(inputName, {
        target: { value: 'Name1' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name1',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.change(inputLabel, {
        target: { value: 'Label1' },
      });
      inputLabel.odsChange.emit({
        name: 'label',
        value: 'Label1',
      });
    });

    expect(inputLabel).toHaveAttribute('has-error', 'false');

    expect(button).toHaveAttribute('is-disabled', 'false');

    // eslint-disable-next-line @typescript-eslint/require-await
    await act(async () => {
      fireEvent.click(button);
    });

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

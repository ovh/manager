import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams } from 'react-router-dom';
import { fireEvent, render, act, waitFor } from '@/utils/test.provider';
import AddEditRedirectionModal from './AddEdit.modal';
import {
  organizationMock,
  platformMock,
  postZimbraPlatformOrganization,
  putZimbraPlatformOrganization,
} from '@/data/api';

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
    const inputName = getByTestId('input-name') as any;
    const inputLabel = getByTestId('input-label') as any;

    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    await act(() => {
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

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: '' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: '',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'true');

    await act(() => {
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
    const inputName = getByTestId('input-name') as any;
    const inputLabel = getByTestId('input-label') as any;

    await act(() => {
      inputName.odsBlur.emit({});
      inputLabel.odsBlur.emit({});
    });

    expect(inputName).toHaveAttribute('has-error', 'true');
    expect(inputLabel).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputName, {
        target: { value: 'Name' },
      });
      inputName.odsChange.emit({
        name: 'name',
        value: 'Name',
      });
    });

    expect(inputName).toHaveAttribute('has-error', 'false');

    await act(() => {
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

    await act(() => {
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
    const inputName = getByTestId('input-name') as any;
    const inputLabel = getByTestId('input-label') as any;

    await act(() => {
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

    await act(() => {
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

    await act(() => {
      fireEvent.click(button);
    });

    expect(putZimbraPlatformOrganization).toHaveBeenCalledOnce();
  });
});

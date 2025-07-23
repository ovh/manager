import React from 'react';

import { useSearchParams } from 'react-router-dom';

import '@testing-library/jest-dom';
import 'element-internals-polyfill';
import { describe, expect, vi } from 'vitest';

import { accountMock } from '@/data/api';
import autoRepliesFormTranslation from '@/public/translations/auto-replies/form/Messages_fr_FR.json';
import { act, fireEvent, render, waitFor } from '@/utils/test.provider';
import { OdsHTMLElement } from '@/utils/test.utils';

import { AddAutoReply, AutoReplyDurations } from './Add.page';

describe('add auto reply page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<AddAutoReply />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-header')).toHaveTextContent(
      autoRepliesFormTranslation.zimbra_auto_replies_add_header,
    );
  });

  // could not migrate these tests due to the behavior of the radio elements
  // and the test library
  it.skip('should have a correct form validation without accountId', async () => {
    const { getByTestId, queryByTestId } = render(<AddAutoReply />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const radioPermanent = getByTestId(AutoReplyDurations.PERMANENT) as OdsHTMLElement;
    const inputFrom = getByTestId('from');
    const inputUntil = getByTestId('until');
    const message = getByTestId('message');
    const sendCopy = getByTestId('sendCopy');

    expect(button).toHaveAttribute('is-disabled', 'true');
    expect(queryByTestId('create-for-account')).toBeNull();
    expect(queryByTestId('select-send-copy-to')).toBeNull();

    act(() => {
      fireEvent.change(inputAccount, { target: { value: 'test' } });
      fireEvent.change(selectDomain, { target: { value: 'test.fr' } });
      // doesnt work
      radioPermanent.odsChange.emit({
        detail: { value: AutoReplyDurations.PERMANENT },
      });
      // doesnt work
      fireEvent.click(radioPermanent);
      fireEvent.change(message, { target: { value: 'message' } });
    });

    expect(inputFrom).not.toBeInTheDocument();
    expect(inputUntil).not.toBeInTheDocument();
    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      fireEvent.click(sendCopy);
    });

    const selectSendCopyTo = getByTestId('select-send-copy-to');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      fireEvent.change(selectSendCopyTo, { target: { value: 'test@test.fr' } });
    });

    expect(button).toHaveAttribute('is-disabled', 'false');
  });

  // could not migrate these tests due to the behavior of the radio elements
  // and the test library
  it.skip('should have a correct form validation with accountId', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editEmailAccountId: accountMock.id,
      }),
      vi.fn(),
    ]);

    const { getByTestId, queryByTestId } = render(<AddAutoReply />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const radioPermanent = getByTestId(AutoReplyDurations.PERMANENT);
    const message = getByTestId('message');
    const sendCopy = getByTestId('sendCopy');
    const header = getByTestId('create-for-account');

    expect(button).toHaveAttribute('is-disabled', 'true');
    expect(queryByTestId('select-send-copy-to')).toBeNull();
    expect(queryByTestId('input-account')).toBeNull();
    expect(queryByTestId('select-domain')).toBeNull();

    expect(header).toHaveTextContent(accountMock.currentState.email);

    act(() => {
      fireEvent.click(radioPermanent);
      fireEvent.change(message, { target: { value: 'message' } });
    });

    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      fireEvent.click(sendCopy);
    });

    const selectSendCopyTo = getByTestId('select-send-copy-to');

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      fireEvent.change(selectSendCopyTo, { target: { value: 'test@test.fr' } });
    });

    expect(button).toHaveAttribute('is-disabled', 'false');
  });
});

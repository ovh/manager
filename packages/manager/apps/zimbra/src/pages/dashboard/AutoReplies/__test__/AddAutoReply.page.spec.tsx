import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { describe, expect, vi } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { fireEvent, render, waitFor, act } from '@/utils/test.provider';
import AddAutoReply, { AutoReplyDurations } from '../AddAutoReply.page';
import autoRepliesAddTranslation from '@/public/translations/autoReplies/add/Messages_fr_FR.json';
import { accountDetailMock } from '@/api/_mock_';

describe('add auto reply page', () => {
  it('should render page correctly', async () => {
    const { getByTestId, queryByTestId } = render(<AddAutoReply />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-header')).toHaveTextContent(
      autoRepliesAddTranslation.zimbra_auto_replies_add_header,
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
    const radioPermanent = getByTestId(AutoReplyDurations.PERMANENT);
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
        editEmailAccountId: accountDetailMock.id,
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

    expect(header).toHaveTextContent(accountDetailMock.currentState.email);

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

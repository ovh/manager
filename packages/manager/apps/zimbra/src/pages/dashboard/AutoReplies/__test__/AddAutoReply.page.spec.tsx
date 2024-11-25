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

  it.skip('should have a correct form validation without accountId', async () => {
    const { getByTestId, queryByTestId } = render(<AddAutoReply />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const radioDuration = getByTestId('radio-group-duration');
    const inputFrom = getByTestId('from');
    const inputUntil = getByTestId('until');
    const message = getByTestId('message');
    const sendCopy = getByTestId('sendcopy');

    expect(button).toBeDisabled();
    expect(queryByTestId('create-for-account')).toBeNull();
    expect(queryByTestId('select-send-copy-to')).toBeNull();

    await act(() => {
      fireEvent.change(inputAccount, { target: { value: 'test' } });
      fireEvent.change(selectDomain, { target: { value: 'test.fr' } });
      radioDuration.odsValueChange.emit({
        detail: {
          newValue: AutoReplyDurations.PERMANENT,
        },
      });
      fireEvent.change(message, { target: { value: 'message' } });
    });

    expect(inputFrom).not.toBeInTheDocument();
    expect(inputUntil).not.toBeInTheDocument();
    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.click(sendCopy);
    });

    const selectSendCopyTo = getByTestId('select-send-copy-to');

    expect(button).toBeDisabled();

    await act(() => {
      fireEvent.change(selectSendCopyTo, { target: { value: 'test@test.fr' } });
    });

    expect(button).toBeEnabled();
  });

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
    const radioDuration = getByTestId('radio-group-duration');
    const message = getByTestId('message');
    const sendCopy = getByTestId('sendcopy');
    const header = getByTestId('create-for-account');

    expect(button).toBeDisabled();
    expect(queryByTestId('select-send-copy-to')).toBeNull();
    expect(queryByTestId('input-account')).toBeNull();
    expect(queryByTestId('select-domain')).toBeNull();

    expect(header).toHaveTextContent(accountDetailMock.currentState.email);

    await act(() => {
      radioDuration.odsValueChange.emit({
        detail: {
          newValue: AutoReplyDurations.PERMANENT,
        },
      });
      fireEvent.change(message, { target: { value: 'message' } });
    });

    expect(button).toBeEnabled();

    await act(() => {
      fireEvent.click(sendCopy);
    });

    const selectSendCopyTo = getByTestId('select-send-copy-to');

    expect(button).toBeDisabled();

    await act(() => {
      fireEvent.change(selectSendCopyTo, { target: { value: 'test@test.fr' } });
    });

    expect(button).toBeEnabled();
  });
});

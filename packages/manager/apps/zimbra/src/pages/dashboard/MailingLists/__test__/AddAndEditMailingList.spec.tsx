import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useSearchParams } from 'react-router-dom';
import { render, waitFor, act } from '@/utils/test.provider';
import { mailingListsMock } from '@/api/_mock_';
import { ReplyToChoices, ModerationChoices } from '@/api/mailinglist';
import AddAndEditMailingList from '../AddAndEditMailingList.page';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('mailing lists add and edit page', async () => {
  const editMailingListId = mailingListsMock[0].id;

  it('should be in add mode if no editMailingListId param', async () => {
    const { getByTestId, queryByTestId } = render(<AddAndEditMailingList />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      commonTranslation.add_mailing_list,
    );
  });

  it('should be add page and enable/disable button based on form validity', async () => {
    const { getByTestId, queryByTestId } = render(<AddAndEditMailingList />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    const button = getByTestId('confirm-btn');
    const inputAccount = getByTestId('input-account');
    const selectDomain = getByTestId('select-domain');
    const inputOwner = getByTestId('input-owner');
    const replyToList = getByTestId(`radio-reply-to-${ReplyToChoices.LIST}`);
    const selectLanguage = getByTestId('select-language');
    const moderationOptionAll = getByTestId(
      `radio-moderation-option-${ModerationChoices.ALL}`,
    );

    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputAccount.odsBlur.emit({ name: 'account', value: '' });
      inputOwner.odsBlur.emit({ name: 'owner', value: '' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(inputOwner).toHaveAttribute('has-error', 'true');
    expect(button).toHaveAttribute('is-disabled', 'true');

    act(() => {
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain' });
      inputOwner.odsChange.emit({
        name: 'owner',
        value: 'testowner',
      });
      selectLanguage.odsChange.emit({ name: 'language', value: 'FR' });
      replyToList.odsChange.emit({
        name: 'defaultReplyTo',
        value: ReplyToChoices.LIST,
      });
      moderationOptionAll.odsChange.emit({
        name: 'moderationOption',
        value: ModerationChoices.ALL,
      });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');
    expect(inputOwner).toHaveAttribute('has-error', 'false');
    expect(button).toHaveAttribute('is-disabled', 'false');

    act(() => {
      inputOwner.odsChange.emit({
        name: 'owner',
        value: 't',
      });
    });

    expect(button).toHaveAttribute('is-disabled', 'true');
  });

  it('should be in edit mode if editMailingListId param is present', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        editMailingListId,
      }),
      vi.fn(),
    ]);

    const { getByTestId, queryByTestId } = render(<AddAndEditMailingList />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      commonTranslation.edit_mailing_list,
    );
  });
});

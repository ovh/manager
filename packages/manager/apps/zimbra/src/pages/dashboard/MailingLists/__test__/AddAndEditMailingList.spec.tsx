import React from 'react';
import 'element-internals-polyfill';
import '@testing-library/jest-dom';
import { vi, describe, expect } from 'vitest';
import { useParams, useSearchParams } from 'react-router-dom';
import { fireEvent, render, waitFor, act } from '@/utils/test.provider';
import { mailingListsMock, platformMock } from '@/api/_mock_';
import { ReplyToChoices, ModerationChoices } from '@/api/mailinglist';
import AddAndEditMailingList from '../AddAndEditMailingList.page';
import commonTranslation from '@/public/translations/common/Messages_fr_FR.json';

describe('mailing lists add and edit page', async () => {
  it('should be in add mode', async () => {
    const { getByTestId, queryByTestId } = render(<AddAndEditMailingList />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      commonTranslation.add_mailing_list,
    );
  });

  it('should be in edit mode', async () => {
    vi.mocked(useParams).mockReturnValue({
      platformId: platformMock[0].id,
      mailingListId: mailingListsMock[0].id,
    });

    const { getByTestId, queryByTestId } = render(<AddAndEditMailingList />);

    await waitFor(() => {
      expect(queryByTestId('spinner')).toBeNull();
    });

    expect(getByTestId('page-title')).toHaveTextContent(
      commonTranslation.edit_mailing_list,
    );
  });
  // @TODO: find why this test is inconsistent
  // sometimes ODS component return attribute empty while it can
  // only be "true" or "false"
  it.skip('should be add page and enable/disable button based on form validity', async () => {
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

    await act(() => {
      inputAccount.odsBlur.emit({});
      selectDomain.odsBlur.emit({});
      inputOwner.odsBlur.emit({});
      selectLanguage.odsBlur.emit({});
    });

    expect(inputAccount).toHaveAttribute('has-error', 'true');
    expect(selectDomain).toHaveAttribute('has-error', 'true');
    expect(inputOwner).toHaveAttribute('has-error', 'true');
    expect(selectLanguage).toHaveAttribute('has-error', 'true');

    expect(button).toHaveAttribute('is-disabled', 'true');

    await act(() => {
      fireEvent.change(inputAccount, {
        target: { value: 'account' },
      });
      inputAccount.odsChange.emit({ name: 'account', value: 'account' });
    });

    expect(inputAccount).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(selectDomain, {
        target: { value: 'domain.fr' },
      });
      selectDomain.odsChange.emit({ name: 'domain', value: 'domain.fr' });
    });

    expect(selectDomain).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(inputOwner, {
        target: { value: 'testowner' },
      });
      inputOwner.odsChange.emit({
        name: 'owner',
        value: 'testowner',
      });
    });

    expect(inputOwner).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.change(selectLanguage, {
        target: { value: 'FR' },
      });
      selectLanguage.odsChange.emit({ name: 'language', value: 'FR' });
    });

    expect(selectLanguage).toHaveAttribute('has-error', 'false');

    await act(() => {
      fireEvent.click(replyToList);
      fireEvent.click(moderationOptionAll);
    });

    expect(button).toHaveAttribute('is-disabled', 'false');

    await act(() => {
      fireEvent.change(inputOwner, {
        target: { value: 't' },
      });
      inputOwner.odsChange.emit({
        name: 'owner',
        value: 't',
      });
    });

    expect(inputOwner).toHaveAttribute('has-error', 'true');

    expect(button).toHaveAttribute('is-disabled', 'true');
  });
});

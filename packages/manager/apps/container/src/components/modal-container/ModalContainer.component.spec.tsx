import { act, render, screen, waitFor } from '@testing-library/react';
import { vi } from "vitest";

import { LegalForm } from "@ovh-ux/manager-config";

import { getTimeMocks } from '@/__mocks__/time/time.handler';
import { getIamMocks } from '@/__mocks__/iam/iam.handler';
import { getFeatureAvailabilityMocks } from '@/__mocks__/feature-availability/featureAvailability.handler';
import { getPaymentMethodMocks } from '@/__mocks__/payment-method/paymentMethod.handler';
import { getAgreementsMocks } from '@/__mocks__/agreements/agreements.handler';
import { getPreferencesMocks } from '@/__mocks__/preferences/preferences.handler';
import { getProcedureMocks } from '@/__mocks__/procedures/procedures.handler';
import { getSuggestionsMocks } from '@/__mocks__/suggestions/suggestions.handler';
import * as agreementsHelper from "@/helpers/agreements/agreementsHelper";
import * as paymentMethodHelper from "@/helpers/paymentMethod/paymentMethodHelper";
import * as procedureHelper from "@/helpers/procedures/proceduresHelper";
import * as suggestionHelper from "@/helpers/suggestions/suggestionsHelper";
import * as useModal from "@/hooks/modal/useModal";
import { getComponentWrapper, GetComponentWrapperParams } from "@/utils/tests/component-wrapper";
import { configureTest, ConfigureTestParams } from '@/utils/tests/tests.helper';

import ModalContainer from "./ModalContainer.component";

const useCheckModalDisplaySpy = vi.spyOn(useModal, 'useCheckModalDisplay');
const isUserConcernedWithIndiaProcedureSpy = vi.spyOn(procedureHelper, 'isUserConcernedWithIndiaProcedure');
const hasExpiredDefaultCreditCardAlertSpy = vi.spyOn(paymentMethodHelper, 'hasExpiredDefaultCreditCardAlert');
const hasPendingAgreementsSpy = vi.spyOn(agreementsHelper, 'hasPendingAgreements');
const isUserConcernedBySuggestionSpy = vi.spyOn(suggestionHelper, 'isUserConcernedBySuggestion');

const commonMocks = [
  ...getTimeMocks(),
  ...getIamMocks(),
  ...getFeatureAvailabilityMocks(),
  ...getPreferencesMocks(),
]

const cases: Record<string, GetComponentWrapperParams & ConfigureTestParams> = {
  'no modals when preloader is visible': {
    configuration: {},
  },
  'no modals if user is not concerned by any procedure': {
    withQueryClientProvider: true,
    configuration: {
      user: {
        kycValidated: true,
        legalform: 'individual' as LegalForm,
      },
    },
    mocks: [
      ...commonMocks,
      ...getPaymentMethodMocks(),
      ...getAgreementsMocks(),
    ],
  },
  'all modals if user is concerned by all procedures': {
    withQueryClientProvider: true,
    configuration: {
      user: {
        kycValidated: false,
        legalform: 'corporation' as LegalForm,
        country: 'FR',
      },
    },
    mocks: [
      ...commonMocks,
      ...getProcedureMocks({ identityStatus: 'required' }),
      ...getSuggestionsMocks(),
      ...getPaymentMethodMocks({ hasPaymentMethods: true, status: 'EXPIRED' }),
      ...getAgreementsMocks({ withAgreementsToValidate: true }),
    ],
  },
}

describe('ModalContainer.component', () => {
  afterEach(() => {
    useCheckModalDisplaySpy.mockClear();
  });

  it('should display no modals when preloader is visible', () => {
    const wrapper = getComponentWrapper(cases['no modals when preloader is visible']);
    configureTest(cases['no modals when preloader is visible']);
    const { container } = render(wrapper(<ModalContainer isPreloaderVisible={true} />));

    expect(container.children.length).toBe(0);
    expect(useCheckModalDisplaySpy).not.toHaveBeenCalled();
  });

  it('should display no modals if user is not concerned by any procedure', async () => {
    const wrapper = getComponentWrapper(cases['no modals if user is not concerned by any procedure']);
    configureTest(cases['no modals if user is not concerned by any procedure']);
    const { container } = render(wrapper(<ModalContainer isPreloaderVisible={false} />));

    expect(container.children.length).toBe(0);
    // Check for IdentityDocumentsModal
    await waitFor(() => {
      expect(useCheckModalDisplaySpy).toHaveBeenCalled();
      expect(isUserConcernedWithIndiaProcedureSpy).toHaveBeenCalled();
      expect(container.children.length).toBe(0);
    });

    // Check for PaymentModal
    await waitFor(() => {
      expect(useCheckModalDisplaySpy).toHaveBeenCalled();
      expect(hasExpiredDefaultCreditCardAlertSpy).toHaveBeenCalled();
      expect(container.children.length).toBe(0);
    });

    // Check for AgreementsUpdateModal
    await waitFor(() => {
      expect(useCheckModalDisplaySpy).toHaveBeenCalled();
      expect(hasPendingAgreementsSpy).toHaveBeenCalled();
      expect(container.children.length).toBe(0);
    });

    // Check for SuggestionModal
    await waitFor(() => {
      expect(useCheckModalDisplaySpy).toHaveBeenCalled();
      expect(isUserConcernedBySuggestionSpy).toHaveBeenCalled();
      expect(container.children.length).toBe(0);
    });
  });

  it('should display all modals if user is concerned by all procedures', async () => {
    const wrapper = getComponentWrapper(cases['all modals if user is concerned by all procedures']);
    configureTest(cases['all modals if user is concerned by all procedures']);
    const { container } = render(wrapper(<ModalContainer isPreloaderVisible={false} />));

    // Check for IdentityDocumentsModal
    await waitFor(() => {
      expect(container.children.length).toBe(1);
    });
    
    const skipButton = screen.getByText('identity_documents_modal_button_later');
    await act(() => skipButton.click());

    // Check for PaymentModal
    await waitFor(() => {
      expect(container.children.length).toBe(1);
    });
    
    const cancelButton = screen.getByText('payment_modal_action_cancel');
    await act(() => cancelButton.click());

    // Check for AgreementsUpdateModal
    await waitFor(() => {
      expect(container.children.length).toBe(1);
    });
    
    const actionButton = screen.getByText('agreements_update_modal_action');
    await act(() => actionButton.click());

    // Check for SuggestionModal
    await waitFor(() => {
      expect(container.children.length).toBe(1);
    });
  });
});
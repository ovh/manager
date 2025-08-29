import { describe, Mock, vi, expect } from 'vitest';
import React from 'react';
import {
  fireEvent,
  render,
  RenderResult,
  within,
} from '@testing-library/react';
import {
  PciModal,
  PciModalProps,
  QuantitySelector,
} from '@ovh-ux/manager-pci-common';
import { act } from 'react-dom/test-utils';
import {
  AlertModalComponent,
  TAlertModalProps,
} from '@/pages/billing/estimate/components/AlertModal.component';
import { wrapper } from '@/wrapperRenders';

vi.mock('@/hooks/useEnvironment', () => ({
  useEnvironment: vi.fn().mockImplementation(() => ({
    getUser: () => ({
      currency: 'EUR',
    }),
  })),
}));

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsFormField: ActualOsdsFormField,
    OsdsInput: ActualOsdsInput,
    OsdsText: ActualOsdsText,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  const [OsdsFormFieldElem, OsdsInputElem, OsdsTextElem] = [
    ActualOsdsFormField as React.ElementType,
    ActualOsdsInput as React.ElementType,
    ActualOsdsText as React.ElementType,
  ];
  return {
    ...rest,
    OsdsFormField: vi.fn().mockImplementation(({ children, ...props }) => (
      <OsdsFormFieldElem {...props} data-testid="osds-field">
        {children}
      </OsdsFormFieldElem>
    )),
    OsdsInput: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsInputElem {...props} data-testid="osds-input" />
      )),
    OsdsText: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <OsdsTextElem {...props} data-testid="osds-text" />
      )),
  };
});
vi.mock('@ovh-ux/manager-pci-common', async () => {
  const {
    PciModal: ActualPciModal,
    QuantitySelector: ActualQuantitySelector,
    ...rest
  } = await vi.importActual('@ovh-ux/manager-pci-common');
  const [PciModalElem, QuantitySelectorElem] = [
    ActualPciModal as React.ElementType,
    ActualQuantitySelector as React.ElementType,
  ];
  return {
    ...rest,
    PciModal: vi.fn().mockImplementation(({ children, ...props }) => (
      <PciModalElem {...props} data-testid="pci-modal">
        {children}
      </PciModalElem>
    )),
    QuantitySelector: vi
      .fn()
      .mockImplementation(({ ...props }) => (
        <QuantitySelectorElem {...props} data-testid="quantity-selector" />
      )),
  };
});

vi.mock('react-i18next', async () => {
  const { ...rest } = await vi.importActual('react-i18next');
  return {
    ...rest,
    useTranslation: vi.fn().mockImplementation((namespace: string) => ({
      t: vi.fn().mockImplementation((key: string) => `${namespace} | ${key}`),
    })),
  };
});

const defaultProps: TAlertModalProps = {
  onClose: vi.fn(),
  onInput: vi.fn(),
  isPending: false,
  currency: {
    symbol: '€',
    code: 'EUR',
    format: '€0,0.00',
  },
};

const renderComponent = (props: TAlertModalProps = defaultProps) =>
  render(<AlertModalComponent {...props} />, { wrapper });

describe('AlertModalComponent', () => {
  it('should render modal with the right props', () => {
    renderComponent();

    const call = (PciModal as Mock).mock.lastCall?.[0] as PciModalProps;
    expect(call.title).toBe('estimate | cpbea_estimate_alert_add_header_title');
    expect(call.onCancel).toBe(defaultProps.onClose);
    expect(call.onClose).toBe(defaultProps.onClose);
    expect(call.cancelText).toBe(
      'estimate | cpbea_estimate_alert_add_cancel_btn',
    );
    expect(call.submitText).toBe(
      'estimate | cpbea_estimate_alert_add_submit_btn',
    );
    expect(call.isPending).toBe(defaultProps.isPending);
  });

  describe('email', () => {
    const getEmailFormField = (result?: RenderResult) => {
      const iResult = result || renderComponent();
      const formFields = iResult.getAllByTestId('osds-field');
      return formFields[0];
    };

    it('should render form field', () => {
      expect(getEmailFormField()).toBeInTheDocument();
    });

    it("should contain label as slot with 'estimate | cpbea_estimate_alert_add_mail_label' text", () => {
      const formField = getEmailFormField();
      const label = within(formField).getByTestId('osds-text');
      expect(label).toHaveTextContent(
        'estimate | cpbea_estimate_alert_add_mail_label',
      );
      expect(label).toHaveAttribute('slot', 'label');
    });

    it('should contain input', () => {
      const formField = getEmailFormField();
      const input = within(formField).getByTestId('osds-input');
      expect(input).toBeInTheDocument();
    });

    describe('error message', () => {
      describe('email is not touched', () => {
        it('should not display error message if email is not valid', () => {
          const formField = getEmailFormField(
            renderComponent({ ...defaultProps, email: 'su' }),
          );
          const input = within(formField).getByTestId('osds-input');
          expect(formField).toHaveAttribute('error', '');
          expect(input).toHaveAttribute('error', 'false');
        });
        it('should not display error message if email is valid', () => {
          const formField = getEmailFormField();
          const input = within(formField).getByTestId('osds-input');
          expect(formField).toHaveAttribute('error', '');
          expect(input).toHaveAttribute('error', 'false');
        });
      });
      describe('email is touched', () => {
        it('should display error message if email is not valid', () => {
          const formField = getEmailFormField();
          const input = within(formField).getByTestId('osds-input');
          act(() => {
            fireEvent(
              input,
              new CustomEvent('odsValueChange', {
                detail: { value: 'new value' },
              }),
            );
          });
          expect(formField).toHaveAttribute(
            'error',
            'estimate | cpbea_estimate_alert_add_mail_required estimate | cpbea_estimate_alert_add_mail_bad_format',
          );
          expect(input).toHaveAttribute('error', 'true');
        });
        it('should not display error message if email is valid', () => {
          const formField = getEmailFormField();
          const input = within(formField).getByTestId('osds-input');
          act(() => {
            fireEvent(
              input,
              new CustomEvent('odsValueChange', {
                detail: { value: 'ovh@ovh.com' },
              }),
            );
          });
          expect(formField).toHaveAttribute('error', '');
          expect(input).toHaveAttribute('error', 'false');
        });
      });
    });
  });

  describe('treshold', () => {
    const getTresholdFormField = (result?: RenderResult) => {
      const iResult = result || renderComponent();
      const formFields = iResult.getAllByTestId('osds-field');
      return formFields[1];
    };

    it('should render form field', () => {
      expect(getTresholdFormField()).toBeInTheDocument();
    });

    it("should contain label as slot with 'estimate | cpbea_estimate_alert_add_threshold_label' text", () => {
      const formField = getTresholdFormField();
      const label = within(formField).getByTestId('osds-text');
      expect(label).toHaveTextContent(
        'estimate | cpbea_estimate_alert_add_threshold_label',
      );
      expect(label).toHaveAttribute('slot', 'label');
    });

    it('should contain quantity selector', () => {
      (QuantitySelector as Mock).mockImplementationOnce(() => (
        <div data-testid="quantity-selector" />
      ));
      const formField = getTresholdFormField();
      const input = within(formField).getByTestId('quantity-selector');
      expect(input).toBeInTheDocument();
    });
  });
});

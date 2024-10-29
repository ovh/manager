import { describe, Mock, vi } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import {
  StepComponent,
  useMe,
  TStepProps,
} from '@ovh-ux/manager-react-components';
import { OsdsLink, OsdsMessage } from '@ovhcloud/ods-components/react';
import React from 'react';
import { StepsEnum, useCreateStore } from '@/pages/create/store';
import { wrapper } from '@/wrapperRenders';
import { InstanceStep } from '@/pages/create/steps/InstanceStep';
import { PRODUCT_LINK } from '@/constants';

vi.mock('@ovh-ux/manager-react-components', async () => {
  const { StepComponent: ActualStepComponent, ...rest } = await vi.importActual(
    '@ovh-ux/manager-react-components',
  );
  return {
    ...rest,
    useMe: vi.fn().mockImplementation(() => ({ me: undefined })),
    StepComponent: vi
      .fn()
      .mockImplementation(ActualStepComponent as typeof StepComponent),
  };
});

vi.mock('@/components/create/InstanceTable.component', async () => {
  const { InstanceTable, ...rest } = await vi.importActual(
    '@/components/create/InstanceTable.component',
  );
  return {
    ...rest,
    InstanceTable: vi.fn(),
  };
});

vi.mock('@ovhcloud/ods-components/react', async () => {
  const {
    OsdsLink: ActualOsdsLink,
    OsdsMessage: ActualOsdsMessage,
    ...rest
  } = await vi.importActual('@ovhcloud/ods-components/react');
  return {
    ...rest,
    OsdsLink: vi.fn().mockImplementation(ActualOsdsLink as typeof OsdsLink),
    OsdsMessage: vi
      .fn()
      .mockImplementation(ActualOsdsMessage as typeof OsdsMessage),
  };
});

describe.skip('InstanceStep', () => {
  // TODO add snapshot test
  describe('should render', () => {
    it('should render StepComponent with right props', () => {
      const { result } = renderHook(() => useCreateStore());
      act(() => result.current.open(StepsEnum.INSTANCE));

      render(<InstanceStep />, { wrapper });

      const { calls } = (StepComponent as Mock).mock;
      const call = calls[calls.length - 1][0] as TStepProps;

      expect(call.title).toBe('octavia_load_balancer_create_instance_title');

      expect(call.isOpen).toBe(true);

      expect(call.isChecked).toBe(false);

      expect(call.isLocked).toBe(false);

      expect(call.order).toBe(5);

      expect(call.next.label).toBe('common_stepper_next_button_label');
      expect(call.next.isDisabled).not.toBeDefined();

      expect(call.edit.label).toBe('common_stepper_modify_this_step');
    });

    describe.skip('Get started link', () => {
      it('should render ovhSubsidiary product link if found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: { ovhSubsidiary: 'FR' },
        }));
        // (Translation as Mock).mockImplementationOnce(({ children }: { children: (fr) => React.ReactElement }) => (
        //   <>{children(tr)}</>
        // ));
        // (Trans as Mock).mockImplementationOnce(({ tr,i18nKey,values }) => console.log("wa7id"));
        const { getByTestId } = render(<InstanceStep />, { wrapper });

        // expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
        //   GETTING_STARTED_LINK.FR,
        // );
      });

      it.skip('should render default product link if not found', () => {
        ((OsdsLink as unknown) as Mock).mockImplementationOnce(({ href }) => (
          <a href={href} data-testid="link"></a>
        ));
        (useMe as Mock).mockImplementation(() => ({
          me: undefined,
        }));
        const { getByTestId } = render(<InstanceStep />, { wrapper });

        expect(getByTestId('link').attributes.getNamedItem('href').value).toBe(
          PRODUCT_LINK.DEFAULT,
        );
      });
    });

    it('Should show information message', () => {
      ((OsdsMessage as unknown) as Mock).mockImplementationOnce(
        ({ children, ...props }) => (
          <OsdsMessage data-testid="info-message" {...props}>
            {children}
          </OsdsMessage>
        ),
      );
      const { queryByTestId } = render(<InstanceStep />, { wrapper });

      expect(queryByTestId('info-message')).toBeInTheDocument();
    });
  });
});

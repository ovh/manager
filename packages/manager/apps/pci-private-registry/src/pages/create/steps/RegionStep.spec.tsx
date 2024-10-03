import { render } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import {
  StepComponent,
  TilesInputComponent,
} from '@ovh-ux/manager-react-components';
import { useProjectLocalisation } from '@ovh-ux/manager-pci-common';
import { wrapper } from '@/wrapperRenders';
import RegionStep from '@/pages/create/steps/RegionStep';
import { useGetCapabilities } from '@/api/hooks/useCapabilities';

const compute = () => render(<RegionStep />, { wrapper });

describe('NameStep', () => {
  vi.mock('@ovh-ux/manager-react-components', (importOriginal) => ({
    ...importOriginal,
    StepComponent: vi
      .fn()
      .mockImplementation(({ children }: { children: JSX.Element }) => (
        <div data-testid="StepComponent">{children}</div>
      )),
    TilesInputComponent: vi
      .fn()
      .mockImplementation(() => (
        <div data-testid="TilesInputComponent">TilesInputComponent</div>
      )),
  }));

  vi.mock('@ovh-ux/manager-pci-common', (importOriginal) => ({
    ...importOriginal,
    useProjectLocalisation: vi.fn().mockReturnValue({ data: [] }),
  }));

  vi.mock('@/api/hooks/useCapabilities', (importOriginal) => ({
    ...importOriginal,
    useGetCapabilities: vi.fn().mockReturnValue({ data: [] }),
  }));

  it('should render', () => {
    const { container } = compute();
    expect(container).toMatchSnapshot();
  });

  it('should render StepComponent', () => {
    compute();

    const spy = StepComponent as Mock;

    const { mock } = spy;

    const firstCall = mock.calls[0][0];

    expect({
      isOpen: firstCall.isOpen,
      isLocked: firstCall.isLocked,
      iChecked: firstCall.isChecked,
      order: firstCall.order,
      title: firstCall.title,
      next: {
        label: firstCall.next.label,
        isDisabled: firstCall.next.isDisabled,
      },
      edit: {
        label: firstCall.edit.label,
      },
      cancel: {
        label: firstCall.cancel.label,
      },
    }).toEqual({
      isOpen: true,
      isLocked: false,
      iChecked: false,
      order: 1,
      title: 'private_registry_create_region',
      next: {
        label: 'common_stepper_next_button_label',
        isDisabled: true,
      },
      edit: {
        label: 'common_stepper_modify_this_step',
      },
      cancel: {
        label: 'common_stepper_cancel_button_label',
      },
    });
  });

  describe('Content', () => {
    beforeAll(() => {
      (StepComponent as Mock).mockImplementationOnce(
        ({ children }: { children: JSX.Element }) => (
          <div data-testid="StepComponent">{children}</div>
        ),
      );
    });
    describe('Items', () => {
      it.skip("should render 'TilesInputComponent' with empty array if localisations regions is not valid", () => {
        (useProjectLocalisation as Mock).mockReturnValueOnce({
          data: null,
        });

        const spy = TilesInputComponent as Mock;

        compute();

        const { mock } = spy;
        const call = mock.calls[0][0];

        expect(call.items).toEqual([]);
      });

      describe('localisations regions is valid', () => {
        beforeAll(() => {
          (useProjectLocalisation as Mock).mockReturnValue({
            data: {
              regions: [
                {
                  name: 'name1',
                },
                {
                  name: 'name2',
                },
                {
                  name: 'name1',
                },
              ],
            },
          });
        });

        it('capabilities are not valid', () => {
          (useGetCapabilities as Mock).mockReturnValue({ data: null });

          const spy = TilesInputComponent as Mock;

          compute();

          const { mock } = spy;
          const call = mock.lastCall[0];

          expect(call.items).toEqual([]);
        });

        it('capabilities are valid', () => {
          (useGetCapabilities as Mock).mockReturnValue({
            data: [
              {
                regionName: 'name1',
                plans: [],
              },
              {
                regionName: 'name2',
                plans: [],
              },
              {
                regionName: 'name2',
                plans: [],
              },
            ],
          });

          const spy = TilesInputComponent as Mock;

          compute();

          const { mock } = spy;
          const call = mock.lastCall[0];

          const expectedRegions = [
            {
              name: 'name1',
            },
            {
              name: 'name2',
            },
            {
              name: 'name1',
            },
          ];

          expect(call.items).toEqual(expectedRegions);
        });
      });
    });
  });
});

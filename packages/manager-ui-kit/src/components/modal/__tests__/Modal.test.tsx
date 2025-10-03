import { describe, it } from 'vitest';
import { MODAL_COLOR } from '@ovhcloud/ods-react';
import { renderModal, heading, actions, ModalContent } from './ModalTest.utils';

describe('Modal Snapshot Tests', () => {
  it('displays the basic modal', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('displays the modal with actions', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('displays loading Modal', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      loading: true,
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('displays disabled primary and secondary buttons', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
      ...{
        primaryButton: {
          ...actions.primaryButton,
          disabled: true,
        },
        secondaryButton: {
          ...actions.secondaryButton,
          disabled: true,
        },
      },
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('displays loading primary and secondary buttons', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
      ...{
        primaryButton: {
          ...actions.primaryButton,
          loading: true,
        },
        secondaryButton: {
          ...actions.secondaryButton,
          loading: true,
        },
      },
    });
    expect(baseElement).toMatchSnapshot();
  });

  it('displays the modal with critical type', () => {
    const { baseElement } = renderModal({
      heading,
      children: <ModalContent />,
      ...actions,
      type: MODAL_COLOR.critical,
    });
    expect(baseElement).toMatchSnapshot();
  });
});

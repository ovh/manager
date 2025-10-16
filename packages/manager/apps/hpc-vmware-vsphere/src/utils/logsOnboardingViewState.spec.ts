import { describe, it, expect } from 'vitest';
import {
  getLogsViewState,
  LogsViewState,
  LogsViewStateProps,
} from './logsOnboardingViewState';
import { VMWareStatus } from '@/types/vsphere';

describe('getLogsViewState', () => {
  const baseProps: LogsViewStateProps = {
    isDatacenterError: false,
    isLoadingVsphere: false,
    isLoadingVsphereDatacenter: false,
    isCompatibilityMatrixLoading: false,
    isUserTrustedLoading: false,
    isLogForwarderDelivered: false,
    isLogForwarderIsCreating: false,
    isUserTrusted: false,
    currentStatus: VMWareStatus.PREMIER,
  };

  describe.each([
    {
      scenario: 'loading states',
      testCases: [
        {
          description: 'returns isLoading when isLoadingVsphere is true',
          props: { ...baseProps, isLoadingVsphere: true },
          expected: 'isLoading' as LogsViewState,
        },
        {
          description:
            'returns isLoading when isLoadingVsphereDatacenter is true',
          props: { ...baseProps, isLoadingVsphereDatacenter: true },
          expected: 'isLoading' as LogsViewState,
        },
        {
          description:
            'returns isLoading when isCompatibilityMatrixLoading is true',
          props: { ...baseProps, isCompatibilityMatrixLoading: true },
          expected: 'isLoading' as LogsViewState,
        },
        {
          description: 'returns isLoading when isUserTrustedLoading is true',
          props: { ...baseProps, isUserTrustedLoading: true },
          expected: 'isLoading' as LogsViewState,
        },
        {
          description:
            'returns isLoading when multiple loading states are true',
          props: {
            ...baseProps,
            isLoadingVsphere: true,
            isCompatibilityMatrixLoading: true,
          },
          expected: 'isLoading' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe.each([
    {
      scenario: 'error states',
      testCases: [
        {
          description: 'returns isError when isDatacenterError is true',
          props: { ...baseProps, isDatacenterError: true },
          expected: 'isError' as LogsViewState,
        },
        {
          description: 'returns isError even when other conditions are met',
          props: {
            ...baseProps,
            isDatacenterError: true,
            isLogForwarderDelivered: true,
            isUserTrusted: true,
          },
          expected: 'isError' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe.each([
    {
      scenario: 'onboarding states',
      testCases: [
        {
          description:
            'returns onboardingTrustedUser when log forwarder is delivered and user is trusted',
          props: {
            ...baseProps,
            isLogForwarderDelivered: true,
            isUserTrusted: true,
          },
          expected: 'onboardingTrustedUser' as LogsViewState,
        },
        {
          description:
            'returns onboardingCommonUser when log forwarder is delivered but user is not trusted',
          props: {
            ...baseProps,
            isLogForwarderDelivered: true,
            isUserTrusted: false,
          },
          expected: 'onboardingCommonUser' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe.each([
    {
      scenario: 'activation states',
      testCases: [
        {
          description:
            'returns LogsActivationInProgress when log forwarder is creating',
          props: { ...baseProps, isLogForwarderIsCreating: true },
          expected: 'LogsActivationInProgress' as LogsViewState,
        },
        {
          description:
            'returns LogsActivationInProgress even with other conditions',
          props: {
            ...baseProps,
            isLogForwarderIsCreating: true,
            currentStatus: VMWareStatus.ESSENTIALS,
          },
          expected: 'LogsActivationInProgress' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe.each([
    {
      scenario: 'status-based states',
      testCases: [
        {
          description: 'returns NeedLogsActivation when status is MIGRATING',
          props: { ...baseProps, currentStatus: VMWareStatus.MIGRATING },
          expected: 'NeedLogsActivation' as LogsViewState,
        },
        {
          description: 'returns NeedLogsActivation when status is PREMIER',
          props: { ...baseProps, currentStatus: VMWareStatus.PREMIER },
          expected: 'NeedLogsActivation' as LogsViewState,
        },
        {
          description: 'returns NeedLogsUpdate when status is ESSENTIALS',
          props: { ...baseProps, currentStatus: VMWareStatus.ESSENTIALS },
          expected: 'NeedLogsUpdate' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe.each([
    {
      scenario: 'edge cases and unknown states',
      testCases: [
        {
          description: 'returns UnknownState when no conditions match',
          props: {
            ...baseProps,
            currentStatus: ('SOME_OTHER_STATUS' as unknown) as VMWareStatus,
          },
          expected: 'UnknownState' as LogsViewState,
        },
      ],
    },
  ])('$scenario', ({ testCases }) => {
    it.each(testCases)('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });

  describe('priority testing', () => {
    it.each([
      {
        description: 'loading states take priority over all other conditions',
        props: {
          ...baseProps,
          isLoadingVsphere: true,
          isDatacenterError: true,
          isLogForwarderDelivered: true,
          isUserTrusted: true,
        },
        expected: 'isLoading' as LogsViewState,
      },
      {
        description: 'error state takes priority over onboarding states',
        props: {
          ...baseProps,
          isDatacenterError: true,
          isLogForwarderDelivered: true,
          isUserTrusted: true,
        },
        expected: 'isError' as LogsViewState,
      },
      {
        description:
          'onboarding trusted user takes priority over status-based states',
        props: {
          ...baseProps,
          isLogForwarderDelivered: true,
          isUserTrusted: true,
          currentStatus: VMWareStatus.ESSENTIALS,
        },
        expected: 'onboardingTrustedUser' as LogsViewState,
      },
      {
        description:
          'onboarding common user takes priority over status-based states',
        props: {
          ...baseProps,
          isLogForwarderDelivered: true,
          isUserTrusted: false,
          currentStatus: VMWareStatus.ESSENTIALS,
        },
        expected: 'onboardingCommonUser' as LogsViewState,
      },
      {
        description:
          'activation in progress takes priority over status-based states',
        props: {
          ...baseProps,
          isLogForwarderIsCreating: true,
          currentStatus: VMWareStatus.PREMIER,
        },
        expected: 'LogsActivationInProgress' as LogsViewState,
      },
    ])('$description', ({ props, expected }) => {
      expect(getLogsViewState(props)).toBe(expected);
    });
  });
});

import React from 'react';

import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

import { useNamespaceTranslation } from '@/hooks/useNamespaceTranslation';

// Create a test i18n instance
const createTestI18n = (resources: any) => {
  const testI18n = i18n.createInstance();
  testI18n.init({
    lng: 'en',
    fallbackLng: 'en',
    resources,
    interpolation: {
      escapeValue: false,
    },
  });
  return testI18n;
};

describe('useNamespaceTranslation', () => {
  it('should translate key from primary namespace when it exists', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
        },
        'dashboard': {
          title: 'Title from Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    expect(result.current('title')).toBe('Title overrided by PU');
  });

  it('should translate key from base namespace when not in primary', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
        },
        'dashboard': {
          title: 'Title from Base',
          subtitle: 'Subtitle from Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    expect(result.current('subtitle')).toBe('Subtitle from Base');
  });

  it('should handle array of keys', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
        },
        'dashboard': {
          subtitle: 'Subtitle',
          content: 'Content',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    const translations = result.current(['title', 'subtitle', 'content']);
    expect(Array.isArray(translations)).toBe(true);
    expect(translations).toEqual(['Title overrided by PU', 'Subtitle', 'Content']);
  });

  it('should use custom suffix when provided', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'metrics-custom': {
          cpu: 'CPU Custom',
        },
        'metrics': {
          cpu: 'CPU Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('metrics', '-custom'),
      { wrapper }
    );

    // Assert
    expect(result.current('cpu')).toBe('CPU Custom');
  });

  it('should use empty suffix when provided', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard': {
          title: 'Title from Dashboard',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard', ''),
      { wrapper }
    );

    // Assert
    expect(result.current('title')).toBe('Title from Dashboard');
  });

  it('should return key when translation does not exist', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {},
        'dashboard': {},
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    expect(result.current('nonexistent')).toBe('nonexistent');
  });

  it('should handle nested translation keys', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          metrics: {
            cpu: 'CPU Usage overrided by PU',
          },
        },
        'dashboard': {
          metrics: {
            memory: 'Memory Usage',
          },
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    expect(result.current('metrics.cpu')).toBe('CPU Usage overrided by PU');
    expect(result.current('metrics.memory')).toBe('Memory Usage');
  });

  it('should memoize translation function', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
        },
        'dashboard': {},
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result, rerender } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    // Assert
    expect(firstRender).toBe(secondRender);
  });

  it('should handle empty array', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {},
        'dashboard': {},
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    const translations = result.current([]);
    expect(Array.isArray(translations)).toBe(true);
    expect(translations).toEqual([]);
  });

  it('should translate all keys from base namespace if none exist in primary', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {},
        'dashboard': {
          title: 'Title Base',
          subtitle: 'Subtitle Base',
          content: 'Content Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    const translations = result.current(['title', 'subtitle', 'content']);
    expect(translations).toEqual(['Title Base', 'Subtitle Base', 'Content Base']);
  });

  it('should translate all keys from primary namespace if all exist', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
          subtitle: 'Subtitle overrided by PU',
          content: 'Content overrided by PU',
        },
        'dashboard': {
          title: 'Title Base',
          subtitle: 'Subtitle Base',
          content: 'Content Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    const translations = result.current(['title', 'subtitle', 'content']);
    expect(translations).toEqual(['Title overrided by PU', 'Subtitle overrided by PU', 'Content overrided by PU']);
  });

  it('should handle mixed translations from both namespaces', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'dashboard-override': {
          title: 'Title overrided by PU',
          content: 'Content overrided by PU',
        },
        'dashboard': {
          title: 'Title Base',
          subtitle: 'Subtitle Base',
          content: 'Content Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('dashboard'),
      { wrapper }
    );

    // Assert
    const translations = result.current(['title', 'subtitle', 'content']);
    expect(translations).toEqual(['Title overrided by PU', 'Subtitle Base', 'Content overrided by PU']);
  });

  it('should handle special characters in namespace', () => {
    // Arrange
    const testI18n = createTestI18n({
      en: {
        'my-dashboard-123-override': {
          test: 'Test Value overrided by PU',
        },
        'my-dashboard-123': {
          test: 'Test Base',
        },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <I18nextProvider i18n={testI18n}>{children}</I18nextProvider>
    );

    // Act
    const { result } = renderHook(
      () => useNamespaceTranslation('my-dashboard-123'),
      { wrapper }
    );

    // Assert
    expect(result.current('test')).toBe('Test Value overrided by PU');
  });
});

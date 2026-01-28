import { BreadcrumbConfig } from '@/types/breadcrumb/Breadcrumb.types';

/**
 * Props for the breadcrumb component
 */
export interface ObsBreadcrumbProps {
  /**
   * Custom breadcrumb configuration
   * If not provided, uses the default configuration
   */
  config?: BreadcrumbConfig;

  /**
   * Translation namespaces to load
   * @default ['breadcrumb']
   */
  translationNamespaces?: string[];
}

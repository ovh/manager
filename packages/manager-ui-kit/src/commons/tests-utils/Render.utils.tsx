import * as React from 'react';
import { ComponentType, JSX, MutableRefObject, ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Row } from '@tanstack/react-table';
import '@testing-library/jest-dom';
import { cleanup, render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import 'element-internals-polyfill';
import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';

import { BADGE_COLOR, BADGE_SIZE } from '@ovhcloud/ods-react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import type { ShellContextType } from '@ovh-ux/manager-react-shell-client';

import { shellContext } from '@/commons/tests-utils/Mock.utils';
import { BASE_ITEMS, BREADCRUMB_DEFAULT_PROPS } from '@/commons/tests-utils/StaticData.constants';
import { Person } from '@/commons/tests-utils/Type.utils';
import { FilterAdd, FilterAddProps } from '@/components';
import { ActionBanner } from '@/components/action-banner/ActionBanner.component';
import type { ActionBannerProps } from '@/components/action-banner/ActionBanner.props';
import { ActionMenu } from '@/components/action-menu/ActionMenu.component';
import { ActionMenuProps } from '@/components/action-menu/ActionMenu.props';
import { Badge } from '@/components/badge/Badge.component';
import { BadgeProps } from '@/components/badge/Badge.props';
import { BaseLayout } from '@/components/base-layout/BaseLayout.component';
import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { Datagrid } from '@/components/datagrid/Datagrid.component';
import { DatagridColumn, DatagridProps } from '@/components/datagrid/Datagrid.props';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      retry: false,
    },
    queries: {
      retry: false,
    },
  },
});

const Wrappers = ({ children }: { children: React.ReactElement }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.JSX.Element,
  options?: Omit<RenderOptions, 'queries'>,
): RenderResult => render(ui, { wrapper: Wrappers as ComponentType, ...options });

export { customRender as render, cleanup };

export const renderWithContext = ({ children }: { children: ReactNode }) =>
  customRender(<ShellContext.Provider value={shellContext}>{children}</ShellContext.Provider>);

export const renderActionBanner = (props: ActionBannerProps) =>
  customRender(<ActionBanner {...props} />);

export const renderActionMenu = (props: Partial<ActionMenuProps> = {}) =>
  customRender(
    <div data-testid="navigation-action-trigger-action">
      <ActionMenu
        id={props.id ?? 'action-menu-test-id'}
        items={props.items ?? BASE_ITEMS}
        {...props}
      />
    </div>,
  );

export const renderBadge = (props: Partial<BadgeProps> = {}) => {
  const defaultProps: BadgeProps = {
    color: BADGE_COLOR.information,
    size: BADGE_SIZE.md,
    children: 'Active',
    'data-testid': 'badge',
    ...props,
  };

  return customRender(<Badge {...defaultProps} />);
};

export const renderBaseLayout = ({
  children = null,
  ...rest
}: {
  children?: ReactNode;
  [x: string]: unknown;
}) => customRender(<BaseLayout {...rest}>{children}</BaseLayout>);

export const renderBreadcrumb = (props?: Partial<React.ComponentProps<typeof Breadcrumb>>) =>
  customRender(<Breadcrumb {...BREADCRUMB_DEFAULT_PROPS} {...props} />);

export const renderDataGrid = (
  props: Omit<DatagridProps<Person>, 'columns' | 'data'> & {
    columns: readonly DatagridColumn<Person>[];
    data: Person[];
    renderSubComponent?: (
      row: Row<Person>,
      headerRefs?: MutableRefObject<Record<string, HTMLTableCellElement>>,
    ) => JSX.Element;
  },
) => customRender(<Datagrid<Person> {...props} />);

export const renderFilterAdd = (props: FilterAddProps) => customRender(<FilterAdd {...props} />);

export const createMeWrapper = (
  mockShell: Partial<ShellContextType> = {},
): React.FC<React.PropsWithChildren> => {
  // eslint-disable-next-line react/no-multi-comp
  const MeWrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    <ShellContext.Provider value={mockShell as ShellContextType}>{children}</ShellContext.Provider>
  );

  MeWrapper.displayName = 'MeWrapper';

  return MeWrapper;
};

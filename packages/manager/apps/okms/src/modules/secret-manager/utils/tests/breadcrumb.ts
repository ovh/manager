import * as breadcrumbItemComponents from '@secret-manager/components/breadcrumb';
import { BREADCRUMB_ITEM_TEST_IDS } from '@secret-manager/components/breadcrumb/items/BreadcrumbItem.constants';
import { screen, waitFor } from '@testing-library/react';

type BreadcrumbItemName = keyof typeof breadcrumbItemComponents;

const breadcrumbTestIdMap: Record<BreadcrumbItemName, string> = {
  CreateSecretBreadcrumbItem: BREADCRUMB_ITEM_TEST_IDS.CREATE_SECRET,
  RootBreadcrumbItem: BREADCRUMB_ITEM_TEST_IDS.ROOT,
  OkmsBreadcrumbItem: BREADCRUMB_ITEM_TEST_IDS.OKMS,
  OkmsDashboardBreadcrumbItem: BREADCRUMB_ITEM_TEST_IDS.OKMS_DASHBOARD,
  SecretBreadcrumbItem: BREADCRUMB_ITEM_TEST_IDS.SECRET,
};

export const assertBreadcrumbItems = async (items: BreadcrumbItemName[]) => {
  await waitFor(
    () => {
      items.forEach((item) => {
        expect(screen.getByTestId(breadcrumbTestIdMap[item])).toBeInTheDocument();
      });
    },
    { timeout: 5_000 },
  );
};

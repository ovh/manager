import { ICustomWorld } from '@playwright-helpers';
import { expect } from '@playwright/test';

export const getActionMenu = async ({
  ctx,
  menuIndex = 0,
}: {
  ctx: ICustomWorld;
  menuIndex?: number;
}) => {
  const actionMenu = await ctx.page
    .locator('osds-button', {
      has: ctx.page.locator('osds-icon[name="ellipsis"]'),
    })
    .nth(menuIndex);

  await expect(actionMenu).toBeVisible();
  return actionMenu;
};

export const clickMenuButton = async ({
  ctx,
  label,
  menuIndex,
}: {
  ctx: ICustomWorld;
  menuIndex?: number;
  label: string;
}) => {
  const actionMenu = await getActionMenu({ ctx, menuIndex });
  await actionMenu.click();

  const button = await ctx.page
    .locator('osds-button', { hasText: label })
    .nth(0);

  await expect(button).toBeVisible();

  await button.click();
};

export const getDashboardEditButton = async ({
  ctx,
}: {
  ctx: ICustomWorld;
}) => {
  return ctx.page.locator('osds-button', {
    has: ctx.page.locator('osds-icon[name="pen"]'),
  });
};

import { ChromiumBrowser, chromium } from '@playwright/test';
import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  setWorldConstructor,
  setDefaultTimeout,
} from '@cucumber/cucumber';
import { env } from 'node:process';
import { ICustomWorld, CustomWorld } from './custom-world';
import { login, logout } from './login';
import { config } from './config';

setDefaultTimeout(30 * 1000);

setWorldConstructor(CustomWorld);

let browser: ChromiumBrowser;

BeforeAll(async function beforeAll() {
  browser = await chromium.launch({ headless: !!env.CI });
});

Before({ timeout: 60 * 1000 }, async function before(this: ICustomWorld) {
  this.handlersConfig = {};
  this.testContext = { inputTexts: {} };
  this.context = await browser.newContext();
  this.page = await this.context.newPage();
  await login(this.page);
  await this.page.waitForURL(this.testContext.initialUrl || config.appUrl, {
    waitUntil: 'load',
  });
});

After(async function after(this: ICustomWorld) {
  if (this.page) {
    await logout(this.page);
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function afterAll() {
  await browser.close();
});

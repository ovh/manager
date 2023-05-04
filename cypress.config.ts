import { defineConfig } from 'cypress';
import * as env from './cypress/cypress.env.json';

export default defineConfig({
  e2e: {
    specPattern: ['./packages/manager/apps/**/*.cy.ts'],
    env,
  },
});

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/commands.ts',
    video: false,
    chromeWebSecurity: false,
  },
});

import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';

export default defineConfig(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  globalIgnores([
    '**/dist/**',
    '**/dev-dist/**',
    '**/dist-ssr/**',
    '**/coverage/**'
  ]),

  tseslint.configs.recommended,
  // Apply TypeScript's core-rule overrides to Vue scripts as well as TS files.
  {
    ...tseslint.configs.eslintRecommended,
    name: 'app/vue-typescript-core-rules',
    files: ['**/*.vue']
  },
  pluginVue.configs['flat/essential'],
  {
    name: 'app/vue-typescript-parser',
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: {
          js: 'espree',
          jsx: 'espree',
          ts: tseslint.parser,
          tsx: tseslint.parser
        },
        ecmaVersion: 2024,
        ecmaFeatures: { jsx: false },
        extraFileExtensions: ['.vue']
      }
    },
    rules: {
      'vue/block-lang': ['error', { script: { lang: ['ts'], allowNoLang: false } }]
    }
  },
  {
    name: 'app/cypress-commonjs-config',
    files: ['cypress.config.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off'
    }
  },
  skipFormatting
);

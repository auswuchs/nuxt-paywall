import stylistic from '@stylistic/eslint-plugin'
import pluginJsonc from 'eslint-plugin-jsonc'
import simpleImportSort from 'eslint-plugin-simple-import-sort'

import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    ignores: ['server/db/migrations/**'],
  },

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    jsx: false,
  }),

  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@stylistic/brace-style': ['error', '1tbs'],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always',
      }],
      '@stylistic/keyword-spacing': ['error', { before: true, after: true }],
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/no-multiple-empty-lines': ['error', { max: 1 }],
      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      '@stylistic/operator-linebreak': ['error', 'before'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/spaced-comment': ['error', 'always'],
      '@stylistic/no-tabs': 'error',
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/type-annotation-spacing': 'error',
      '@stylistic/member-delimiter-style': ['error', {
        multiline: { delimiter: 'none' },
        singleline: { delimiter: 'comma' },
      }],
      '@stylistic/indent-binary-ops': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/object-property-newline': ['error', {
        allowAllPropertiesOnSameLine: true,
      }],

      'vue/html-indent': ['error', 2, { attribute: 1, baseIndent: 1 }],
      'vue/max-attributes-per-line': ['error', {
        singleline: { max: 1 },
        multiline: { max: 1 },
      }],
      'vue/first-attribute-linebreak': ['error', {
        singleline: 'beside',
        multiline: 'below',
      }],
      'vue/html-closing-bracket-newline': ['error', {
        singleline: 'never',
        multiline: 'always',
      }],
      'vue/multiline-html-element-content-newline': ['error', {
        ignoreWhenEmpty: true,
        allowEmptyLines: false,
        ignores: ['pre', 'textarea'],
      }],
      'vue/html-self-closing': ['error', {
        html: { void: 'always', normal: 'always', component: 'always' },
      }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-refs': 'error',
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits'],
      }],
      'vue/block-order': ['error', {
        order: ['script', 'template', 'style'],
      }],

      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      'no-console': 'warn',
      'no-debugger': 'error',
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['../*'],
          message: 'Используйте алиас ~/... или ~~/... вместо относительных путей',
        }],
      }],

      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    files: ['**/*.json', '**/*.jsonc'],
    rules: {
      'jsonc/indent': ['error', 2],
      'jsonc/key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'jsonc/comma-dangle': ['error', 'never'],
      'jsonc/array-bracket-spacing': ['error', 'never'],
      'jsonc/object-curly-spacing': ['error', 'always'],
    },
  },
)

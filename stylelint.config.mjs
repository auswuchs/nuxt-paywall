export default {
  extends: ['stylelint-config-standard-scss'],
  plugins: ['@stylistic/stylelint-plugin', 'stylelint-order'],
  rules: {
    '@stylistic/indentation': 2,
    '@stylistic/no-eol-whitespace': true,
    '@stylistic/no-missing-end-of-source-newline': true,

    'no-empty-source': null,
    'selector-class-pattern': null,
    'max-nesting-depth': [3, { ignoreAtRules: ['media', 'include'] }],
    'shorthand-property-no-redundant-values': true,
    'color-hex-length': 'short',
    'number-max-precision': 4,
    'declaration-block-single-line-max-declarations': 1,
    'declaration-block-no-redundant-longhand-properties': null,
    'selector-max-id': 0,
    'no-descending-specificity': null,

    'scss/no-duplicate-dollar-variables': true,

    // Позиционирование → Display/Flex → Box model → Типографика → Визуал → Анимации → Прочее
    'order/properties-order': [[
      'position', 'inset', 'top', 'right', 'bottom', 'left', 'z-index',

      'display', 'flex', 'flex-direction', 'flex-wrap', 'flex-grow', 'flex-shrink', 'flex-basis',
      'grid', 'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
      'place-items', 'place-content', 'align-items', 'align-content', 'align-self',
      'justify-content', 'justify-items', 'justify-self', 'gap', 'row-gap', 'column-gap', 'order',

      'box-sizing', 'width', 'min-width', 'max-width', 'height', 'min-height', 'max-height',
      'aspect-ratio', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'padding-inline', 'padding-block', 'margin', 'margin-top', 'margin-right', 'margin-bottom',
      'margin-left', 'margin-inline', 'margin-block', 'overflow', 'overflow-x', 'overflow-y',

      'font', 'font-family', 'font-size', 'font-weight', 'font-style', 'line-height',
      'letter-spacing', 'text-align', 'text-transform', 'text-decoration', 'text-wrap',
      'white-space', 'word-break', 'color',

      'background', 'background-color', 'border', 'border-width', 'border-style', 'border-color',
      'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius', 'outline',
      'outline-offset', 'box-shadow', 'opacity',

      'transition', 'animation', 'transform', 'will-change',

      'cursor', 'pointer-events', 'user-select', 'touch-action',
    ], { unspecified: 'bottomAlphabetical' }],
  },
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
    },
  ],
}

import eslint from '@eslint/js'
import tsEslint from 'typescript-eslint'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import vueParser from 'vue-eslint-parser'
import vuePlugin from 'eslint-plugin-vue'

export default [
  {
    ignores: ['node_modules', 'dist', '.husky', '.vscode', '.idea', '.gitignore']
  },
  eslint.configs.recommended,
  ...tsEslint.configs.recommended,
  ...vuePlugin.configs['flat/recommended'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsEslint.parser,
        sourceType: 'module'
      }
    },
    plugins: {
      ts: tsEslint.plugin
    },
    rules: {
      '@typescript-eslint/no-empty-function': ['off'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '.*',
          args: 'none'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/no-v-html': 'off',
      'vue/require-default-prop': 'off',
      'vue/require-explicit-emits': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/component-definition-name-casing': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'error'
    }
  },
  {
    files: ['**/*.js'],
    ...tsEslint.configs.disableTypeChecked
  },
  eslintPluginPrettier
]

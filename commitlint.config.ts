import { RuleConfigSeverity, UserConfig } from '@commitlint/types'

const config: UserConfig = {
  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  formatter: '@commitlint/format',
  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert', 'perf', 'ci']
    ],
    'body-empty': [RuleConfigSeverity.Disabled],
    'body-case': [RuleConfigSeverity.Error, 'always', ['lower-case', 'sentence-case']],
    'subject-empty': [RuleConfigSeverity.Error, 'never'],
    'subject-case': [RuleConfigSeverity.Disabled],
    'header-case': [RuleConfigSeverity.Disabled],
    'scope-empty': [RuleConfigSeverity.Disabled],
    'scope-case': [RuleConfigSeverity.Error, 'always', ['lower-case']]
  }
}

export default config

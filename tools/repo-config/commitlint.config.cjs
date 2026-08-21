const CONVENTIONAL_TYPES = [
  'build',
  'chore',
  'ci',
  'docs',
  'feat',
  'fix',
  'perf',
  'refactor',
  'revert',
  'style',
  'test',
];

const allowedScopes = [
  '@aarusso-nyx/stynx-internal-workspace',
  '@aarusso-nyx/stynx-internal-reference-api',
  '@aarusso-nyx/stynx-internal-reference-web',
  '@aarusso-nyx/stynx-backend',
  '@aarusso-nyx/stynx-contracts',
  '@aarusso-nyx/stynx-auth',
  '@aarusso-nyx/stynx-audit',
  '@aarusso-nyx/stynx-cli',
  '@aarusso-nyx/stynx-core',
  '@aarusso-nyx/stynx-data',
  '@aarusso-nyx/stynx-i18n',
  '@aarusso-nyx/stynx-privacy',
  '@aarusso-nyx/stynx-ratelimit',
  '@aarusso-nyx/stynx-idempotency',
  '@aarusso-nyx/stynx-health',
  '@aarusso-nyx/stynx-logging',
  '@aarusso-nyx/stynx-sessions',
  '@aarusso-nyx/stynx-storage',
  '@aarusso-nyx/stynx-tenancy',
  '@aarusso-nyx/stynx-testing',
  '@aarusso-nyx/stynx-angular',
  '@aarusso-nyx/stynx-angular-tenancy',
  '@aarusso-nyx/stynx-angular-auth',
  '@aarusso-nyx/stynx-angular-ui',
  '@aarusso-nyx/stynx-angular-i18n',
  '@aarusso-nyx/stynx-angular-trash',
  '@aarusso-nyx/stynx-angular-storage',
  '@aarusso-nyx/stynx-angular-sessions',
  '@aarusso-nyx/stynx-angular-profile',
  '@aarusso-nyx/stynx-internal-eslint-config',
  '@aarusso-nyx/stynx-internal-tsconfig',
  '@aarusso-nyx/stynx-internal-migration-linter',
  'clean',
  'deps',
  'deps-dev',
  'repo',
];

module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: new RegExp(
        `^(${CONVENTIONAL_TYPES.join('|')})(?:\\(([@\\w$.\\-*/ ]*)\\))?!?: (.+)$`,
      ),
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
  rules: {
    'type-enum': [2, 'always', CONVENTIONAL_TYPES],
    'scope-enum': [2, 'always', [...allowedScopes, '']],
    'subject-case': [0, 'never'],
    'subject-empty': [2, 'never'],
    'header-max-length': [2, 'always', 100],
    'header-trim': [2, 'always'],
  },
};

module.exports.allowedScopes = allowedScopes;

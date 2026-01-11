export default [
  {
    ignores: ['node_modules/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module'
    },
    rules: {
      'no-console': 'off'
    }
  }
];

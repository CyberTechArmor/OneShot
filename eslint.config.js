import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Allow explicit any in specific cases with comment
      '@typescript-eslint/no-explicit-any': 'warn',
      // Enforce consistent type imports
      '@typescript-eslint/consistent-type-imports': 'error',
      // Allow unused vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Allow deprecated APIs (drizzle pgTable overload migration)
      '@typescript-eslint/no-deprecated': 'warn',
      // Allow numbers in template literals
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      // Allow require imports for ESM/CJS interop
      '@typescript-eslint/no-require-imports': 'off',
      // Allow unsafe any operations in specific files
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      // Allow misused promises in event handlers
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],
      // Allow unnecessary conditions (for exhaustive checks)
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      // Allow unknown in catch
      '@typescript-eslint/use-unknown-in-catch-callback-variable': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'drizzle/**', '*.config.js'],
  }
);

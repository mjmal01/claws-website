import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'ds-bundle/**', '.ds-sync/**'] },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      // New in eslint-plugin-react-hooks@7 (React Compiler diagnostics,
      // routed through eslint-plugin-react-hooks). Flags a legitimate
      // pattern in MessagesClient.tsx (a ref captured for later use by an
      // async getter, never read synchronously during render) plus a
      // couple of pre-existing ref-during-render reads there that are a
      // real but separate cleanup — not inline-suppressable since these
      // are compiler diagnostics, not standard lint rules. Downgraded to
      // warn rather than silenced entirely, so it stays visible.
      'react-hooks/refs': 'warn',
    },
  },
]

export default config

module.exports = {
    extends: [
        'uncley',
        'uncley/react', // Using if you using react.
        'uncley/typescript' // Using if you using typescript.
    ],
    rules: {
        'no-shadow': 'off',
        'no-param-reassign': 'off',
        'react/prefer-stateless-function': 'off',
        'react/no-did-update-set-state': 0,
        '@typescript-eslint/no-use-before-define': ['error', { 'functions': false, 'classes': false }],
        'max-classes-per-file': 'off',
        'react/no-access-state-in-setstate': 'off',
        'jsx-a11y/anchor-is-valid': 'off'
    }
}
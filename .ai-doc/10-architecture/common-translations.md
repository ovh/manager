---
title: Common Translations
last_update: 2025-10-13
tags: [translations, i18n, ovhcloud, manager]
ai: true
---

# Common Translations

## Purpose
`@ovh-ux/manager-common-translations` maintains reusable i18n strings across µ‑apps.

### Adding New Namespace
1. Create folder under `public/translations`.
2. Add `Messages_fr_FR.json`.
3. Add keys (no app‑specific prefixes).

### Consuming
```ts
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

const { t } = useTranslation(NAMESPACES.example);
```

### Duplicated Translations CLI
```bash
yarn manager-cli duplicated-translations --app web-office
```
Warns about existing keys already present in the common package.

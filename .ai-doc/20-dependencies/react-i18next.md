---
title: React i18next
last_update: 2025-01-27
tags: [i18n, internationalization, react-i18next, i18next, ovhcloud, manager, translations]
ai: true
---

# React i18next

> **📦 Version:** `react-i18next@^14.0.5` + `i18next@^23.8.2`

## 🧭 Purpose

**React i18next** is the internationalization framework for React applications, providing translation management, locale switching, and pluralization support. In the OVHcloud Manager ecosystem, it's integrated with the shell system for consistent locale management across all µApps.

This package is essential for React µApps to provide multilingual support, manage translations, and integrate with the Manager shell's internationalization system.

## ⚙️ Context

React i18next is designed for:
- **Multilingual support** with locale switching
- **Translation management** with namespaces and lazy loading
- **Pluralization** and interpolation support
- **Shell integration** for consistent locale management
- **Dynamic loading** of translation files
- **Formatting** of dates, numbers, and currencies

This package is essential for:
- **React µApps** in the Manager ecosystem
- **User experience** in multiple languages
- **Translation consistency** across applications
- **Shell integration** for locale management

## 🔗 References

- [Manager React Shell Client](./manager-react-shell-client.md)
- [Manager React Core Application](./manager-react-core-application.md)
- [Common Translations](../10-architecture/common-translations.md)
- [React i18next Documentation](https://react.i18next.com/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "react-i18next": "^14.0.5",
    "i18next": "^23.8.2",
    "i18next-http-backend": "^2.4.3"
  }
}
```

### Basic i18n Setup

#### i18n Configuration

```typescript
// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import { initI18n } from '@ovh-ux/manager-react-core-application';

// Initialize i18n with shell integration
export const initializeI18n = async (locale: string, availableLocales: string[]) => {
  const t = await initI18n(locale, availableLocales);
  return t;
};

// Or configure manually
i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'fr_FR',
    fallbackLng: 'fr_FR',
    debug: process.env.NODE_ENV === 'development',
    
    backend: {
      loadPath: '/translations/{{lng}}/{{ns}}.json',
    },
    
    ns: ['common', 'dashboard', 'onboarding'],
    defaultNS: 'common',
    
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    
    react: {
      useSuspense: false,
    },
  });

export default i18n;
```

#### Shell Integration

```typescript
// i18n.ts
import { initI18n } from '@ovh-ux/manager-react-core-application';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

export const useI18n = () => {
  const { shell } = useContext(ShellContext);
  
  const initializeI18n = async () => {
    if (shell) {
      const locale = await shell.i18n.getLocale();
      const availableLocales = await shell.i18n.getAvailableLocales();
      
      return await initI18n(locale, availableLocales.map(l => l.key));
    }
  };
  
  return { initializeI18n };
};
```

### Translation Files Structure

#### File Organization

```
public/translations/
├── fr_FR/
│   ├── common.json
│   ├── dashboard.json
│   └── onboarding.json
├── en_GB/
│   ├── common.json
│   ├── dashboard.json
│   └── onboarding.json
└── de_DE/
    ├── common.json
    ├── dashboard.json
    └── onboarding.json
```

#### Translation File Examples

```json
// public/translations/fr_FR/common.json
{
  "welcome": "Bienvenue",
  "loading": "Chargement...",
  "error": "Une erreur est survenue",
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier"
  },
  "status": {
    "active": "Actif",
    "inactive": "Inactif",
    "pending": "En attente"
  }
}
```

```json
// public/translations/fr_FR/dashboard.json
{
  "title": "Tableau de bord",
  "services": {
    "title": "Services",
    "create": "Créer un service",
    "list": "Liste des services"
  },
  "metrics": {
    "title": "Métriques",
    "uptime": "Temps de fonctionnement",
    "performance": "Performance"
  }
}
```

### useTranslation Hook

#### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

function WelcomeComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('loading')}</p>
    </div>
  );
}
```

#### Namespace Usage

```typescript
import { useTranslation } from 'react-i18next';

function DashboardComponent() {
  const { t } = useTranslation('dashboard');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <h2>{t('services.title')}</h2>
      <button>{t('services.create')}</button>
    </div>
  );
}
```

#### Multiple Namespaces

```typescript
import { useTranslation } from 'react-i18next';

function ComplexComponent() {
  const { t: tCommon } = useTranslation('common');
  const { t: tDashboard } = useTranslation('dashboard');
  
  return (
    <div>
      <h1>{tDashboard('title')}</h1>
      <button>{tCommon('actions.save')}</button>
      <button>{tCommon('actions.cancel')}</button>
    </div>
  );
}
```

### Translation with Interpolation

#### Basic Interpolation

```typescript
import { useTranslation } from 'react-i18next';

function UserComponent({ user }: { user: User }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('welcome_user', { name: user.name })}</h1>
      <p>{t('user_info', { 
        email: user.email, 
        role: user.role 
      })}</p>
    </div>
  );
}
```

#### Translation with Interpolation

```json
// public/translations/fr_FR/common.json
{
  "welcome_user": "Bienvenue {{name}}",
  "user_info": "Email: {{email}}, Rôle: {{role}}",
  "item_count": "{{count}} élément(s)",
  "item_count_plural": "{{count}} éléments"
}
```

#### Pluralization

```typescript
import { useTranslation } from 'react-i18next';

function ItemList({ items }: { items: Item[] }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h2>{t('item_count', { count: items.length })}</h2>
      {items.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

#### Pluralization with Translation

```json
// public/translations/fr_FR/common.json
{
  "item_count": "{{count}} élément",
  "item_count_plural": "{{count}} éléments",
  "service_status": "{{count}} service actif",
  "service_status_plural": "{{count}} services actifs"
}
```

### Advanced Translation Patterns

#### Conditional Translation

```typescript
import { useTranslation } from 'react-i18next';

function StatusComponent({ status }: { status: string }) {
  const { t } = useTranslation();
  
  const getStatusTranslation = (status: string) => {
    switch (status) {
      case 'active':
        return t('status.active');
      case 'inactive':
        return t('status.inactive');
      case 'pending':
        return t('status.pending');
      default:
        return t('status.unknown');
    }
  };
  
  return (
    <div>
      <span>{getStatusTranslation(status)}</span>
    </div>
  );
}
```

#### Dynamic Translation Keys

```typescript
import { useTranslation } from 'react-i18next';

function DynamicComponent({ type }: { type: string }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t(`${type}.title`)}</h1>
      <p>{t(`${type}.description`)}</p>
    </div>
  );
}
```

#### Translation with HTML

```typescript
import { useTranslation } from 'react-i18next';

function HTMLComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('html_title')}</h1>
      <div dangerouslySetInnerHTML={{ 
        __html: t('html_content') 
      }} />
    </div>
  );
}
```

#### Translation with HTML

```json
// public/translations/fr_FR/common.json
{
  "html_title": "Titre avec <strong>HTML</strong>",
  "html_content": "Contenu avec <em>formatage</em> et <a href=\"#\">liens</a>"
}
```

### Locale Management

#### Locale Switching

```typescript
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function LocaleSelector() {
  const { i18n } = useTranslation();
  const { shell } = useContext(ShellContext);
  
  const availableLocales = [
    { code: 'fr_FR', name: 'Français' },
    { code: 'en_GB', name: 'English' },
    { code: 'de_DE', name: 'Deutsch' }
  ];
  
  const handleLocaleChange = async (locale: string) => {
    await i18n.changeLanguage(locale);
    
    // Update shell locale
    if (shell) {
      await shell.i18n.setLocale(locale);
    }
  };
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => handleLocaleChange(e.target.value)}
    >
      {availableLocales.map(locale => (
        <option key={locale.code} value={locale.code}>
          {locale.name}
        </option>
      ))}
    </select>
  );
}
```

#### Locale Detection

```typescript
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

function LocaleManager() {
  const { i18n } = useTranslation();
  const { shell } = useContext(ShellContext);
  
  useEffect(() => {
    const initializeLocale = async () => {
      if (shell) {
        const shellLocale = await shell.i18n.getLocale();
        if (shellLocale && shellLocale !== i18n.language) {
          await i18n.changeLanguage(shellLocale);
        }
      }
    };
    
    initializeLocale();
  }, [shell, i18n]);
  
  return null;
}
```

### Formatting and Utilities

#### Date Formatting

```typescript
import { useTranslation } from 'react-i18next';

function DateComponent({ date }: { date: Date }) {
  const { t, i18n } = useTranslation();
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(i18n.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div>
      <p>{t('date_label')}: {formatDate(date)}</p>
    </div>
  );
}
```

#### Number Formatting

```typescript
import { useTranslation } from 'react-i18next';

function NumberComponent({ value }: { value: number }) {
  const { t, i18n } = useTranslation();
  
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };
  
  return (
    <div>
      <p>{t('price_label')}: {formatNumber(value)}</p>
    </div>
  );
}
```

#### Pluralization with Count

```typescript
import { useTranslation } from 'react-i18next';

function CountComponent({ count }: { count: number }) {
  const { t } = useTranslation();
  
  return (
    <div>
      <p>{t('item_count', { count })}</p>
      <p>{t('service_count', { count })}</p>
    </div>
  );
}
```

### Namespace Management

#### Lazy Loading Namespaces

```typescript
import { useTranslation } from 'react-i18next';

function LazyComponent() {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    // Load namespace when component mounts
    i18n.loadNamespaces('dashboard');
  }, [i18n]);
  
  return (
    <div>
      <h1>{t('dashboard:title')}</h1>
    </div>
  );
}
```

#### Preloading Namespaces

```typescript
import { useTranslation } from 'react-i18next';

function App() {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    // Preload all required namespaces
    i18n.loadNamespaces(['common', 'dashboard', 'onboarding']);
  }, [i18n]);
  
  return <AppContent />;
}
```

### Error Handling

#### Translation Error Handling

```typescript
import { useTranslation } from 'react-i18next';

function SafeTranslationComponent() {
  const { t } = useTranslation();
  
  const safeTranslate = (key: string, options?: any) => {
    try {
      return t(key, options);
    } catch (error) {
      console.warn(`Translation error for key: ${key}`, error);
      return key; // Fallback to key
    }
  };
  
  return (
    <div>
      <h1>{safeTranslate('welcome')}</h1>
      <p>{safeTranslate('nonexistent_key')}</p>
    </div>
  );
}
```

#### Missing Translation Handling

```typescript
// i18n.ts
i18n.init({
  // ... other options
  saveMissing: true,
  missingKeyHandler: (lng, ns, key, fallbackValue) => {
    console.warn(`Missing translation: ${key} in ${lng}/${ns}`);
  },
  interpolation: {
    escapeValue: false,
  },
});
```

### Testing Translations

#### Translation Testing

```typescript
import { render, screen } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={i18n}>
      {component}
    </I18nextProvider>
  );
};

test('renders translated text', () => {
  renderWithI18n(<WelcomeComponent />);
  expect(screen.getByText('Bienvenue')).toBeInTheDocument();
});
```

#### Mock Translations

```typescript
// test-utils.ts
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';

const mockI18n = {
  ...i18n,
  t: (key: string) => key, // Return key as fallback
  changeLanguage: jest.fn(),
  loadNamespaces: jest.fn(),
};

export const renderWithI18n = (component: React.ReactElement) => {
  return render(
    <I18nextProvider i18n={mockI18n}>
      {component}
    </I18nextProvider>
  );
};
```

### Best Practices

#### 1. Namespace Organization

```typescript
// ✅ CORRECT: Logical namespace structure
const namespaces = [
  'common',      // Shared translations
  'dashboard',   // Dashboard-specific
  'onboarding',  // Onboarding-specific
  'errors'       // Error messages
];

// ❌ WRONG: Flat namespace structure
const namespaces = [
  'translations' // Too generic
];
```

#### 2. Translation Keys

```json
// ✅ CORRECT: Hierarchical key structure
{
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler"
  },
  "status": {
    "active": "Actif",
    "inactive": "Inactif"
  }
}

// ❌ WRONG: Flat key structure
{
  "action_save": "Enregistrer",
  "action_cancel": "Annuler",
  "status_active": "Actif",
  "status_inactive": "Inactif"
}
```

#### 3. Interpolation Usage

```typescript
// ✅ CORRECT: Proper interpolation
const { t } = useTranslation();
return <h1>{t('welcome_user', { name: user.name })}</h1>;

// ❌ WRONG: String concatenation
return <h1>{t('welcome')} {user.name}</h1>;
```

### Common Pitfalls

#### ❌ Wrong: Missing Namespace

```typescript
// Don't forget to specify namespace
function DashboardComponent() {
  const { t } = useTranslation(); // Missing namespace
  return <h1>{t('title')}</h1>; // Will look in default namespace
}
```

#### ✅ Correct: Specify Namespace

```typescript
function DashboardComponent() {
  const { t } = useTranslation('dashboard');
  return <h1>{t('title')}</h1>; // Will look in dashboard namespace
}
```

#### ❌ Wrong: Hardcoded Strings

```typescript
// Don't use hardcoded strings
function Component() {
  return <h1>Welcome</h1>; // Not translatable
}
```

#### ✅ Correct: Use Translations

```typescript
function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>; // Translatable
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use useTranslation**: Use the useTranslation hook for all text content
2. **Specify namespaces**: Always specify the appropriate namespace for translations
3. **Use interpolation**: Use interpolation for dynamic content instead of string concatenation
4. **Handle missing translations**: Implement fallbacks for missing translation keys
5. **Use proper key structure**: Follow hierarchical key structure for organization
6. **Implement locale switching**: Provide locale switching functionality
7. **Test translations**: Include translation testing in component tests
8. **Follow naming conventions**: Use consistent naming for translation keys

### Translation Setup Checklist

- [ ] i18n configuration completed
- [ ] Namespaces defined and organized
- [ ] Translation files created for all locales
- [ ] Shell integration implemented
- [ ] Locale switching configured
- [ ] Error handling implemented
- [ ] Testing setup completed

### Translation Usage Checklist

- [ ] useTranslation hook used consistently
- [ ] Namespaces specified correctly
- [ ] Interpolation used for dynamic content
- [ ] Pluralization handled properly
- [ ] HTML content escaped correctly
- [ ] Missing translations handled gracefully

### Performance Optimization Checklist

- [ ] Lazy loading implemented for namespaces
- [ ] Preloading configured for critical namespaces
- [ ] Caching enabled for translation files
- [ ] Bundle size optimized
- [ ] Memory usage monitored

---

## ⚖️ The i18n's Moral

- **Consistent translations** ensure professional user experience across all languages
- **Proper namespace organization** makes translations maintainable and scalable
- **Interpolation and pluralization** provide natural language support
- **Shell integration** ensures consistent locale management across applications

**👉 Good internationalization is invisible to users but essential for global applications.**

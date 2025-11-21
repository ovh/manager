---
title: Manager Config
version: 8.6.6
last_update: 2025-11-21
tags: [config, environment, ovhcloud, manager, application, user, region, locale]
ai: true
---

# Manager Config

> **📦 Version:** `@ovh-ux/manager-config@^8.6.6`

## 🧭 Purpose

The **Manager Config** package provides environment configuration management for OVHcloud Manager applications. It handles user information, region settings, application URLs, and locale management across the Manager ecosystem.

This package is essential for managing application configuration, user context, and environment-specific settings in Manager applications.

## ⚙️ Context

Manager Config is designed for:
- **Environment management** with region and user context
- **Application configuration** with URLs and metadata
- **User management** with locale and personal information
- **Locale handling** with language and country support
- **Configuration fetching** from remote sources

This package is essential for:
- **React µApps** in the Manager ecosystem
- **Environment-specific** configuration
- **User context** management
- **Application routing** and URL generation

## 🔗 References

- [Manager React Core Application](./manager-react-core-application.md)
- [Manager React Shell Client](./manager-react-shell-client.md)
- [Shell](./shell.md)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-config": "^8.6.6"
  }
}
```

### Environment Configuration

#### Basic Environment Setup

```typescript
import { Environment, fetchConfiguration } from '@ovh-ux/manager-config';

// Fetch configuration for an application
const environment = await fetchConfiguration('bmc-nasha');

// Access environment properties
const region = environment.getRegion();
const user = environment.getUser();
const locale = environment.getUserLocale();
const universe = environment.getUniverse();
```

#### Environment Class Usage

```typescript
import { Environment } from '@ovh-ux/manager-config';

// Create environment instance
const env = new Environment({
  region: 'EU',
  userLocale: 'fr_FR',
  applicationName: 'bmc-nasha',
  universe: 'BareMetalCloud'
});

// Set environment properties
env.setRegion('EU');
env.setUserLocale('fr_FR');
env.setApplicationName('bmc-nasha');
env.setUniverse('BareMetalCloud');
```

### Region Management

#### Region Enum

```typescript
import { Region } from '@ovh-ux/manager-config';

// Available regions
const regions = {
  EU: 'EU',
  CA: 'CA',
  US: 'US'
};

// Set region
env.setRegion(Region.EU);

// Get current region
const currentRegion = env.getRegion();
```

#### Hostname Regions

```typescript
import { HOSTNAME_REGIONS } from '@ovh-ux/manager-config';

// Hostname to region mapping
const hostnameRegions = {
  'manager.ovh.com': 'EU',
  'ca.manager.ovh.com': 'CA',
  'us.manager.ovh.com': 'US'
};

// Get region from hostname
const region = HOSTNAME_REGIONS[window.location.hostname];
```

### User Management

#### User Interface

```typescript
import { User } from '@ovh-ux/manager-config';

// User properties
interface User {
  nichandle: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  language: string;
  currency: string;
  // ... other user properties
}

// Set user information
env.setUser({
  nichandle: 'user123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  country: 'FR',
  language: 'fr',
  currency: 'EUR'
});

// Get user information
const user = env.getUser();
const nichandle = user.nichandle;
const email = user.email;
```

#### User Locale Management

```typescript
// Set user locale
env.setUserLocale('fr_FR');

// Get user locale
const userLocale = env.getUserLocale(); // 'fr_FR'

// Get user language
const userLanguage = env.getUserLanguage(); // 'fr'
```

### Application Configuration

#### Application Interface

```typescript
import { Application, ApplicationId } from '@ovh-ux/manager-config';

// Application configuration
interface Application {
  universe: string;
  url: string;
  container: Container;
  publicURL?: string;
}

// Container configuration
interface Container {
  enabled: boolean;
  isDefault: boolean;
  path: string;
  hash?: string;
  hashes?: string[];
  containerURL: string;
}
```

#### Application URLs

```typescript
// Set application URLs
env.setApplicationURLs({
  'bmc-nasha': '/nasha',
  'billing': '/billing',
  'support': '/support'
});

// Get application URLs
const urls = env.getApplicationURLs();

// Get specific application URL
const nashaUrl = env.getApplicationURL('bmc-nasha');
```

#### Application Management

```typescript
// Set application name
env.setApplicationName('bmc-nasha');

// Get application name
const appName = env.getApplicationName();

// Get current application
const application = env.getApplication();
```

### Universe Management

#### Universe Configuration

```typescript
// Set universe
env.setUniverse('BareMetalCloud');

// Get universe
const universe = env.getUniverse();

// Set universe from application ID
const universeFromApp = env.setUniverseFromApplicationId('bmc-nasha');
```

#### Application Universe Mapping

```typescript
// Common universe mappings
const universeMappings = {
  'bmc-nasha': 'BareMetalCloud',
  'pci': 'PublicCloud',
  'billing': 'Billing',
  'support': 'Support'
};
```

### Locale Management

#### Locale Constants

```typescript
import { LangId } from '@ovh-ux/manager-config';

// Available language IDs
const languageIds = {
  FR: 'fr',
  EN: 'en',
  DE: 'de',
  ES: 'es',
  IT: 'it'
};

// Locale constants
const locales = {
  FR_FR: 'fr_FR',
  EN_GB: 'en_GB',
  DE_DE: 'de_DE',
  ES_ES: 'es_ES',
  IT_IT: 'it_IT'
};
```

#### Country Code Enum

```typescript
import { CountryCode } from '@ovh-ux/manager-config';

// Country codes
const countryCodes = {
  FR: 'FR',
  GB: 'GB',
  DE: 'DE',
  ES: 'ES',
  IT: 'IT',
  CA: 'CA',
  US: 'US'
};
```

### Message Management

#### Environment Messages

```typescript
// Set environment messages
env.setMessage({
  fr: {
    description: 'Description en français'
  },
  en: {
    description: 'Description in English'
  }
});

// Get environment messages
const messages = env.getMessage();
const frenchDescription = messages.fr.description;
```

### Advanced Usage Patterns

#### Configuration Fetching

```typescript
import { fetchConfiguration } from '@ovh-ux/manager-config';

// Fetch configuration for application
const fetchAppConfig = async (appName: string) => {
  try {
    const config = await fetchConfiguration(appName);
    
    // Use configuration
    console.log('Region:', config.getRegion());
    console.log('User:', config.getUser());
    console.log('Locale:', config.getUserLocale());
    
    return config;
  } catch (error) {
    console.error('Failed to fetch configuration:', error);
    throw error;
  }
};

// Usage
const nashaConfig = await fetchAppConfig('bmc-nasha');
```

#### Top-Level Application Detection

```typescript
import { isTopLevelApplication } from '@ovh-ux/manager-config';

// Check if running as top-level application
const isTopLevel = isTopLevelApplication();

if (isTopLevel) {
  // Running as main application
  console.log('Running as top-level application');
} else {
  // Running as µApp
  console.log('Running as micro-application');
}
```

#### Environment Initialization

```typescript
// Complete environment initialization
const initializeEnvironment = async () => {
  try {
    // Fetch configuration
    const environment = await fetchConfiguration('bmc-nasha');
    
    // Set additional properties
    environment.setVersion('1.0.0');
    environment.setUniverse('BareMetalCloud');
    
    // Configure application URLs
    environment.setApplicationURLs({
      'bmc-nasha': '/nasha',
      'billing': '/billing',
      'support': '/support'
    });
    
    return environment;
  } catch (error) {
    console.error('Environment initialization failed:', error);
    throw error;
  }
};
```

### Integration with Shell

#### Shell Environment Integration

```typescript
import { Environment } from '@ovh-ux/manager-config';
import { initShellClient } from '@ovh-ux/shell';

// Initialize shell with environment
const initializeShellWithEnvironment = async () => {
  const environment = new Environment();
  
  // Configure environment
  environment.setRegion('EU');
  environment.setUserLocale('fr_FR');
  environment.setApplicationName('bmc-nasha');
  
  // Initialize shell
  const shell = await initShellClient();
  
  // Set environment in shell
  await shell.environment.setEnvironment(environment);
  
  return { shell, environment };
};
```

#### React Integration

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Environment } from '@ovh-ux/manager-config';

// Use environment in React components
function EnvironmentComponent() {
  const { environment } = useContext(ShellContext);
  
  if (!environment) {
    return <div>Loading environment...</div>;
  }
  
  const region = environment.getRegion();
  const user = environment.getUser();
  const locale = environment.getUserLocale();
  
  return (
    <div>
      <p>Region: {region}</p>
      <p>User: {user.nichandle}</p>
      <p>Locale: {locale}</p>
    </div>
  );
}
```

### Best Practices

#### 1. Environment Initialization

```typescript
// ✅ CORRECT: Proper environment initialization
const initializeEnvironment = async () => {
  try {
    const environment = await fetchConfiguration('bmc-nasha');
    
    // Set additional configuration
    environment.setVersion(process.env.VERSION || '1.0.0');
    environment.setUniverse('BareMetalCloud');
    
    return environment;
  } catch (error) {
    console.error('Environment initialization failed:', error);
    throw error;
  }
};

// ❌ WRONG: Missing error handling
const environment = await fetchConfiguration('bmc-nasha');
```

#### 2. User Management

```typescript
// ✅ CORRECT: Proper user management
const setUserInformation = (userData: User) => {
  environment.setUser(userData);
  environment.setUserLocale(userData.language + '_' + userData.country);
};

// ❌ WRONG: Incomplete user setup
environment.setUser(userData);
// Missing locale setting
```

#### 3. Application URLs

```typescript
// ✅ CORRECT: Complete application URL setup
const setupApplicationURLs = () => {
  environment.setApplicationURLs({
    'bmc-nasha': '/nasha',
    'billing': '/billing',
    'support': '/support'
  });
};

// ❌ WRONG: Missing application URLs
// No application URL configuration
```

### Common Pitfalls

#### ❌ Wrong: Missing Environment Initialization

```typescript
// Don't forget to initialize environment
function MyComponent() {
  const environment = useEnvironment(); // May be null
  const region = environment.getRegion(); // Error if null
}
```

#### ✅ Correct: Proper Environment Handling

```typescript
function MyComponent() {
  const environment = useEnvironment();
  
  if (!environment) {
    return <div>Loading environment...</div>;
  }
  
  const region = environment.getRegion();
  return <div>Region: {region}</div>;
}
```

#### ❌ Wrong: Missing Error Handling

```typescript
// Don't ignore configuration errors
const environment = await fetchConfiguration('bmc-nasha');
```

#### ✅ Correct: Handle Configuration Errors

```typescript
try {
  const environment = await fetchConfiguration('bmc-nasha');
  // Use environment
} catch (error) {
  console.error('Configuration fetch failed:', error);
  // Handle error appropriately
}
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always initialize environment**: Use fetchConfiguration or new Environment()
2. **Handle environment errors**: Wrap configuration calls in try-catch blocks
3. **Set complete user information**: Include locale and user data
4. **Configure application URLs**: Set up proper application routing
5. **Use proper types**: Use Environment, User, Application interfaces
6. **Handle null environment**: Check for environment availability
7. **Set universe correctly**: Use appropriate universe for application
8. **Configure locale properly**: Set user locale and language

### Environment Setup Checklist

- [ ] Environment initialized with fetchConfiguration or new Environment()
- [ ] Region configured correctly
- [ ] User information set completely
- [ ] Locale configured properly
- [ ] Application URLs set up
- [ ] Universe configured
- [ ] Error handling implemented
- [ ] Version information set

### User Management Checklist

- [ ] User object created with all required fields
- [ ] Locale set based on user language and country
- [ ] User information updated when changed
- [ ] User context available in components
- [ ] User validation implemented
- [ ] User error handling

### Application Configuration Checklist

- [ ] Application name set correctly
- [ ] Application URLs configured
- [ ] Universe set appropriately
- [ ] Container configuration handled
- [ ] Application routing set up
- [ ] Application metadata configured

---

## ⚖️ The Config's Moral

- **Consistent configuration** ensures predictable behavior across all applications
- **Proper environment management** provides context for application functionality
- **User context** enables personalized experiences and proper localization
- **Application configuration** enables proper routing and integration

**👉 Good configuration management is invisible to users but essential for application functionality.**

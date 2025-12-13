---
title: Manager Core Utils
version: 0.4.5
last_update: 2025-11-21
tags: [utils, core, ovhcloud, manager, datefns, react, formatter]
ai: true
---

# Manager Core Utils

> **📦 Version:** `@ovh-ux/manager-core-utils@^0.4.5`

## 🧭 Purpose

The **Manager Core Utils** package provides essential utility functions for OVHcloud Manager applications. It includes locale normalization utilities (Manager locale to Date-fns locale) and React formatters for data grids.

This package provides locale normalization utilities and React component formatters for data grids used across Manager applications.

## ⚙️ Context

Manager Core Utils is designed for:
- **Locale normalization** from Manager locale to Date-fns locale
- **React component formatting** for data grids

This package is essential for:
- **Locale normalization** from Manager locale to Date-fns locale
- **Data grid formatting** with React components

## 🔗 References

- [Manager Core API](./manager-core-api.md)
- [React i18next](./react-i18next.md)
- [Date-fns Documentation](https://date-fns.org/)

## 📘 Guidelines / Implementation

### Package Installation

```json
{
  "dependencies": {
    "@ovh-ux/manager-core-utils": "^0.4.5"
  }
}
```

### Date-fns Locale Utilities

#### getDateFnsLocale Function

```typescript
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

// Convert OVH locale to date-fns locale
const dateFnsLocale = getDateFnsLocale('fr_FR'); // Returns 'fr'
const dateFnsLocaleGB = getDateFnsLocale('en_GB'); // Returns 'enGB'
const dateFnsLocaleCA = getDateFnsLocale('fr_CA'); // Returns 'frCA'
const dateFnsLocaleDE = getDateFnsLocale('de_DE'); // Returns 'de'
```

#### Locale Conversion Examples

```typescript
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

// Common OVH locales to date-fns conversion
const localeMap = {
  'fr_FR': getDateFnsLocale('fr_FR'),     // 'fr'
  'en_GB': getDateFnsLocale('en_GB'),     // 'enGB'
  'en_US': getDateFnsLocale('en_US'),     // 'en'
  'de_DE': getDateFnsLocale('de_DE'),     // 'de'
  'es_ES': getDateFnsLocale('es_ES'),     // 'es'
  'it_IT': getDateFnsLocale('it_IT'),     // 'it'
  'fr_CA': getDateFnsLocale('fr_CA'),     // 'frCA'
};
```

#### Integration with date-fns

```typescript
import { format, parseISO } from 'date-fns';
import { fr, enGB, de, es, it } from 'date-fns/locale';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

// Locale mapping for date-fns
const dateFnsLocales = {
  fr,
  enGB,
  de,
  es,
  it,
  frCA: fr, // Use French locale for Canadian French
};

function formatDate(date: string, ovhLocale: string) {
  const dateFnsLocale = getDateFnsLocale(ovhLocale);
  const locale = dateFnsLocales[dateFnsLocale] || enGB;
  
  return format(parseISO(date), 'PPP', { locale });
}

// Usage examples
const formattedDate = formatDate('2024-01-15', 'fr_FR'); // "15 janvier 2024"
const formattedDateEN = formatDate('2024-01-15', 'en_GB'); // "15th January 2024"
const formattedDateDE = formatDate('2024-01-15', 'de_DE'); // "15. Januar 2024"
```

### React Formatter for Data Grids

#### ReactFormatter Function

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Create a React formatter for data grids
const StatusFormatter = ReactFormatter(
  <div className="status-badge">
    <span className="status-indicator"></span>
    <span className="status-text"></span>
  </div>
);

// Use in data grid configuration
const columns = [
  {
    field: 'status',
    title: 'Status',
    formatter: StatusFormatter
  }
];
```

#### Advanced React Formatter

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Create a formatter with props
const UserFormatter = ReactFormatter(
  <div className="user-info">
    <img className="user-avatar" />
    <div className="user-details">
      <span className="user-name"></span>
      <span className="user-email"></span>
    </div>
  </div>
);

// The formatter receives cellData and rowData as props
const columns = [
  {
    field: 'user',
    title: 'User',
    formatter: UserFormatter
  }
];
```

#### Custom React Component Formatter

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Define a custom React component
const StatusBadge = ({ cellData, rowData }: { cellData: any; rowData: any }) => {
  const status = cellData;
  const isActive = status === 'active';
  
  return (
    <div className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      <span className="status-dot"></span>
      <span className="status-text">{status}</span>
    </div>
  );
};

// Create formatter with the component
const StatusFormatter = ReactFormatter(<StatusBadge />);

// Use in data grid
const columns = [
  {
    field: 'status',
    title: 'Status',
    formatter: StatusFormatter
  }
];
```

### Integration Patterns

#### With TanStack Table

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';

const columnHelper = createColumnHelper<Service>();

const columns = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: ({ getValue, row }) => {
      const name = getValue();
      const service = row.original;
      
      return (
        <div className="service-name">
          <span className="name">{name}</span>
          <span className="id">#{service.id}</span>
        </div>
      );
    }
  }),
  columnHelper.accessor('status', {
    header: 'Status',
    cell: ({ getValue }) => {
      const status = getValue();
      return (
        <div className={`status-badge ${status}`}>
          {status}
        </div>
      );
    }
  })
];
```

#### With Data Grid Libraries

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Define formatter components
const ActionButtons = ({ cellData, rowData }: { cellData: any; rowData: any }) => (
  <div className="action-buttons">
    <button onClick={() => handleEdit(rowData.id)}>Edit</button>
    <button onClick={() => handleDelete(rowData.id)}>Delete</button>
  </div>
);

const ActionFormatter = ReactFormatter(<ActionButtons />);

// Use in grid configuration
const gridOptions = {
  columnDefs: [
    { field: 'name', headerName: 'Name' },
    { field: 'status', headerName: 'Status' },
    { field: 'actions', headerName: 'Actions', formatter: ActionFormatter }
  ]
};
```

### Date Formatting Integration

#### With React i18next

```typescript
import { useTranslation } from 'react-i18next';
import { format, parseISO } from 'date-fns';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { fr, enGB, de } from 'date-fns/locale';

function DateComponent({ date }: { date: string }) {
  const { i18n } = useTranslation();
  
  const formatDate = (dateString: string) => {
    const dateFnsLocale = getDateFnsLocale(i18n.language);
    const locale = { fr, enGB, de }[dateFnsLocale] || enGB;
    
    return format(parseISO(dateString), 'PPP', { locale });
  };
  
  return (
    <div>
      <p>Date: {formatDate(date)}</p>
    </div>
  );
}
```

#### With Shell Integration

```typescript
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format, parseISO } from 'date-fns';
import { fr, enGB, de } from 'date-fns/locale';

function ShellDateComponent({ date }: { date: string }) {
  const { shell } = useContext(ShellContext);
  
  const [locale, setLocale] = useState('fr_FR');
  
  useEffect(() => {
    const getShellLocale = async () => {
      if (shell) {
        const shellLocale = await shell.i18n.getLocale();
        setLocale(shellLocale);
      }
    };
    
    getShellLocale();
  }, [shell]);
  
  const formatDate = (dateString: string) => {
    const dateFnsLocale = getDateFnsLocale(locale);
    const dateFnsLocaleObj = { fr, enGB, de }[dateFnsLocale] || enGB;
    
    return format(parseISO(dateString), 'PPP', { locale: dateFnsLocaleObj });
  };
  
  return (
    <div>
      <p>Date: {formatDate(date)}</p>
    </div>
  );
}
```

### Advanced Usage Patterns

#### Custom Date Formatter Component

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format, parseISO, isValid } from 'date-fns';
import { fr, enGB, de } from 'date-fns/locale';
import React from 'react';

const DateFormatter = ({ cellData, rowData }: { cellData: any; rowData: any }) => {
  const date = cellData;
  const locale = rowData.locale || 'fr_FR';
  
  if (!date || !isValid(parseISO(date))) {
    return <span className="date-invalid">Invalid date</span>;
  }
  
  const dateFnsLocale = getDateFnsLocale(locale);
  const localeObj = { fr, enGB, de }[dateFnsLocale] || enGB;
  
  const formattedDate = format(parseISO(date), 'PPP', { locale: localeObj });
  
  return (
    <div className="date-cell">
      <span className="date-formatted">{formattedDate}</span>
      <span className="date-relative">{formatDistanceToNow(parseISO(date), { locale: localeObj })}</span>
    </div>
  );
};

const DateFormatterComponent = ReactFormatter(<DateFormatter />);
```

#### Status Formatter with Icons

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

const StatusIconFormatter = ({ cellData, rowData }: { cellData: any; rowData: any }) => {
  const status = cellData;
  
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'active':
        return { icon: '✓', color: 'green', label: 'Active' };
      case 'inactive':
        return { icon: '✗', color: 'red', label: 'Inactive' };
      case 'pending':
        return { icon: '⏳', color: 'orange', label: 'Pending' };
      default:
        return { icon: '?', color: 'gray', label: 'Unknown' };
    }
  };
  
  const config = getStatusConfig(status);
  
  return (
    <div className={`status-cell ${config.color}`}>
      <span className="status-icon">{config.icon}</span>
      <span className="status-label">{config.label}</span>
    </div>
  );
};

const StatusIconFormatterComponent = ReactFormatter(<StatusIconFormatter />);
```

### Best Practices

#### 1. Locale Handling

```typescript
// ✅ CORRECT: Proper locale conversion
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

const formatDate = (date: string, ovhLocale: string) => {
  const dateFnsLocale = getDateFnsLocale(ovhLocale);
  const locale = dateFnsLocales[dateFnsLocale] || enGB;
  return format(parseISO(date), 'PPP', { locale });
};

// ❌ WRONG: Direct locale usage
const formatDate = (date: string, locale: string) => {
  return format(parseISO(date), 'PPP', { locale }); // locale format mismatch
};
```

#### 2. React Formatter Usage

```typescript
// ✅ CORRECT: Proper React formatter
const StatusFormatter = ReactFormatter(
  <div className="status-badge">
    <span className="status-text"></span>
  </div>
);

// ❌ WRONG: Direct JSX in formatter
const StatusFormatter = (cellData: any) => {
  return <div className="status-badge">{cellData}</div>; // Not a formatter function
};
```

#### 3. Error Handling

```typescript
// ✅ CORRECT: Error handling in formatters
const SafeDateFormatter = ({ cellData, rowData }: { cellData: any; rowData: any }) => {
  try {
    if (!cellData || !isValid(parseISO(cellData))) {
      return <span className="date-error">Invalid date</span>;
    }
    
    const dateFnsLocale = getDateFnsLocale(rowData.locale || 'fr_FR');
    const locale = dateFnsLocales[dateFnsLocale] || enGB;
    
    return <span>{format(parseISO(cellData), 'PPP', { locale })}</span>;
  } catch (error) {
    return <span className="date-error">Format error</span>;
  }
};

// ❌ WRONG: No error handling
const UnsafeDateFormatter = ({ cellData }: { cellData: any }) => {
  return <span>{format(parseISO(cellData), 'PPP')}</span>; // May crash
};
```

### Common Pitfalls

#### ❌ Wrong: Incorrect Locale Usage

```typescript
// Don't use OVH locale directly with date-fns
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const formatDate = (date: string) => {
  return format(parseISO(date), 'PPP', { locale: fr }); // Wrong locale format
};
```

#### ✅ Correct: Proper Locale Conversion

```typescript
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { format } from 'date-fns';
import { fr, enGB } from 'date-fns/locale';

const formatDate = (date: string, ovhLocale: string) => {
  const dateFnsLocale = getDateFnsLocale(ovhLocale);
  const locale = { fr, enGB }[dateFnsLocale] || enGB;
  return format(parseISO(date), 'PPP', { locale });
};
```

#### ❌ Wrong: Missing Formatter Props

```typescript
// Don't forget to use cellData and rowData
const StatusFormatter = ReactFormatter(
  <div className="status-badge">
    <span>Status</span> {/* Missing dynamic data */}
  </div>
);
```

#### ✅ Correct: Use Formatter Props

```typescript
const StatusFormatter = ReactFormatter(
  <div className="status-badge">
    <span className="status-text"></span> {/* Will receive cellData */}
  </div>
);
```

---

## 🤖 AI Development Guidelines

### Essential Rules for AI Code Generation

1. **Always use getDateFnsLocale**: Convert OVH locales to date-fns format
2. **Handle locale mapping**: Provide proper locale objects for date-fns
3. **Use ReactFormatter correctly**: Pass React elements, not functions
4. **Handle formatter props**: Use cellData and rowData in formatter components
5. **Implement error handling**: Handle invalid dates and locale errors
6. **Follow naming conventions**: Use descriptive names for formatters
7. **Test locale conversion**: Verify locale mapping works correctly
8. **Optimize performance**: Avoid unnecessary re-renders in formatters

### Locale Conversion Checklist for Dates

- [ ] Use getDateFnsLocale for OVH locale conversion
- [ ] Map date-fns locales correctly
- [ ] Handle fallback locales
- [ ] Test with different OVH locales
- [ ] Verify date-fns locale objects are available

### React Formatter Checklist

- [ ] Use ReactFormatter with React elements
- [ ] Handle cellData and rowData props
- [ ] Implement error handling
- [ ] Use proper CSS classes
- [ ] Test with different data types
- [ ] Optimize for performance

### Integration Checklist

- [ ] Import utilities correctly
- [ ] Handle locale conversion
- [ ] Implement error boundaries
- [ ] Test with real data
- [ ] Verify formatter rendering
- [ ] Check performance impact

---

## ⚖️ The Utils' Moral

- **Consistent utilities** ensure standardized behavior across all applications
- **Proper locale handling** provides accurate internationalization support
- **React formatters** enable rich data grid experiences
- **Error handling** prevents application crashes and improves reliability

**👉 Good utilities are invisible to users but essential for application consistency.**

## 🔄 Cascade Exports

### ReactFormatter

#### Usage with Tabulator

```typescript
import { ReactFormatter } from '@ovh-ux/manager-core-utils';
import React from 'react';

// Create a React formatter for Tabulator
const StatusFormatter = ReactFormatter(
  <div className="status-badge">
    <span data-testid="status">{/* Status component */}</span>
  </div>
);

// Usage in Tabulator configuration
const columns = [
  {
    title: 'Status',
    field: 'status',
    formatter: StatusFormatter
  }
];
```

#### Injected Props

```typescript
// The formatter automatically receives cellData and rowData
const CustomFormatter = ReactFormatter(
  <div>
    <span>{/* cellData will be available */}</span>
    <span>{/* rowData will be available */}</span>
  </div>
);
```

### Date-fns Locale

#### OVH Locale Conversion

```typescript
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';

// Convert OVH locales to date-fns
const locales = {
  'fr_FR': 'fr',
  'en_GB': 'enGB', 
  'fr_CA': 'frCA',
  'de_DE': 'de',
  'es_ES': 'es'
};

// Usage with date-fns
import { format } from 'date-fns';
import { fr, enGB, frCA } from 'date-fns/locale';

const formatDate = (date: Date, ovhLocale: string) => {
  const dateFnsLocale = getDateFnsLocale(ovhLocale);
  const locale = dateFnsLocale === 'fr' ? fr : 
                 dateFnsLocale === 'enGB' ? enGB :
                 dateFnsLocale === 'frCA' ? frCA : enGB;
  
  return format(date, 'PPP', { locale });
};
```

#### Integration with i18next

```typescript
import { getDateFnsLocale } from '@ovh-ux/manager-core-utils';
import { useTranslation } from 'react-i18next';

function DateComponent() {
  const { i18n } = useTranslation();
  const locale = getDateFnsLocale(i18n.language);
  
  // Use the locale with date-fns
  return <div>{/* Component with formatted date */}</div>;
}
```

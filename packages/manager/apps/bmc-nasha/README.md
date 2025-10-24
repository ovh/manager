# Nasha Services

A clean React application built with Manager UI Kit (MUK) for OVHcloud Nasha services.

## 🚀 Status

This application is in a **clean, ready-to-develop** state with:

- ✅ **MUK Integration**: Using `@ovh-ux/muk` as the single source of truth for UI components
- ✅ **Modern Architecture**: React 18 + TypeScript + Vite
- ✅ **Clean Structure**: Minimal setup ready for feature development
- ✅ **Testing Ready**: Vitest + Testing Library configured
- ✅ **Routing**: React Router with proper tracking integration

## 🛠️ Tech Stack

- **UI Library**: Manager UI Kit (MUK) - replaces ODS + MRC
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **Styling**: Tailwind CSS + ODS Themes
- **Routing**: React Router DOM
- **State Management**: TanStack Query

## 📁 Project Structure

```
src/
├── pages/
│   ├── Main.layout.tsx          # Main application layout
│   └── listing/
│       ├── Listing.page.tsx     # Main listing page (ready for features)
│       └── Listing.spec.tsx     # Tests
├── routes/                      # Route configuration
├── types/                       # TypeScript definitions
└── index.scss                   # Global styles (MUK + ODS themes)
```

## 🎯 Current Features

- **Clean Landing Page**: Simple listing page with MUK components
- **Responsive Layout**: BaseLayout with header and breadcrumb
- **Message System**: Info messages using MUK Message component
- **Button Actions**: Ready-to-use Button components

## 🚧 Ready for Development

The application is now ready for adding features:

1. **Data Integration**: Use MUK's `useV6`, `useIceberg` hooks
2. **Forms**: Use MUK's form components (`FormField`, `Input`, `Select`)
3. **Data Grids**: Use MUK's `Datagrid` component
4. **Modals**: Use MUK's `Modal` component
5. **Navigation**: Add new routes and pages

## 🧪 Testing

```bash
# Run tests
yarn test

# Run tests with coverage
yarn test:coverage
```

## 🚀 Development

```bash
# Start development server
yarn start

# Build for production
yarn build

# Lint code
yarn lint:modern
```

## 📚 Documentation

- [MUK Documentation](../../../.ai-doc/20-dependencies/muk.md)
- [Manager Architecture](../../../.ai-doc/10-architecture/)
- [Best Practices](../../../.ai-doc/30-best-practices/)

## 🔄 Migration Notes

This application has been migrated from ODS + MRC to MUK:

- ✅ CSS imports updated to use MUK styles
- ✅ Components migrated to MUK equivalents
- ✅ Tests updated to mock MUK components
- ✅ Type definitions updated to use MUK types

**MUK is now the single source of truth for all UI components.**

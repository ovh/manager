# @ovh-ux/manager-pci-project-app

> PCI project React application for OVH Manager

## Overview

This is a React application built with Vite and TypeScript that provides PCI (Public Cloud Infrastructure) project management capabilities within the OVH Manager ecosystem.

## Technology Stack

- **Framework**: React 18.2.0 with TypeScript
- **Build Tool**: Vite 5.3.3
- **Styling**: Tailwind CSS 3.4.4
- **Testing**: Vitest 2.1.9 with coverage support
- **Query Management**: TanStack React Query 5.51.21
- **Routing**: React Router DOM 6.3.0
- **Internationalization**: i18next 23.8.2

## Key Dependencies

### OVH Design System
- `@ovhcloud/ods-components`: OVH Design System components
- `@ovhcloud/ods-themes`: OVH Design System themes

### OVH Manager Libraries
- `@ovh-ux/manager-react-components`: Shared React components
- `@ovh-ux/manager-pci-common`: PCI-specific utilities and components
- `@ovh-ux/manager-react-shell-client`: Shell communication for micro-frontend architecture
- `@ovh-ux/manager-core-api`: Core API utilities
- `@ovh-ux/manager-core-utils`: Core utility functions

## Development

### Getting Started

```bash
# Install dependencies
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

### Available Scripts

- `yarn start` - Start development server with Vite
- `yarn build` - Build the application (TypeScript compilation + Vite build)
- `yarn test` - Run tests with manager-test framework
- `yarn coverage` - Run tests with coverage report
- `yarn lint` - Run ESLint on source files
- `yarn format` - Format code using Prettier and other formatters

### Code Quality

The project includes comprehensive linting and formatting:

- **ESLint**: JavaScript/TypeScript linting
- **Stylelint**: CSS/SCSS/Less linting
- **HTMLHint**: HTML linting
- **Remark**: Markdown linting
- **Prettier**: Code formatting

## Architecture

This application follows the OVH Manager micro-frontend architecture:

- **Container Integration**: Communicates with the manager container via `@ovh-ux/manager-react-shell-client`
- **Routing**: Uses React Router DOM for internal routing
- **State Management**: TanStack React Query for server state management
- **Internationalization**: i18next for multi-language support

## Supported Regions

- CA (Canada)
- EU (Europe)
- US (United States)

## Universe

Part of the `@ovh-ux/manager-public-cloud` universe.

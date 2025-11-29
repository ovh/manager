---
title: Parity Validation Guide
last_update: 2025-01-27
tags: [migration, parity, validation, testing, angularjs, react, ovhcloud, manager]
ai: true
---

# Parity Validation Guide

## 🧭 Purpose

This document provides a **comprehensive validation framework** for ensuring **100% functional parity** between AngularJS and React implementations in the OVHcloud Manager ecosystem.

## ⚙️ Context

**Core Principle**: **Every migrated component must be 100% identical** to the original AngularJS version in terms of visual appearance, functionality, and user experience.

## 🔗 References

- [User Story Migration Guide](./user-story-migration-guide.md)
- [Concise Migration Guide](./concise-migration-guide.md)
- [Development Standards](./development-standards.md)

## 📘 Guidelines / Implementation

### UI Policy for Validation
- React implementation must use MUK components exclusively.
- If a temporary fallback (non‑MUK) is required due to a missing feature, the parity tests must reference the behavior, not the fallback API, and the fallback must be documented with a follow‑up ticket to replace it with MUK.

### 🎯 Parity Validation Framework

#### 1. **Visual Parity Validation**
```typescript
// Visual comparison test
describe('Visual Parity Validation', () => {
  it('should render identical columns', () => {
    render(<UserListPage />);
    
    // Check column headers
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    
    // Check column order
    const headers = screen.getAllByRole('columnheader');
    expect(headers[0]).toHaveTextContent('Name');
    expect(headers[1]).toHaveTextContent('Email');
    expect(headers[2]).toHaveTextContent('Status');
  });
  
  it('should have identical formatting', () => {
    render(<UserListPage />);
    
    // Check date formatting
    expect(screen.getByText('2024-01-27')).toBeInTheDocument();
    
    // Check size formatting
    expect(screen.getByText('1.5 GB')).toBeInTheDocument();
    
    // Check currency formatting
    expect(screen.getByText('€12.50')).toBeInTheDocument();
    
    // Check images presence (paths may differ, visuals must match)
    const logo = screen.getByAltText('NAS-HA');
    expect(logo).toBeInTheDocument();
  });
  
  it('should have identical states', () => {
    // Loading state
    render(<UserListPage loading={true} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    
    // Empty state
    render(<UserListPage items={[]} />);
    expect(screen.getByText('No users found')).toBeInTheDocument();
    
    // Error state
    render(<UserListPage error="Failed to load" />);
    expect(screen.getByText('Failed to load')).toBeInTheDocument();
  });
});
```

#### 2. **Functional Parity Validation**
```typescript
// Functional behavior test
describe('Functional Parity Validation', () => {
  it('should load data identically', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
    ];
    
    mockApiClient.v6.get.mockResolvedValue({ data: mockUsers });
    
    render(<UserListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
    
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users');
  });
  
  it('should handle errors identically', async () => {
    mockApiClient.v6.get.mockRejectedValue(new Error('API Error'));
    
    render(<UserListPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load users')).toBeInTheDocument();
    });
  });
  
  it('should handle interactions identically', async () => {
    render(<UserListPage />);
    
    // Test sorting
    fireEvent.click(screen.getByText('Name'));
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users?sort=name');
    
    // Test filtering
    fireEvent.change(screen.getByPlaceholderText('Search'), { target: { value: 'John' } });
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users?search=John');
  });
});
```

#### 3. **Technical Parity Validation**
```typescript
// Technical implementation test
describe('Technical Parity Validation', () => {
  it('should use identical API endpoints', () => {
    render(<UserListPage />);
    
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users');
  });
  
  it('should render identical translation values (keys may differ)', () => {
    render(<UserListPage />);
    
    // Assert on rendered texts (values), not on key names
    expect(screen.getByText('Service Name')).toBeInTheDocument();
    expect(screen.getByText('Can Create Partition')).toBeInTheDocument();
  });
  
  it('should have identical accessibility features', () => {
    render(<UserListPage />);
    
    // Check ARIA labels
    expect(screen.getByRole('table')).toHaveAttribute('aria-label', 'User list');
    
    // Check keyboard navigation
    const firstRow = screen.getByRole('row', { name: /John Doe/ });
    expect(firstRow).toHaveAttribute('tabIndex', '0');
  });
});
```

### 🏗️ Parity Validation Patterns

#### Pattern 1: List Component Validation
```typescript
// List component parity validation
describe('UserList Parity Validation', () => {
  it('should have identical columns', () => {
    render(<UserListPage />);
    
    const expectedColumns = [
      'Service Name',
      'Can Create Partition',
      'Monitored',
      'Size',
      'Status',
      'Created',
      'Actions'
    ];
    
    expectedColumns.forEach(column => {
      expect(screen.getByText(column)).toBeInTheDocument();
    });
  });
  
  it('should have identical data formatting', () => {
    const mockUsers = [
      {
        serviceName: 'test-service',
        canCreatePartition: true,
        monitored: false,
        size: 15728640, // 15MB in bytes
        status: 'active',
        created: '2024-01-27T10:00:00Z'
      }
    ];
    
    render(<UserListPage users={mockUsers} />);
    
    // Check size formatting (bytes to MB)
    expect(screen.getByText('15 MB')).toBeInTheDocument();
    
    // Check date formatting
    expect(screen.getByText('27/01/2024')).toBeInTheDocument();
    
    // Check boolean formatting
    expect(screen.getByText('Yes')).toBeInTheDocument(); // canCreatePartition
    expect(screen.getByText('No')).toBeInTheDocument();  // monitored
  });
  
  it('should have identical interactions', () => {
    render(<UserListPage />);
    
    // Test sorting
    fireEvent.click(screen.getByText('Service Name'));
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users?sort=serviceName');
    
    // Test filtering
    fireEvent.change(screen.getByPlaceholderText('Search services'), { 
      target: { value: 'test' } 
    });
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users?search=test');
    
    // Test pagination
    fireEvent.click(screen.getByText('Next'));
    expect(mockApiClient.v6.get).toHaveBeenCalledWith('/api/users?page=2');
  });
});
```

#### Pattern 2: Form Component Validation
```typescript
// Form component parity validation
describe('UserForm Parity Validation', () => {
  it('should have identical validation rules', async () => {
    render(<UserFormPage />);
    
    // Test required field validation
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
    
    // Test email validation
    fireEvent.change(screen.getByLabelText('Email'), { 
      target: { value: 'invalid-email' } 
    });
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email format')).toBeInTheDocument();
    });
  });
  
  it('should have identical submission behavior', async () => {
    const mockUser = { name: 'John Doe', email: 'john@example.com' };
    
    render(<UserFormPage />);
    
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: mockUser.name } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: mockUser.email } });
    
    fireEvent.click(screen.getByText('Submit'));
    
    await waitFor(() => {
      expect(mockApiClient.v6.post).toHaveBeenCalledWith('/api/users', mockUser);
    });
  });
});
```

#### Pattern 3: Detail Component Validation
```typescript
// Detail component parity validation
describe('UserDetail Parity Validation', () => {
  it('should display identical information', () => {
    const mockUser = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      status: 'active',
      created: '2024-01-27T10:00:00Z',
      lastLogin: '2024-01-27T15:30:00Z'
    };
    
    render(<UserDetailPage user={mockUser} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('27/01/2024 10:00')).toBeInTheDocument();
    expect(screen.getByText('27/01/2024 15:30')).toBeInTheDocument();
  });
  
  it('should have identical actions', () => {
    render(<UserDetailPage />);
    
    // Test edit action
    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByTestId('edit-form')).toBeInTheDocument();
    
    // Test delete action
    fireEvent.click(screen.getByText('Delete'));
    expect(screen.getByTestId('delete-confirmation')).toBeInTheDocument();
  });
});
```

### 🎯 Parity Validation Tools

#### Visual Comparison Tool
```typescript
// Visual comparison utility
export function compareVisuals(angularJSSelector: string, reactSelector: string) {
  const angularElement = document.querySelector(angularJSSelector);
  const reactElement = document.querySelector(reactSelector);
  
  if (!angularElement || !reactElement) {
    throw new Error('Elements not found for comparison');
  }
  
  // Compare dimensions
  const angularRect = angularElement.getBoundingClientRect();
  const reactRect = reactElement.getBoundingClientRect();
  
  expect(reactRect.width).toBe(angularRect.width);
  expect(reactRect.height).toBe(angularRect.height);
  
  // Compare styles
  const angularStyles = window.getComputedStyle(angularElement);
  const reactStyles = window.getComputedStyle(reactElement);
  
  expect(reactStyles.display).toBe(angularStyles.display);
  expect(reactStyles.flexDirection).toBe(angularStyles.flexDirection);
  expect(reactStyles.justifyContent).toBe(angularStyles.justifyContent);
}
```

#### Data Comparison Tool
```typescript
// Data comparison utility
export function compareData(angularJSData: any[], reactData: any[]) {
  expect(reactData.length).toBe(angularJSData.length);
  
  angularJSData.forEach((angularItem, index) => {
    const reactItem = reactData[index];
    
    // Compare all properties
    Object.keys(angularItem).forEach(key => {
      expect(reactItem[key]).toBe(angularItem[key]);
    });
  });
}
```

#### Performance Comparison Tool
```typescript
// Performance comparison utility
export function comparePerformance(angularJSFunction: () => void, reactFunction: () => void) {
  const angularJSTime = measureTime(angularJSFunction);
  const reactTime = measureTime(reactFunction);
  
  // React should be equal or better
  expect(reactTime).toBeLessThanOrEqual(angularJSTime * 1.1); // 10% tolerance
}

function measureTime(fn: () => void): number {
  const start = performance.now();
  fn();
  const end = performance.now();
  return end - start;
}
```

### 🚀 Parity Validation Workflow

#### Step 1: Baseline Capture
```bash
# 1. Capture AngularJS baseline
@run_tests "npm test -- --testNamePattern='AngularJS Baseline'"

# 2. Generate baseline snapshots
@run_tests "npm test -- --updateSnapshot"
```

#### Step 2: React Implementation
```bash
# 3. Implement React component
@create_file "src/components/UserList.tsx"

# 4. Create parity tests
@create_file "src/components/UserList.parity.test.tsx"
```

#### Step 3: Parity Validation
```bash
# 5. Run parity tests
@run_tests "npm test -- --testNamePattern='Parity'"

# 6. Visual comparison
@run_visual_test "npm run test:visual"
```

#### Step 4: Performance Validation
```bash
# 7. Performance comparison
@run_performance_test "npm run test:performance"
```

### 📋 Parity Validation Checklist

#### Visual Parity
- [ ] **Columns**: Count, order, labels identical
- [ ] **Formatting**: Dates, sizes, currencies identical
- [ ] **States**: Loading, empty, error identical
- [ ] **Styling**: Colors, fonts, spacing identical
- [ ] **Layout**: Grid, flexbox, positioning identical

#### Functional Parity
- [ ] **API calls**: Endpoints, parameters, responses identical
- [ ] **Business logic**: Calculations, validations identical
- [ ] **Error handling**: Messages, recovery identical
- [ ] **Interactions**: Clicks, hovers, focus identical
- [ ] **Navigation**: Links, routing identical

#### Technical Parity
- [ ] **URLs**: Paths, parameters identical
- [ ] **Translations**: Values identical; keys may differ if mapping documented
- [ ] **Accessibility**: ARIA, keyboard navigation identical
- [ ] **Performance**: LCP, INP, CLS identical or better
- [ ] **Security**: XSS protection, CSRF handling identical
- [ ] **Assets**: Rendered images identical; file paths may differ if mapping documented

### 🚫 Anti-Patterns to Avoid

```typescript
// ❌ WRONG: Skipping parity validation
// Don't assume React version is identical

// ✅ CORRECT: Always validate parity
// Visual, functional, technical validation

// ❌ WRONG: Partial parity validation
// Don't validate only some aspects

// ✅ CORRECT: Complete parity validation
// All aspects must be validated

// ❌ WRONG: Manual parity validation
// Don't rely on manual comparison

// ✅ CORRECT: Automated parity validation
// Automated tests for all aspects
```

### ✅ Best Practices

```typescript
// ✅ CORRECT: Comprehensive parity validation
// Visual, functional, technical, performance

// ✅ CORRECT: Automated validation
// Automated tests for all parity aspects

// ✅ CORRECT: Baseline capture
// Capture AngularJS baseline before migration

// ✅ CORRECT: Incremental validation
// Validate each component before moving to next
```

---

## 🤖 AI Development Guidelines

### Essential Parity Validation Rules for AI Code Generation

1. **Complete parity validation**: Visual, functional, technical, performance
2. **Automated validation**: Automated tests for all aspects
3. **Baseline capture**: Capture AngularJS baseline before migration
4. **Incremental validation**: Validate each component before next
5. **Visual comparison**: Side-by-side visual comparison
6. **Functional testing**: Identical behavior testing
7. **Performance testing**: No regression testing
8. **Accessibility testing**: Same accessibility level
9. **Documentation**: Document all parity decisions
10. **Continuous validation**: Validate throughout migration

### Parity Validation Checklist

- [ ] Visual parity validated
- [ ] Functional parity validated
- [ ] Technical parity validated
- [ ] Performance parity validated
- [ ] Accessibility parity validated
- [ ] Automated tests written
- [ ] Baseline captured
- [ ] Documentation updated
- [ ] Ready for production

---

## ⚖️ The Parity Validation's Moral

- **100% parity** ensures user experience consistency
- **Automated validation** prevents human errors
- **Comprehensive testing** covers all aspects
- **Continuous validation** ensures quality throughout migration

**👉 Good parity validation is invisible to users but essential for quality.**

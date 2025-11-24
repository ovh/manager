---
title: Migration Templates
last_update: 2025-01-27
tags: [templates, migration, angularjs, react, planning, documentation]
ai: true
---

# Migration Templates

## 🧭 Purpose

This document provides **ready-to-use templates** for migration documentation. Use these templates to ensure consistent and complete migration planning and documentation.

## 🔗 References

- [US Migration Guide](./us-migration-guide.md) - **Migration strategy**
- [Migration Patterns](./migration-patterns.md) - **Implementation patterns**
- [Parity Validation Guide](./parity-validation-guide.md) - **Validation framework**

## 📄 Template: PLAN.md

```markdown
# PLAN – <TARGET_MODULE>

## 1. Context
- **Source module**: AngularJS 1.x - `<module-name>`
- **Target module**: React 18 + TypeScript
- **Objective**: Migration without functional loss
- **Strategy**: Strangler pattern, incremental migration
- **Timeline**: <estimation>

## 2. Legacy Code Analysis
### AngularJS Structure
```
<module-angularjs>/
├── controllers/
├── services/
├── templates/
├── directives/
└── filters/
```

### Identified Dependencies
- [ ] Service A (to migrate)
- [ ] Service B (to migrate)
- [ ] Directive C (to migrate)
- [ ] Filter D (to migrate)

### External Integrations
- [ ] API endpoints
- [ ] WebSocket connections
- [ ] Third-party libraries
- [ ] Manager shell integration

## 3. User Stories
### User Stories by Route
- [ ] **US1** - [Description] - Route: `/path1`
- [ ] **US2** - [Description] - Route: `/path2`

### User Stories by Feature
- [ ] **US3** - [Description] - Feature: Feature A
- [ ] **US4** - [Description] - Feature: Feature B

## 4. Target Architecture
### React Structure
```
<module-react>/
├── components/
├── hooks/
├── services/
├── types/
├── utils/
└── pages/
```

### AngularJS → React Mapping
| AngularJS | React | Notes |
|-----------|-------|-------|
| Controller | Hook | use<ControllerName> |
| Service | Hook | use<ServiceName> |
| Directive | Component | <DirectiveName> |
| Filter | Utility | <FilterName> |
| Template | JSX | <ComponentName>.tsx |

## 5. Migration Strategy
### Strangler Pattern Approach
1. **Phase 1**: Services migration (API hooks)
2. **Phase 2**: UI components migration
3. **Phase 3**: Pages/routes migration
4. **Phase 4**: Tests and validation

### AngularJS/React Coexistence
### i18n/Translations Strategy
- **Principle**: Preserve legacy translation values verbatim; only keys/namespaces may change.
- **Actions**:
  - [ ] Extract legacy `Messages_*.json` and build key→value map
  - [ ] Define new key schema/namespaces for React µapp
  - [ ] Produce legacy→new key mapping (values unchanged)
  - [ ] Import same values under new keys
  - [ ] Document mapping in `MIGRATION_NOTES.md`

### Assets/Images Strategy
- **Principle**: Preserve legacy image files verbatim; only paths/folder structure may change.
- **Actions**:
  - [ ] Inventory used images (templates, CSS backgrounds, icons)
  - [ ] Copy used images as-is into React assets folder
  - [ ] Define new assets structure and import pattern
  - [ ] Produce legacy→new path mapping
  - [ ] Document mapping in `MIGRATION_NOTES.md`

- [ ] Route-by-route migration
- [ ] Shared services via hooks
- [ ] Gradual AngularJS removal

## 6. Test Plan
### Parity Tests
- [ ] **Functional parity**: All functionalities reproduced
- [ ] **Visual parity**: Identical interface pixel by pixel
- [ ] **Performance parity**: No LCP/INP/CLS degradation
- [ ] **Accessibility parity**: Same accessibility level
- [ ] **i18n values parity**: All rendered texts identical to legacy; keys may differ
- [ ] **Assets parity**: Rendered images are visually identical; paths may differ

### E2E Tests
- [ ] **Navigation**: All user journeys
- [ ] **CRUD**: Create, read, update, delete
- [ ] **Validation**: All validation cases
- [ ] **Errors**: Error handling

### Unit Tests
- [ ] **Hooks**: All API hooks
- [ ] **Components**: All UI components
- [ ] **Utilities**: All utility functions
- [ ] **Services**: All services

## 7. Dependencies/Configuration
### Packages to Install
- [ ] @muk/ui
- [ ] @muk/notifications
- [ ] @muk/theme
- [ ] @tanstack/react-query
- [ ] react-hook-form
- [ ] zod

### Required Configuration
- [ ] TypeScript strict
- [ ] ESLint/Prettier
- [ ] Vite config
- [ ] React Router setup
- [ ] i18next config
- [ ] API interceptors

## 8. Risks/Mitigations
### Identified Risks
- **R1**: Functionality loss
  - *Mitigation*: Exhaustive E2E tests
- **R2**: Performance degradation
  - *Mitigation*: Benchmarks and monitoring
- **R3**: Accessibility issues
  - *Mitigation*: axe/pa11y validation

### Critical Dependencies
- [ ] Stable API endpoints
- [ ] Up-to-date design system
- [ ] Available translations

## 9. Subtasks (Branches/Commits)
### Phase 1: Setup
- [ ] **feat(setup)**: TypeScript strict configuration
- [ ] **feat(setup)**: Dependencies installation
- [ ] **feat(setup)**: Tools configuration

### Phase 2: Services Migration
- [ ] **feat(api)**: Service A migration
- [ ] **feat(api)**: Service B migration
- [ ] **test(api)**: API hooks tests

### Phase 3: UI Migration
- [ ] **feat(ui)**: List page migration
- [ ] **feat(ui)**: Detail page migration
- [ ] **feat(ui)**: Forms migration
- [ ] **test(ui)**: Components tests

### Phase 4: Tests & Validation
- [ ] **test(e2e)**: E2E user journeys tests
- [ ] **feat(parity)**: Functional parity validation
- [ ] **docs(migration)**: Final documentation

## 10. Acceptance Criteria
- [ ] **UX Parity**: Interface identical to original
- [ ] **Functional Parity**: All functionalities reproduced
- [ ] **E2E Tests**: User journeys validated
- [ ] **Coverage**: 90%+ unit tests
- [ ] **Performance**: No LCP/INP/CLS degradation
- [ ] **Accessibility**: axe/pa11y validation
- [ ] **TypeScript**: Strict mode, no any
- [ ] **Documentation**: MIGRATION_NOTES.md up to date
- [ ] **i18n**: Translation values preserved; legacy→new key mapping documented
- [ ] **Assets**: Images preserved; legacy→new path mapping documented

## 11. Deployment Plan
### Environments
- [ ] **Development**: Development tests
- [ ] **Staging**: Parity validation
- [ ] **Production**: Progressive deployment

### Rollback Plan
- [ ] AngularJS code backup
- [ ] Rollback tests
- [ ] Rollback procedure

## 12. Success Metrics
- [ ] **Functional**: 100% features reproduced
- [ ] **Performance**: LCP < 2.5s, INP < 200ms
- [ ] **Quality**: 0 ESLint errors, 90%+ coverage
- [ ] **UX**: No user regression
```

## 📄 Template: MIGRATION_NOTES.md

```markdown
# MIGRATION_NOTES – <TARGET_MODULE>

## 1. Migration Summary
- **Date**: <date>
- **Module**: <module-name>
- **Status**: <status>
- **Duration**: <duration>
- **Team**: <team-members>

## 2. Migration Decisions
### Key Decisions
### Translation Keys Mapping (Legacy → New)
### Image/Asset Paths Mapping (Legacy → New)
| Legacy Path | New Path | Note |
|-------------|----------|------|
| assets/images/nasha/logo.png | src/assets/images/nasha/logo.png | Same file content |

| Legacy Key | New Key | Value (must be identical) |
|------------|---------|----------------------------|
| <legacy.key.1> | <new.key.1> | <copied legacy value> |
| <legacy.key.2> | <new.key.2> | <copied legacy value> |

- **Decision 1**: <description>
  - *Rationale*: <rationale>
  - *Impact*: <impact>
- **Decision 2**: <description>
  - *Rationale*: <rationale>
  - *Impact*: <impact>

### Pattern Mappings
| AngularJS Pattern | React Pattern | Notes |
|-------------------|---------------|-------|
| Controller | Hook | use<ControllerName> |
| Service | Hook | use<ServiceName> |
| Directive | Component | <DirectiveName> |
| Filter | Utility | <FilterName> |

## 3. Challenges & Solutions
### Challenges Faced
- **Challenge 1**: <description>
  - *Solution*: <solution>
  - *Lessons learned*: <lessons>
- **Challenge 2**: <description>
  - *Solution*: <solution>
  - *Lessons learned*: <lessons>

## 4. Performance Impact
### Before Migration
- **LCP**: <value>
- **INP**: <value>
- **CLS**: <value>
- **Bundle size**: <value>

### After Migration
- **LCP**: <value>
- **INP**: <value>
- **CLS**: <value>
- **Bundle size**: <value>

### Performance Improvements
- [ ] Lazy loading implemented
- [ ] Code splitting applied
- [ ] Bundle optimization
- [ ] Performance monitoring

## 5. Test Results
### Test Coverage
- **Unit tests**: <coverage>%
- **Integration tests**: <coverage>%
- **E2E tests**: <coverage>%

### Test Results
- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Performance tests passing
- [ ] Accessibility tests passing

## 6. Validation Results
### Functional Parity
- [ ] All functionalities reproduced
- [ ] All user journeys working
- [ ] All edge cases handled
- [ ] All error cases handled

### Visual Parity
- [ ] Interface identical to original
- [ ] All responsive breakpoints working
- [ ] All animations working
- [ ] All interactions working

### Accessibility Parity
### i18n Parity
- [ ] All rendered texts match legacy values exactly
- [ ] Key renames are documented and mapped

### Assets Parity
- [ ] All rendered images match legacy visuals
- [ ] Path/filename changes are documented and mapped

- [ ] Same accessibility level
- [ ] All ARIA attributes present
- [ ] Keyboard navigation working
- [ ] Screen reader compatibility

## 7. Deployment Notes
### Deployment Steps
1. **Pre-deployment**: <steps>
2. **Deployment**: <steps>
3. **Post-deployment**: <steps>

### Rollback Plan
- **Trigger conditions**: <conditions>
- **Rollback steps**: <steps>
- **Validation**: <validation>

## 8. Lessons Learned
### What Worked Well
- [ ] <lesson 1>
- [ ] <lesson 2>
- [ ] <lesson 3>

### What Could Be Improved
- [ ] <improvement 1>
- [ ] <improvement 2>
- [ ] <improvement 3>

### Recommendations for Future Migrations
- [ ] <recommendation 1>
- [ ] <recommendation 2>
- [ ] <recommendation 3>

## 9. Documentation Updates
### Updated Documentation
- [ ] API documentation
- [ ] User documentation
- [ ] Developer documentation
- [ ] Migration guide

### New Documentation
- [ ] React component documentation
- [ ] Hook documentation
- [ ] Utility documentation
- [ ] Test documentation

## 10. Follow-up Actions
### Immediate Actions
- [ ] <action 1>
- [ ] <action 2>
- [ ] <action 3>

### Long-term Actions
- [ ] <action 1>
- [ ] <action 2>
- [ ] <action 3>

## 11. Team Feedback
### Developer Feedback
- **Positive aspects**: <feedback>
- **Challenges**: <feedback>
- **Suggestions**: <feedback>

### User Feedback
- **Positive aspects**: <feedback>
- **Issues**: <feedback>
- **Suggestions**: <feedback>
```

## 📄 Template: Definition of Done

```markdown
# Definition of Done – <TARGET_MODULE>

## 1. Functional Requirements
- [ ] **All user stories completed**: All user stories from PLAN.md completed
- [ ] **All acceptance criteria met**: All acceptance criteria from PLAN.md met
- [ ] **All edge cases handled**: All edge cases identified and handled
- [ ] **All error cases handled**: All error cases identified and handled

## 2. Technical Requirements
- [ ] **TypeScript strict mode**: No any types, strict type checking
- [ ] **ESLint compliance**: 0 ESLint errors, all rules followed
- [ ] **Prettier formatting**: Code formatted with Prettier
- [ ] **Import organization**: Imports organized and optimized

## 3. Test Requirements
- [ ] **Unit test coverage**: 90%+ unit test coverage
- [ ] **Integration test coverage**: 90%+ integration test coverage
- [ ] **E2E test coverage**: All user journeys covered
- [ ] **All tests passing**: All tests passing in CI/CD
 - [ ] **i18n parity tests**: Rendered texts match legacy values
 - [ ] **Assets parity tests**: Expected images are rendered identically

## 4. Performance Requirements
- [ ] **LCP < 2.5s**: Largest Contentful Paint under 2.5 seconds
- [ ] **INP < 200ms**: Interaction to Next Paint under 200ms
- [ ] **CLS < 0.1**: Cumulative Layout Shift under 0.1
- [ ] **Bundle size optimized**: Bundle size within acceptable limits

## 5. Accessibility Requirements
- [ ] **WCAG 2.1 AA compliance**: All accessibility guidelines followed
- [ ] **Keyboard navigation**: All functionality accessible via keyboard
- [ ] **Screen reader compatibility**: All content accessible to screen readers
- [ ] **Color contrast**: All text meets contrast requirements

## 6. Security Requirements
- [ ] **No security vulnerabilities**: No known security issues
- [ ] **Input validation**: All inputs properly validated
- [ ] **XSS prevention**: Cross-site scripting prevention implemented
- [ ] **CSRF protection**: Cross-site request forgery protection implemented

## 7. Documentation Requirements
- [ ] **Code documentation**: All code properly documented
- [ ] **API documentation**: All APIs documented
- [ ] **User documentation**: User-facing features documented
- [ ] **Migration documentation**: Migration process documented
 - [ ] **i18n mapping**: Legacy→new key mapping documented in MIGRATION_NOTES.md
 - [ ] **Assets mapping**: Legacy→new image path mapping documented in MIGRATION_NOTES.md

## 8. Deployment Requirements
- [ ] **Deployment tested**: Deployment process tested
- [ ] **Rollback plan tested**: Rollback plan tested and working
- [ ] **Monitoring configured**: Monitoring and alerting configured
- [ ] **Performance monitoring**: Performance monitoring configured

## 9. Quality Assurance
- [ ] **Code review completed**: All code reviewed by peers
- [ ] **Security review completed**: Security review completed
- [ ] **Performance review completed**: Performance review completed
- [ ] **Accessibility review completed**: Accessibility review completed

## 10. Stakeholder Approval
- [ ] **Product owner approval**: Product owner approves functionality
- [ ] **UX approval**: UX team approves interface
- [ ] **QA approval**: QA team approves quality
- [ ] **DevOps approval**: DevOps team approves deployment

## 11. Final Validation
- [ ] **Production deployment**: Successfully deployed to production
- [ ] **Smoke tests passing**: All smoke tests passing
- [ ] **User acceptance**: Users accept the new functionality
- [ ] **Performance validated**: Performance meets requirements

## 12. Post-Deployment
- [ ] **Monitoring active**: Monitoring and alerting active
- [ ] **Documentation updated**: All documentation updated
- [ ] **Team notified**: Team notified of completion
- [ ] **Lessons learned documented**: Lessons learned documented
```

## 📋 Guidelines for AI Development

### 1. Always Use Templates
- Start with PLAN.md for every migration
- Document with MIGRATION_NOTES.md during migration
- Validate against Definition of Done before completion

### 2. Follow OVH Standards
- Use OVH-specific patterns and components
- Follow OVH coding standards and conventions
- Use OVH-specific tools and libraries

### 3. Ensure Quality
- Maintain high test coverage
- Follow accessibility guidelines
- Optimize for performance
- Document all decisions

### 4. Validate Parity
- Ensure functional parity with original
- Ensure visual parity with original
- Ensure performance parity or improvement
- Ensure accessibility parity

### 5. Continuous Improvement
- Document lessons learned
- Update templates based on experience
- Share knowledge with team
- Improve migration process

## 📋 Migration Checklist

### Pre-Migration
- [ ] Complete AngularJS code audit
- [ ] Identify all dependencies
- [ ] Assess migration complexity
- [ ] Create detailed migration plan
- [ ] Set up test environment

### During Migration
- [ ] Follow incremental migration approach
- [ ] Maintain functional parity
- [ ] Maintain visual parity
- [ ] Maintain performance parity
- [ ] Document all decisions

### Post-Migration
- [ ] Validate all requirements
- [ ] Run comprehensive tests
- [ ] Validate performance
- [ ] Validate accessibility
- [ ] Complete documentation

### Deployment
- [ ] Test deployment process
- [ ] Test rollback plan
- [ ] Deploy to staging
- [ ] Validate in staging
- [ ] Deploy to production

### Post-Deployment
- [ ] Monitor performance
- [ ] Monitor errors
- [ ] Collect user feedback
- [ ] Document lessons learned
- [ ] Update migration process

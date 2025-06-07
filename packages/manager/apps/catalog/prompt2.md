### 🚀 Migration Prompt: ODS v17 → v18 & @ovh-ux/manager-react-components v1 → v2.18.1

**Context:**

We plan to migrate "@ovh-ux/manager-hycu-app" React application in our monorepo from:

- **ODS version:** 17
- **@ovh-ux/manager-react-components:** 1.x

to:

- **ODS version:** 18
- **@ovh-ux/manager-react-components:** 2.18.1

**Monorepo Setup:**

- Package manager: [Yarn / pnpm / npm]
- Monorepo tooling: [Nx / Turborepo / Lerna]
- Shared UI components: [@monorepo/shared-ui, if applicable]
- Testing: Jest, React Testing Library, Cypress
- CI/CD: GitHub Actions
- React version: [specify current React version, e.g., 17 or 18]

**Goals:**

- Seamless migration with minimal impact on production.
- Consistency across micro-applications.
- Utilize the enhanced features provided in ODS v18 and @ovh-ux/manager-react-components v2.18.1.

**Constraints:**

- Incremental migration to avoid significant downtime.
- Maintain compatibility and functionality throughout migration.
- Clear and actionable documentation for developers.

**Migration Steps Required:**

1. **Dependency Updates:**
   - Provide commands to upgrade `@ovh-ux/ui-kit` to ODS v18 and `@ovh-ux/manager-react-components` to `2.18.1`.

2. **Handling Breaking Changes:**
   - Identify breaking changes introduced from ODS v17 → v18.
   - Clearly detail breaking changes when migrating from `@ovh-ux/manager-react-components` v1.x → v2.18.1.
   - Steps to mitigate and resolve each identified breaking change.

3. **Shared Components Migration:**
   - Steps for updating shared UI components first.
   - Guidance on handling compatibility issues between shared components and individual apps.

4. **Application-Specific Migration:**
   - Step-by-step process to apply migration in individual React applications.
   - How to propagate shared component updates to each micro-application.

5. **Automation and Validation:**
   - Recommendations for scripts or automation tools to streamline the migration.
   - Automated testing approaches (unit, integration, visual regression tests).

6. **Post-Migration Checklist:**
   - Validation steps ensuring UI and functional integrity post-migration.
   - Recommended monitoring to track stability and performance after deployment.

By clearly addressing each step, we ensure a structured, manageable, and effective migration to ODS v18 and `@ovh-ux/manager-react-components` v2.18.1.


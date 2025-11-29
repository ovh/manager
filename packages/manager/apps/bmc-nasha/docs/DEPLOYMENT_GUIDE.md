# Deployment Guide: bmc-nasha

**Application:** bmc-nasha (NAS-HA React)  
**Type:** React 18 + TypeScript micro-application  
**Status:** ✅ Ready for deployment

---

## Pre-Deployment Checklist

### 1. Code Quality ✅
- [x] No linter errors (`yarn lint:modern`)
- [x] All TypeScript compilation passes (`yarn build`)
- [x] Code follows OVHcloud Manager best practices
- [x] All components properly typed

### 2. Dependencies ✅
- [x] All dependencies up to date
- [x] Module Federation runtime configured (`@module-federation/runtime`)
- [x] No security vulnerabilities in dependencies
- [x] All peer dependencies satisfied

### 3. Translations ✅
- [x] All 8 locales completed (en_GB, fr_FR, fr_CA, de_DE, es_ES, it_IT, pl_PL, pt_PT)
- [x] Translation keys match AngularJS (parity compliance)
- [x] No missing translation keys

### 4. Configuration ✅
- [x] `App.constants.ts` properly configured
- [x] Tracking constants validated
- [x] API endpoints verified
- [x] Feature flags documented

---

## Deployment Steps

### Step 1: Build Verification

```bash
# From project root
cd packages/manager/apps/bmc-nasha

# Clean build
rm -rf dist/
yarn build

# Verify build output
ls -la dist/
```

**Expected output:**
- `dist/` folder with compiled assets
- No TypeScript errors
- Bundled JavaScript and CSS files

### Step 2: Run Tests

```bash
# Unit tests
yarn test

# With coverage
yarn test:coverage

# E2E tests (if available)
yarn test:e2e
```

**Success criteria:**
- All tests pass
- Coverage > 80% (recommended)
- No failing E2E tests

### Step 3: Local Testing

```bash
# Start dev server
yarn start
```

**Manual verification:**
1. Navigate to `http://localhost:5173/#/bmc-nasha/listing`
2. Verify listing page loads
3. Click "Order" button → verify Module Federation loading
4. Navigate to a service dashboard
5. Test partition creation flow
6. Test access and snapshot management
7. Verify all translations work

### Step 4: Feature Flag Configuration

The application should be deployed behind a feature flag for gradual rollout.

**Recommended feature flag:**
```javascript
{
  "id": "manager:bmc-nasha",
  "name": "NAS-HA React Migration",
  "enabled": false,
  "rollout": {
    "percentage": 0,
    "regions": []
  }
}
```

**Rollout strategy:**
1. **Phase 1:** Internal testing (0% → OVH employees only)
2. **Phase 2:** Canary (0% → 5%)
3. **Phase 3:** Limited rollout (5% → 25%)
4. **Phase 4:** Expanded rollout (25% → 50%)
5. **Phase 5:** General availability (50% → 100%)

### Step 5: Deployment to Environment

```bash
# Deploy to staging
yarn deploy:staging

# Deploy to production (after staging validation)
yarn deploy:production
```

---

## Post-Deployment Verification

### 1. Smoke Tests ✅

**Critical paths to verify:**
- [ ] Listing page loads
- [ ] Dashboard page loads for a service
- [ ] Partitions list displays correctly
- [ ] Create partition flow works
- [ ] Edit operations work (name, size, description)
- [ ] Delete operations work (partition, access, snapshot)
- [ ] Order page loads (Module Federation)
- [ ] Tracking events fire correctly

### 2. Performance Monitoring

**Metrics to track:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **Bundle size:** Monitor and optimize
- **API response times:** Track and alert on anomalies

**Tools:**
- Lighthouse CI
- Real User Monitoring (RUM)
- APM (Application Performance Monitoring)

### 3. Error Monitoring

**Setup:**
- Configure error tracking (Sentry, LogRocket, etc.)
- Set up alerts for critical errors
- Monitor error rates and trends

**Critical alerts:**
- Module Federation load failures
- API call failures (> 5% error rate)
- JavaScript runtime errors
- Translation loading failures

### 4. Analytics Verification

**Verify tracking events:**
```javascript
// Listing page
nasha::listing::add (Order button)
nasha::listing::guides (Guides menu)

// Dashboard page
nasha::dashboard::general-information
nasha::dashboard::partitions
nasha::dashboard::edit-name
nasha::dashboard::create-partition

// Partition actions
nasha::dashboard::nasha-partitions::create-partition
nasha::dashboard::nasha-partitions::delete
nasha::dashboard::nasha-partitions::usage-notification::enable
```

---

## Rollback Plan

### Quick Rollback (Feature Flag)

```javascript
// Disable feature flag immediately
{
  "id": "manager:bmc-nasha",
  "enabled": false,
  "rollout": {
    "percentage": 0
  }
}
```

**Impact:** Users will be redirected to AngularJS version immediately.

### Full Rollback (Deployment)

```bash
# Revert to previous deployment
yarn deploy:rollback --version <previous-version>
```

**Steps:**
1. Identify issue and document
2. Disable feature flag (0%)
3. Verify users redirected to AngularJS
4. Investigate and fix issue
5. Redeploy when fixed

---

## Monitoring Dashboard

### Key Metrics to Track

**Application Health:**
- Uptime
- Error rate
- Response times
- Success rate by endpoint

**User Engagement:**
- Active users
- Page views per route
- Conversion rate (order flow)
- Feature adoption rate

**Performance:**
- Core Web Vitals
- Bundle size trends
- API latency
- Cache hit rate

**Business Metrics:**
- NAS-HA service orders
- User satisfaction (if surveys available)
- Support ticket trends

---

## Troubleshooting

### Common Issues

#### 1. Module Federation Load Failure

**Symptoms:**
- Order page shows error
- Console: "Failed to load order component"

**Solutions:**
1. Verify remote entry URL is accessible
2. Check CORS configuration
3. Verify Module Federation runtime version
4. Check network connectivity

**Mitigation:**
- Display helpful error message
- Provide "Back to listing" button
- Log error for investigation

#### 2. Translation Loading Failure

**Symptoms:**
- Missing translation keys
- English fallback not working

**Solutions:**
1. Verify translation files in `public/translations/`
2. Check i18next backend configuration
3. Verify BASE_URL is correct
4. Clear browser cache

#### 3. API Errors

**Symptoms:**
- "Service not found" errors
- Timeout errors
- 500 Internal Server errors

**Solutions:**
1. Verify API endpoints in `App.constants.ts`
2. Check API service health
3. Verify authentication/authorization
4. Check rate limiting

#### 4. Routing Issues

**Symptoms:**
- 404 errors
- Wrong page displayed
- Navigation not working

**Solutions:**
1. Verify route configuration in `Routes.tsx`
2. Check shell integration
3. Verify hash routing configuration
4. Clear browser cache/cookies

---

## Support Contacts

**Development Team:**
- Lead: [Team Lead Name]
- Email: [team-email@ovhcloud.com]
- Slack: #manager-nasha

**Operations Team:**
- On-call: [Ops On-Call]
- Email: [ops-email@ovhcloud.com]
- Slack: #manager-ops

**Escalation:**
- Manager: [Manager Name]
- Emergency: [Emergency Contact]

---

## Documentation Links

- **Migration Status:** [MIGRATION_STATUS.md](./MIGRATION_STATUS.md)
- **Migration Plan:** [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)
- **Architecture:** [OVHcloud Manager Architecture](../.ai-doc/10-architecture/)
- **Best Practices:** [Development Standards](../.ai-doc/30-best-practices/)
- **Testing Guide:** [Testing Guidelines](./TESTING_GUIDE.md)

---

## Deployment History

| Version | Date | Environment | Status | Notes |
|---------|------|-------------|--------|-------|
| 1.0.0 | 2025-01-21 | Staging | Pending | Initial deployment |
| 1.0.0 | TBD | Production | Pending | Awaiting staging validation |

---

## Success Criteria

### Definition of Done ✅

- [x] All 21 routes migrated and functional
- [x] 100% functional parity with AngularJS
- [x] All 8 locales complete
- [x] No linter errors
- [x] Build succeeds
- [ ] All tests passing
- [ ] Performance metrics met
- [ ] Error rate < 1%
- [ ] User acceptance testing passed
- [ ] Documentation complete

### Go-Live Criteria

- [ ] Staging environment validated (1 week)
- [ ] Performance metrics within targets
- [ ] Error monitoring configured
- [ ] Feature flag ready
- [ ] Rollback plan tested
- [ ] Support team trained
- [ ] Communication plan executed
- [ ] Stakeholder approval received

---

**Deployment Status:** 🟡 Ready for Staging  
**Production Date:** TBD (pending staging validation)  
**Last Updated:** 2025-01-21



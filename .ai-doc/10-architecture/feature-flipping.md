---
title: Feature Flipping
last_update: 2025-10-13
tags: [feature, flipping, bff, ovhcloud, manager]
ai: true
---

# Feature Flipping

## Purpose
Enable or disable frontend features **without redeployment**.

### Prerequisites
- Access to EU/CA/US *feature-availability* BFF repositories
- Go 1.23+, JFrog CLI, and `xcode-select`

### Definition
Features live as JSON under `main/`, split by domain (e.g., `sms.json`).  
Uses **feature-rules** for evaluation based on context and options.

### Usage Examples
```bash
GET /feature/sms/availability
GET /feature/sms,sms:order/availability
```

### Headers
| Header | Description |
|--------|--------------|
| `X-OVH-FEATURE-SEPARATOR` | custom separator for feature list |
| `X-OVH-SUBFEATURE-SEPARATOR` | defines subfeature delimiter |
| `referer` | defines request origin |

### Explain CLI
```bash
npm run explain featurename
npm run explain featurename:subfeature -- --all
```

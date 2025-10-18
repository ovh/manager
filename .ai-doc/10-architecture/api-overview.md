---
title: OVHcloud API Overview
last_update: 2025-10-13
tags: [api, overview, ovhcloud, architecture]
ai: true
---

# OVHcloud API Overview

## 🧭 Overview
This document provides an overview of the different API versions available in the OVHcloud ecosystem and their key features.

### API V6
Legacy customer-facing REST API. No deprecation plan.
- RESTful architecture
- OAuth2 authentication
- Resource management for all OVHcloud products

**Pros:** stable, comprehensive coverage  
**Cons:** older architecture, slower for high-volume ops

### API V2
Modernized REST API using OpenAPI 3 and semver.
- OAuth2 support
- Common patterns and improved expressiveness

**Pros:** faster, unified schema  
**Cons:** migration effort, ongoing development

### ICEBERG
Core backend engine providing sorting, filtering, search, cache management.

**Pros:** provides sorting/filtering out of the box  
**Cons:** first call heavier due to data load

### 2API
Legacy NodeJS middleware aggregating API routes for Manager.  
⚠️ Not recommended for new developments.

### BFF (Backend for Frontend)
Replacement for 2API, optimizes frontend-backend communication.

**Pros:** reduces API complexity, improves performance  
**Cons:** migration and learning curve

### 🔗 References
- [OVHcloud API Docs](https://api.ovh.com/)
- OVHcloud Manager Docs (internal link: OVH-TOOLS-PAGES-MANAGER)

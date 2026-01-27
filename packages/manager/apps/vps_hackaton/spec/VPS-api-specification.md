# Spécification API VPS OVHcloud

Analyse du fichier `dump_network.har` - 254 requêtes HTTP capturées lors d'une session de navigation sur les pages de liste de VPS puis navigation sur les différentes pages de gestion d'un VPS.

---

## 1. Appels Tracking / Monitoring

### Sentry (Error Monitoring)
- `POST https://sentry.ovhcloud.com/api/5/envelope/`
  - Tracking des erreurs et sessions
  - Params: `sentry_key`, `sentry_version`, `sentry_client`
  - Utilisé par sentry.javascript.react 8.13.0 et sentry.javascript.browser 6.19.7

### Cookies Tracking (AT Internet / Tag Commander)
- Cookies: `TCPID`, `TC_PRIVACY`, `TCID`, `TCSESSION`, `atuserid`, `atidvisitor`, `atauthority`
- Cookies Facebook: `_fbp`
- Cookies Reddit: `_rdt_uuid`

---

## 2. Appels Feature Flags / Availability

**Base:** `/engine/2api/feature/`

| Endpoint | Description | Response |
|----------|-------------|----------|
| `GET /engine/2api/feature/{features}/availability` | Check disponibilité features | TFeatureAvailability |

Features observées:
- `livechat,pnr`
- `cloud-shell`
- `billing:autorenew2016Deployment`
- `vps:secondary-dns`
- `billing:commitment`
- `billing:management,contact,contact:management`
- `advices:recommender-system`
- `vps:automateBackup`
- `identity-documents,procedures:fraud,communication`
- `communication:sender-email-addresses`
- Liste complète des features menu (vps, dedicated-server, public-cloud, etc.)

---

## 3. Appels Métier VPS (API v6)

**Base:** `/engine/apiv6/vps`

### Liste des VPS

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/vps` | Liste paginée des VPS | Array<TVps> |
| GET | `/vps.json` | Schéma API VPS | JSON Schema |

**Headers Pagination:**
- `X-Pagination-Mode: CachedObjectList-Pages`
- `X-Pagination-Number`, `X-Pagination-Size`, `X-Pagination-Sort`, `X-Pagination-Sort-Order`

### Détail VPS (par serviceName)

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/vps/{serviceName}` | Infos complètes VPS | TVps |
| GET | `/vps/{serviceName}/datacenter` | Info datacenter | TVpsDatacenter |
| GET | `/vps/{serviceName}/serviceInfos` | Infos service (contacts, billing) | TVpsServiceInfo |
| GET | `/vps/{serviceName}/version` | Version VPS | { version: number } |
| GET | `/vps/{serviceName}/disks` | Liste des disques | Array<TDisk> |
| GET | `/vps/{serviceName}/disks/` | Détail disques | Array<TDisk> |
| GET | `/vps/{serviceName}/ips` | IPs du VPS | Array<TVpsIp> |
| GET | `/vps/{serviceName}/secondaryDnsDomains` | DNS secondaires | Array<TSecondaryDnsDomain> |

### Migration

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/vps/{serviceName}/migration2018` | Statut migration 2018 | TVpsMigration |
| GET | `/vps/{serviceName}/migration2020` | Statut migration 2020 | TVpsMigration |
| GET | `/vps/migrationStein` | Migration Stein global | Array<TVpsMigration> |

### Backup Automatisé

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/vps/{serviceName}/automatedBackup` | Config backup auto | TVpsAutomatedBackup |
| GET | `/vps/{serviceName}/automatedBackup/restorePoints?state=available` | Points de restauration disponibles | Array<TRestorePoint> |
| GET | `/vps/{serviceName}/automatedBackup/restorePoints?state=restoring` | Points en cours de restauration | Array<TRestorePoint> |
| GET | `/vps/{serviceName}/automatedBackup/attachedBackup` | Backups attachés | Array<TBackup> |
| GET | `/vps/{serviceName}/option/automatedBackup` | Option backup | TOption |

---

## 4. Appels Métier VPS (2API - Backend For Frontend)

**Base:** `/engine/2api/`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/sws/vps/{serviceName}/info` | Infos condensées VPS | TVpsInfo |
| GET | `/sws/vps/{serviceName}/tabsummary` | Résumé dashboard | TVpsTabSummary |
| GET | `/sws/vps/{serviceName}/tasks/uncompleted` | Tâches en cours | Array<TTask> |
| GET | `/sws/vps/{serviceName}/tasks/uncompleted?type=upgradeVm` | Upgrades en cours | Array<TTask> |
| GET | `/sws/vps/{serviceName}/tasks/uncompleted?type=migrate` | Migrations en cours | Array<TTask> |
| GET | `/sws/vps/{serviceName}/tasks/error` | Tâches en erreur | Array<TTask> |
| GET | `/vps/capabilities/{serviceName}?modelName=xxx` | Capacités du modèle | TVpsCapabilities |
| GET | `/advices/vps/{serviceName}` | Conseils/recommandations | Array<TAdvice> |
| GET | `/advices/retention/vps/{serviceName}` | Conseils rétention | Array<TAdvice> |

---

## 5. Appels Services / Billing

**Base:** `/engine/apiv6/services`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/services?resourceName={name}` | Service par nom de ressource | TService |
| GET | `/services/{serviceId}` | Détail service | TService |
| GET | `/services/{serviceId}/upgrade` | Options d'upgrade | Array<TUpgradePlan> |
| GET | `/services/{serviceId}/billing/engagement/available` | Engagements disponibles | Array<TEngagement> |
| GET | `/services/{serviceId}/billing/engagement/request` | Demande engagement | TEngagementRequest |

---

## 6. Appels Utilisateur / Compte

**Base:** `/engine/apiv6/me`

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/me` | Infos compte utilisateur | TMe |
| GET | `/me/accessRestriction/backupCode` | Codes backup 2FA | Array<string> |
| GET | `/me/payment/method?status=VALID` | Méthodes paiement valides | Array<TPaymentMethod> |
| GET | `/me/payment/method/{id}` | Détail méthode paiement | TPaymentMethod |
| GET | `/me/procedure/fraud` | Procédure fraude | TFraudProcedure |
| GET | `/me/recommendations?max=1` | Recommandations | Array<TRecommendation> |
| GET | `/me/recommendations?max=1&range=vps` | Recommandations VPS | Array<TRecommendation> |
| GET | `/me/preferences/manager/{key}` | Préférences manager | string |

Clés préférences observées:
- `NAV_RESHUFFLE_BETA_ACCESS`
- `OVH_MANAGER_NAVIGATION_GUIDED_TOUR`
- `PUBLIC_CLOUD_DEFAULT_PROJECT`

---

## 7. Appels Catalogue / Commande

| Method | Endpoint | Description | Response |
|--------|----------|-------------|----------|
| GET | `/engine/apiv6/order/catalog/public/vps?ovhSubsidiary=FR` | Catalogue VPS | Array<TCatalogProduct> |

---

## 8. Appels Secondaires (Private Database - hors scope VPS)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/engine/apiv6/hosting/privateDatabase` | Liste DB privées |
| GET | `/engine/apiv6/hosting/privateDatabase/{name}` | Détail DB |
| GET | `/engine/apiv6/hosting/privateDatabase/{name}/whitelist?ip=...&service=true` | Whitelist IP |

---

## 9. Appels Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/engine/2api/notification?target=EU&lang=en_GB` | Notifications |
| GET | `/engine/2api/services/count` | Compteur services |

---

## Types de données principaux

### TVps (liste)

```typescript
type TVps = {
  iam: { id: string; urn: string; state: string };
  name: string;           // "vps-xxx.vps.ovh.net"
  zone: string;           // "Region OpenStack: os-sbg6"
  zoneType: "region" | "localzone";
  model: TVpsModel;
  state: "running" | "rescued" | "stopped";
  vcore: number;
  memoryLimit: number;
  displayName: string;
  offerType: "ssd";
  netbootMode: "local" | "rescue";
  lockStatus: { locked: boolean; reason: string };
  slaMonitoring: boolean;
  monitoringIpBlocks: Array<string>;
};

type TVpsModel = {
  disk: number;
  name: string;           // "vps-2025-model1"
  offer: string;          // "VPS-1"
  vcore: number;
  memory: number;
  version: string;        // "2025v1"
  datacenter: Array<string>;
  availableOptions: Array<string>;
  maximumAdditionnalIp: number;
};
```

### TVpsServiceInfo

```typescript
type TVpsServiceInfo = {
  domain: string;
  status: string;
  serviceId: number;
  contactTech: string;
  contactAdmin: string;
  contactBilling: string;
  renewalType: string;
  expiration: string;     // "2026-10-17"
  creation: string;
  engagedUpTo: string | null;
  canDeleteAtExpiration: boolean;
  possibleRenewPeriod: Array<number>;
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period: number;
    manualPayment: boolean;
    forced: boolean;
  };
};
```

### TVpsDatacenter

```typescript
type TVpsDatacenter = {
  name: string;           // "SBG"
  longName: string;       // "Strasbourg SBG6"
  country: string;        // "fr"
};
```

### TVpsInfo

```typescript
type TVpsInfo = {
  state: string;
  messages: Array<string>;
  availableOptions: Array<string>;
  canOrder: boolean;
  cluster: string;
  creation: string;
  displayName: string;
  diskPercent: number;
  diskTotal: { unit: string; value: number };
  diskUsed: { unit: string; value: number };
  distribution: { name: string; id: string };
  engagement: { defaultEndAction: string; duration: string; type: string };
  expiration: string;
  hasBackup: boolean;
  hasVeeam: boolean;
  ipv4: string;
  ipv6: string;
  isExpired: boolean;
  isValidVersionToRescheduleAutomatedBackup: boolean;
  location: { country: string; datacentre: string; longName: string };
  lockStatus: { locked: boolean; reason: string };
  model: string;
  monitoringIpBlocks: Array<string>;
  name: string;
  netbootMode: string;
  noVNC: boolean;
  offerType: string;
  ram: { unit: string; value: number };
  reverseDns: string | null;
  secondaryDns: number;
  shouldReengage: boolean | null;
  slaMonitoring: boolean;
  tabs: { expert: Array<string>; simple: Array<string> };
  vcore: number;
  version: string;
  zone: string;
  zoneType: string;
  traficPercent: number;
  traficTotal: { unit: string; value: number };
  traficUsed: { unit: string; value: number };
};
```

### TVpsTabSummary

```typescript
type TVpsTabSummary = {
  messages: Array<string>;
  state: string;
  additionalDisk: TOptionStatus;
  windows: TOptionStatus;
  ftpBackup: TOptionStatus;
  snapshot: TOptionStatus & {
    creationDate: string | null;
    description: string | null;
  };
  windowsActivated: TOptionStatus;
  veeam: TOptionStatus & { optionDetails: unknown | null };
  ipsv4Count: number;
  ipsv6Count: number;
  ipsv4Max: number;
  canGetMoreIpv4: boolean;
  ipsv6Max: number;
};

type TOptionStatus = {
  optionAvailable: boolean;
  optionActivated: boolean;
};
```

### TVpsMigration

```typescript
type TVpsMigration = {
  status: "notAvailable" | "available" | "inProgress" | "done";
  position: number | null;
  date: string | null;
  currentPlan: string;
  targetPlan: string | null;
  availablePlans: Array<string>;
};
```

### TVpsCapabilities

```typescript
type TVpsCapabilities = Array<string>;
// Exemples: ["additional-disk", "automatedBackup", "autorenew", "backup-storage", "cloud-database", "monitoring", "reinstall", "status", "summary", "upgrade", "veeam"]
```

### TVpsAutomatedBackup

```typescript
type TVpsAutomatedBackup = {
  rotation: number;
  state: "enabled" | "disabled";
  serviceResourceName: string;
  schedule: string;  // Format "HH:mm:ss"
};
```

### TVpsIp

```typescript
type TVpsIp = {
  type: "primary" | "additional";
  gateway: string;
  reverse: string | null;
  version: "v4" | "v6";
  ipAddress: string;
  macAddress: string;
  geolocation: string;
};
```

### TService

```typescript
type TService = {
  route: {
    path: string;
    url: string;
    vars: Array<{ key: string; value: string }>;
  };
  billing: {
    nextBillingDate: string;
    expirationDate: string;
    plan: { code: string; invoiceName: string };
    pricing: TPricing;
    group: string | null;
    lifecycle: {
      current: {
        pendingActions: Array<string>;
        terminationDate: string;
        creationDate: string;
        state: string;
      };
      capacities: { actions: Array<string> };
    };
    renew: {
      current: { mode: string; nextDate: string | null; period: number | null };
      capacities: { mode: Array<string> };
    };
    engagement: {
      endDate: string;
      endRule: { possibleStrategies: Array<string>; strategy: string };
    };
    engagementRequest: unknown | null;
  };
  resource: {
    displayName: string;
    name: string;
    state: string;
    product: { name: string; description: string };
    resellingProvider: string | null;
  };
  serviceId: number;
  parentServiceId: number | null;
  customer: {
    contacts: Array<{ customerCode: string; type: string }>;
  };
  tags: Array<string>;
};
```

### TUpgradePlan

```typescript
type TUpgradePlan = {
  planCode: string;
  productName: string;
  productType: string;
  invoiceName: string;
  prices: Array<TPricing>;
};

type TPricing = {
  capacities: Array<string>;
  description: string;
  interval: number;
  duration: string;
  minimumQuantity: number;
  maximumQuantity: number;
  minimumRepeat: number;
  maximumRepeat: number;
  price: { currencyCode: string; text: string; value: number };
  priceInUcents: number;
  pricingMode: string;
  pricingType: string;
  engagementConfiguration?: {
    duration: string;
    type: string;
    defaultEndAction: string;
  };
};
```

### TMe

```typescript
type TMe = {
  nichandle: string;
  email: string;
  firstname: string;
  name: string;
  organisation: string;
  address: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
  phoneCountry: string;
  phoneType: string;
  fax: string | null;
  language: string;
  currency: { code: string; symbol: string };
  ovhCompany: string;
  ovhSubsidiary: string;
  state: string;
  legalform: string;
  vat: string;
  customerCode: string;
  kycValidated: boolean;
  sex: string;
  birthDay: string;
  birthCity: string;
  area?: string;
  companyNationalIdentificationNumber?: string | null;
  nationalIdentificationNumber?: string | null;
  italianSDI?: string;
  spareEmail?: string;
  purposeOfPurchase?: string | null;
  complementaryAddress?: string | null;
};
```

### TPaymentMethod

```typescript
type TPaymentMethod = {
  paymentMethodId: number;
  paymentMeanId: number;
  paymentType: string;
  paymentSubType: string;
  label: string;
  description: string;
  status: "VALID" | "EXPIRED" | "BLOCKED";
  default: boolean;
  oneclick: boolean;
  integration: string;
  creationDate: string;
  lastUpdate: string;
  expirationDate: string | null;
  icon: { name: string; data: string; url: string | null };
};
```

### TFeatureAvailability

```typescript
type TFeatureAvailability = {
  [featureName: string]: boolean;
};
// Exemple: { "vps:secondary-dns": true, "billing:commitment": false, "billing:autorenew2016Deployment": false }
```

---

## Headers communs

**Request:**
- `X-OVH-MANAGER-NAVIGATION-ID`
- `X-OVH-MANAGER-REQUEST-ID`
- `X-OVH-MANAGER-PAGE`
- `X-OVH-MANAGER-VERSION`
- `Content-Language`
- `sentry-trace` (optionnel)

**Response:**
- `x-ovh-queryid`
- `x-pagination-*` (pour les listes)

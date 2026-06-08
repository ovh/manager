# Zerto — Types, constantes et helpers partagés

## Contexte

Ce fichier documente les contrats de données, constantes métier et règles de validation communes aux 3 onglets (Configuration, VRA, LTR). Ces éléments sont à reproduire dans le repo Angular cible.

---

## 1. Types de données

### ZertoStatus (état lu au chargement de la page)
```
{
  state: ZertoState                          // état brut API
  formattedState: ZertoFormattedState        // état normalisé (voir règle ci-dessous)
  drpType: "ovh" | "onPremise" | null        // type de DRP activé
  remoteSiteInformation: {
    serviceName: string
    datacenterId: number
    state: string
    vpnConfigState: string
  } | null
  vpnStatus: "configured" | "configuring" | "error" | "notConfigured" | null
  serviceName: string | null
  datacenterId: number | null
}
```

### ZertoRemoteSite (sites distants — onPremise uniquement)
```
{
  id: number
  label: string
  state: ZertoSiteState
  remoteEndpointPublicIp: string
  remoteVraNetwork: string
  remoteZvmInternalIp: string
}
```

### ZertoVrasResource (VRA)
```
{
  vmId: number
  vraName: string
  cpu: number
  memory: number
  profil?: string
}
```

### ZertoLtrBucket (bucket LTR)
```
{
  repositoryId: string
  repositoryName: string
  endpointUrl: string
  objectStorageAccessKey: string
  objectStorageSecretKey: string
  immutabilityDays: number
  isImmutable?: boolean
  repositoryType?: "standard" | "highPerformance"
  defaultRepository?: boolean
}
```

### ZertoLtrBucketAddPayload (création bucket)
```
{
  repositoryName: string
  bucketName: string                         // même valeur que repositoryName
  endPointUrl: string                        // trailing slash supprimé avant envoi
  objectStorageAccessKey: string
  objectStorageSecretKey: string
  numberOfDays: number                       // 0 si immutabilité désactivée ou policy perVPG
  repositoryType: "standard" | "highPerformance"
  enableImmutability: boolean
  immutabilityPolicy: string                 // "Period" ou "perVPGRetentionPolicy"
  defaultRepository?: boolean
}
```

### ZertoLtrBucketEditPayload (édition bucket)
```
{
  repositoryId: string
  repositoryName: string
  endPointUrl: string
  numberOfDays: number
  repositoryType?: "standard" | "highPerformance"
  enableImmutability?: boolean
  defaultRepository?: boolean
  objectStorageAccessKey?: string            // omis si non modifié
  objectStorageSecretKey?: string            // omis si non modifié
}
```

### VraPendingState (état localStorage VRA)
```
{
  startedAt: number                          // timestamp ms
  vras: Array<{ vmId: number; cpu: number; memory: number }>
}
```

---

## 2. Enums et valeurs

### ZertoState (valeurs brutes API)
`delivered | delivering | disabled | disabling | error | provisionning | toDisable | todo | toProvision | toUnprovision | unprovisionning`

### ZertoFormattedState (état normalisé — règle de mapping)
| États bruts | → formattedState |
|---|---|
| `delivered` | `delivered` |
| `delivering`, `provisionning`, `toProvision` | `delivering` |
| `disabling`, `toDisable`, `toUnprovision`, `unprovisionning` | `disabling` |
| `error` | `error` |
| tout autre | `disabled` |

### ZertoSiteState (état badge site distant)
`creating | deleting | delivered | error | toCreate | toDelete | toUpdate | unknown | updating`

Couleur badge par état :
| État | Couleur |
|---|---|
| `delivered` | success (vert) |
| `creating`, `toCreate`, `unknown` | warning (orange) |
| `deleting`, `toDelete`, `error` | critical (rouge) |
| `toUpdate`, `updating` | information (bleu) |

### PccType
`"EPCC" | "MBM"` — déterminé par `service.productReference`

### Profils VRA (specs CPU/RAM)
| Profil | CPU | RAM (GiB) |
|---|---|---|
| XS | 1 | 2 |
| S | 2 | 6 |
| L | 4 | 12 |
| XL | 4 | 16 |

---

## 3. Constantes métier

```
LTR_IMMUTABILITY_MIN_DAYS = 30
LTR_IMMUTABILITY_MAX_DAYS = 90

LTR_IMMUTABILITY_POLICY = {
  period: "Period",
  perVPGRetentionPolicy: "perVPGRetentionPolicy"
}

ZERTO_PLAN_CODES = {
  ovh: "pcc-option-zerto",
  onPremise: "pcc-option-zerto-single"
}

EXCLUDED_IP_STATUSES = ["broadcast", "gateway", "hsrp"]
```

---

## 4. Règles de validation

### IPv4 simple
- Regex : `/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/`
- Chaque octet doit être entre 0 et 255

### IPv4 CIDR
- Regex : `/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/`
- Chaque octet entre 0 et 255
- Masque paramétrable : pour les réseaux VRA le masque doit être entre /22 et /28

### Filtrage IP exclues
Une IP est exclue si son champ `usage` vaut `broadcast`, `gateway`, ou `hsrp`, ou si le champ correspond à une adresse MAC (format `xx:xx:xx:xx:xx:xx`).

### URL endpoint LTR
- Regex : `/^https:\/\/s3\.[a-z]+(?:-[a-z]+)*\.(io|perf)\.cloud\.ovh\.net$/i`
- Exemple valide : `https://s3.gra.io.cloud.ovh.net`
- Trailing slash supprimé avant envoi API

### Statut service (badge)
| Valeur API | Couleur | Label |
|---|---|---|
| `ok` | success | i18n: `drp.cards.statusOk` |
| `expired` | critical | i18n: `drp.cards.statusExpired` |
| toute autre | warning | valeur brute ou `-` |

---

## 5. Discriminant drpType

Toutes les URLs API bifurquent selon `drpType` :

| drpType | Segment URL |
|---|---|
| `ovh` | `zerto` |
| `onPremise` | `zertoSingle` |

Base commune : `/dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/`

---

## 6. Gestion du localStorage (état pending)

### VRA pending
- Clé : `vra-pending-resize-{serviceName}-{datacenterId}`
- Contenu : `VraPendingState` (voir type ci-dessus)
- Timeout : **10 minutes** — si dépassé, supprimer la clé + afficher une erreur
- Polling API : **60 secondes** tant qu'un pending est actif
- Résolution : le pending est résolu quand `current.cpu === pending.cpu && current.memory === pending.memory` pour chaque VRA
- Erreur consécutive : après **3 erreurs API consécutives**, abandonner le pending et afficher une erreur

### LTR pending add
- Clé : `ltr-pending-add-{serviceName}-{datacenterId}`
- Contenu : `{ expectedCount: number, bucketName: string }`
- Polling API : **30 secondes** tant qu'un pending est actif
- Résolution : le pending est résolu quand `buckets.length >= expectedCount`

# Zerto — Onglet Configuration

## Périmètre

L'onglet Configuration est le premier onglet affiché quand Zerto est activé (`formattedState === "delivered"` ou `"delivering"`). Il affiche un résumé visuel de la configuration DRP active. La vue diffère selon que le type est `ovh` (2 PCC) ou `onPremise` (PCC + infra tierce).

---

## 1. Règle d'entrée : routage vers la bonne vue

```
if drpType === "ovh"  → afficher vue OVH
if drpType === "onPremise" → afficher vue OnPremise
```

Les deux vues partagent la même structure de page (titre + grille de cartes + bouton delete), mais le contenu des cartes et les données chargées diffèrent.

---

## 2. Vue OVH (drpType = "ovh")

### Données chargées
| Donnée | Endpoint | Notes |
|---|---|---|
| Datacenter primaire | `GET /dedicatedCloud/{svc}/datacenter/{dcId}` | Pour afficher le nom |
| Datacenter secondaire | `GET /dedicatedCloud/{remoteSvc}/datacenter/{remoteDcId}` | `remoteSvc` et `remoteDcId` viennent de `zertoStatus.remoteSiteInformation` |
| Infos service (statut) | `GET /dedicatedCloud/{svc}/serviceInfos` | Pour le badge de statut abonnement |

### Structure visuelle : 4 cartes en grille (3 colonnes)

**Titre de la section :** "Plan de reprise d'activité (PRA)"

**Carte 1 — Type de plan de reprise d'activité**
- Titre de carte : "Type de plan de reprise d'activité"
- Ligne 1 (label) : "Configuration"
- Ligne 2 (description, couleur atténuée) :
  - Si pccType = EPCC : "Entre deux Private Cloud OVH"
  - Si pccType = MBM : "Entre deux Managed Bare Metal"

**Carte 2 — Site principal**
- Titre de carte : "Site principal"
- Champ 1 :
  - Label : "Managed VMware vSphere principal" (EPCC) ou "Managed Bare Metal principal" (MBM)
  - Valeur : lien vers le détail du service primaire (texte = nom du service)
- Séparateur horizontal
- Champ 2 :
  - Label : "Datacenter principal"
  - Valeur : nom du datacenter (skeleton pendant chargement, fallback `DC {datacenterId}`)

**Carte 3 — Site secondaire**
- Titre de carte : "Site secondaire"
- Si `remoteSiteInformation` existe :
  - Champ 1 :
    - Label : "Managed VMware vSphere secondaire" (EPCC) ou "Managed Bare Metal secondaire" (MBM)
    - Valeur : lien vers le détail du service secondaire
  - Séparateur
  - Champ 2 :
    - Label : "Datacenter secondaire"
    - Valeur : nom du DC secondaire (skeleton / fallback `DC {remoteDcId}`)
- Si `remoteSiteInformation` est null : afficher `-`

**Carte 4 — Abonnement**
- Titre de carte : "Abonnement"
- Champ 1 :
  - Label : "Service"
  - Valeur : nom du service (texte brut)
- Séparateur
- Champ 2 :
  - Label : "Statut"
  - Valeur : badge de statut (voir règle dans spec-shared)
    - Pendant chargement : skeleton
    - En erreur : message critique "Une erreur est survenue durant l'installation du plan. Veuillez contacter le support"
    - Si data absente : `-`
- **Bouton delete** (couleur critical, variante outline)
  - Label : "Supprimer le service"
  - Texte d'aide sous le bouton : "Une étape de confirmation vous sera demandée."
  - **Désactivé** si l'une des conditions suivantes est vraie :
    - `formattedState === "delivering"`
    - `vpnStatus === "configuring"`
    - `remoteSiteInformation.state` formaté ≠ `"delivered"`

### Action delete
Ouvre une modale de confirmation (voir section 4).

---

## 3. Vue OnPremise (drpType = "onPremise")

### Données chargées
| Donnée | Endpoint | Notes |
|---|---|---|
| Datacenter primaire | `GET /dedicatedCloud/{svc}/datacenter/{dcId}` | |
| Infos service | `GET /dedicatedCloud/{svc}/serviceInfos` | |

### Structure visuelle : 3 cartes + liste de sites

**Titre de la section :** "Plan de reprise d'activité (PRA)"

**Carte 1 — Type de plan de reprise d'activité**
- Titre : "Type de plan de reprise d'activité"
- Ligne 1 : "Configuration"
- Ligne 2 (description) :
  - Si pccType = EPCC : "Entre votre infrastructure et un Private Cloud OVH"
  - Si pccType = MBM : "Entre votre infrastructure et un Managed Bare Metal"

**Carte 2 — Site principal (OVH)**
- Titre : "Site principal"
- Champ 1 :
  - Label : "Private Cloud OVH" (EPCC) ou "OVH Managed Bare Metal" (MBM)
  - Valeur : lien vers le service OVH
- Séparateur
- Champ 2 :
  - Label : "Datacenter OVH"
  - Valeur : nom du datacenter (skeleton / fallback)

**Carte 3 — Abonnement**
- Identique à la carte 4 OVH (Titre, champs Service + Statut + bouton delete)
- Règle de désactivation du delete simplifiée : **désactivé uniquement si `formattedState === "delivering"`**

### Liste de sites distants (sous les cartes)

**Chargement des données**
- `GET /dedicatedCloud/{svc}/datacenter/{dcId}/disasterRecovery/zertoSingle/remoteSites`
- Activé uniquement si `formattedState === "delivered"` (pas de fetch en `delivering`)

**Colonnes du tableau**
| Colonne | Champ source | Tri |
|---|---|---|
| Label | `site.label` | non |
| Statut | badge coloré via `site.state` (voir spec-shared) | non |
| IP public | `site.remoteEndpointPublicIp` | non |
| Réseau VRA datacenter | `site.remoteVraNetwork` | non |
| IP Zvm | `site.remoteZvmInternalIp` | non |
| Actions | menu contextuel | — |

**Action par ligne :** "Supprimer" (icône trash, couleur critical)
- Navigue vers la route modale `drp/delete-site/{site.id}`

**Bouton au-dessus du tableau :** "Ajouter un site"
- **Désactivé** si `formattedState === "delivering"`
- Navigue vers la route modale `drp/add-site`

---

## 4. Modale de suppression Zerto (delete)

Accessible depuis les deux vues (OVH et OnPremise).

### Contenu de la modale
- Titre : "Suppression du plan de reprise d'activité"
- Corps : "Êtes-vous sûr(e) de vouloir supprimer le PRA ? Cette action est irréversible."
- Bouton primaire (critical) : "Confirmer"
- Bouton secondaire : "Annuler"

### API appelée selon drpType

**OVH :**
```
POST /dedicatedCloud/{svc}/datacenter/{dcId}/disasterRecovery/zerto/disable
Body: {
  secondaryServiceName: string,    // "" si null
  secondaryDatacenterId: number    // 0 si null
}
```

**OnPremise :**
```
POST /dedicatedCloud/{svc}/datacenter/{dcId}/disasterRecovery/zertoSingle/disable
Body: {}
```

### Comportement
- Après succès : invalider les queries de statut Zerto du service, toast : "Votre PRA Zerto est en cours de suppression. L'opération prendra quelques minutes"
- En erreur : toast "Une erreur est survenue lors de la suppression du plan de reprise d'activité"

---

## 5. Onglet boutons (navigation entre les 3 vues)

Affiché au-dessus des 3 vues tant que `formattedState` est `delivered` ou `delivering`.

| Bouton | Label | Vue activée | Toujours visible |
|---|---|---|---|
| 1 | "Configuration" | `configuration` | oui |
| 2 | "VRA" | `vra` | oui |
| 3 | "LTR" | `ltr` | **non — uniquement si feature flag `DEDICATED_CLOUD_ZERTO_LTR` actif** |

Vue active par défaut au montage : `configuration`.

---

## 6. Notifications automatiques (montage de la page)

Ces notifications sont émises une seule fois au montage, en lisant `zertoStatus`.

| Condition | Type | Texte |
|---|---|---|
| `formattedState === "delivered"` + `drpType === "ovh"` + pccType=EPCC | success | "Votre Plan Reprise d'Activité Zerto entre ce Private Cloud et le Private Cloud {pccId} a été installé avec succès !" |
| `formattedState === "delivered"` + `drpType === "ovh"` + pccType=MBM | success | "Votre Plan Reprise d'Activité Zerto entre ce Essentials et le Essentials {pccId} a été installé avec succès !" |
| `formattedState === "delivered"` + `drpType === "onPremise"` | success | "votre infrastructure distante a été installée avec succès !" |
| Dans les deux cas delivered : si `service.description` existe | ajout à la fin du message | "Vous avez reçu votre mot de passe ZSSP sur l'adresse email {email}." |
| `formattedState === "delivering"` + pccType=EPCC | info (non-dismissible) | "Votre PRA Zerto est en cours d'activation. L'opération peut prendre jusqu'à 4 heures de délai. N'hésitez pas à vérifier la tâche enableDisasterRecovery du PCC principal pour suivre son avancement." |
| `formattedState === "delivering"` + pccType=MBM | info (non-dismissible) | "Votre PRA Zerto est en cours d'activation. L'opération peut prendre jusqu'à 4 heures de délai. N'hésitez pas à vérifier la tâche enableDisasterRecovery du Essentials principal pour suivre son avancement." |
| `vpnStatus === "notConfigured"` ET `drpType === "onPremise"` | warning (non-dismissible) | "Pour finaliser l'activation de votre option Zerto, veuillez configurer les paramètres de votre site via la page de configuration" |

Toutes ces notifications sont filtrées pour n'apparaître que sur les sous-routes contenant `zerto`.

---

## 7. Badge de statut service (dans la carte Abonnement)

| Valeur API `serviceInfos.status` | Couleur badge | Texte badge |
|---|---|---|
| `ok` | success (vert) | "Actif" |
| `expired` | critical (rouge) | "Expiré" |
| toute autre valeur | warning (orange) | valeur brute de l'API |
| absent | — | `-` |

# Zerto — Onglet LTR (Long-Term Retention)

## Périmètre

L'onglet LTR permet de gérer des buckets Object Storage OVH utilisés pour la rétention longue durée Zerto. Il est disponible uniquement si le **feature flag `DEDICATED_CLOUD_ZERTO_LTR`** est actif. Il est accessible quel que soit le `drpType` (ovh ou onPremise). Les 3 actions disponibles sont : ajouter, éditer, supprimer un bucket.

---

## 1. Données chargées

### Endpoint
```
GET /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/extendedJournal
```
où `base` vaut `zerto` si `drpType === "ovh"`, ou `zertoSingle` si `drpType === "onPremise"`.

**Réponse** : tableau de `ZertoLtrBucket[]` (voir spec-shared)

### Polling
- Actif uniquement si un pending add est présent en localStorage
- Intervalle : **30 secondes**
- Résolution : `buckets.length >= pending.expectedCount`
- En erreur pendant le polling : supprimer le pending + toast erreur : "Une erreur est survenue lors de la vérification du statut du bucket LTR. Veuillez rafraîchir la page."

---

## 2. Structure de la page

### Texte d'introduction
"LTR vous permet de configurer un repository basé sur OVHcloud Object Storage pour stocker le journal de données Zerto sur la durée que vous définissez dans le Manager."
- Le mot "LTR" est rendu dans une balise `<abbr title="Long-Term Retention">`

### Bouton "Ajouter un bucket"
- Label : **"Ajouter un bucket"**
- Positionné à droite, au-dessus du tableau
- **Visible uniquement** si le tableau a au moins un bucket OU si un pending add est actif
- (Si le tableau est vide et sans pending → seul l'empty state propose le CTA)

### Tableau des buckets

**Colonnes :**
| Colonne | Entête | Source | Notes |
|---|---|---|---|
| 1 | "Nom du bucket" | `repositoryName` | Trié alphabétiquement |
| 2 | "Nombre de jours" | `immutabilityDays` | Voir règle ci-dessous |
| 3 | "Endpoint" | `endpointUrl` | |
| 4 | *(vide)* | Menu contextuel | Actions éditer / supprimer |

**Règle colonne "Nombre de jours" :**
- Si `immutabilityDays === 0` : afficher "N/A" + icône info avec tooltip : "Non applicable pour la politique Per VPG Retention Policy"
- Sinon : afficher la valeur numérique

**Ligne pending (en cours d'ajout) :**
- Si un `pendingBucketName` est actif : ajouter une ligne fictive **à la fin** du tableau avec :
  - Colonne nom : nom du bucket en cours d'ajout (ou "Ajout du nouveau bucket LTR en cours...")
  - Colonnes "Nombre de jours" et "Endpoint" : vides
  - Colonne actions : spinner uniquement (pas d'actions disponibles)

### État vide (aucun bucket, aucun pending)

- Icône : box
- Titre : **"Aucun repository LTR configuré"**
- Description : "Pour activer la rétention longue durée, vous devez associer un bucket **OVHcloud Object Storage** à votre environnement Zerto. Vous n'en avez pas encore ? Créez-en un en quelques minutes depuis l'interface OVHcloud."
- Lien externe : **"Créer un bucket OVHcloud"**
  - URL : `https://www.ovh.com/auth/?onsuccess=https%3A//manager.eu.ovhcloud.com/%23/public-cloud/create-object-storage&ovhSubsidiary={subsidiary}`
  - `subsidiary` = profil utilisateur (`ovhSubsidiary`, défaut : `"FR"`)
- Bouton outline : **"+ Ajouter un bucket existant"** → ouvre la modale d'ajout

---

## 3. Modale d'ajout de bucket

### Titre
"Ajouter un bucket LTR"

### Messages informatifs en tête de modale
1. Message information : "Seuls les buckets OVHcloud Object Storage sont pris en charge."
2. Message warning : "L'Object Lock doit être activé sur votre bucket OVHcloud Object Storage. Sans cette configuration, le LTR ne pourra pas fonctionner correctement."

### Champs du formulaire
| Champ | Label | Type | Requis | Validation |
|---|---|---|---|---|
| Nom du bucket | "Nom du bucket" | text | oui | Doit être unique → erreur "Un bucket avec ce nom existe déjà." |
| URL de l'endpoint | "URL de l'endpoint" | text | oui | Regex : `/^https:\/\/s3\.[a-z]+(?:-[a-z]+)*\.(io\|perf)\.cloud\.ovh\.net$/i` → erreur "Veuillez saisir une URL valide (ex : https://s3.<région>.io.cloud.ovh.net)" |
| Clé d'accès | "Clé d'accès" | text | oui | Requis |
| Clé secrète | "Clé secrète" | password | oui | Requis |
| Type de stockage | "Type de stockage" | radio | oui | `Standard` (défaut) ou `High Performance` |
| Activer l'immutabilité | "Activer l'immutabilité" | toggle | non | Défaut : désactivé. Description sous le label : "Protège les données contre la suppression ou modification pendant la période définie" |

**Placeholders :**
- Nom du bucket : "ex : zerto-ltr-bucket"
- URL endpoint : "https://s3.<région>.io.cloud.ovh.net"

**Champs conditionnels (visibles seulement si toggle immutabilité = ON) :**
| Champ | Label | Type | Validation |
|---|---|---|---|
| Type d'immutabilité | "Type d'immutabilité" | radio | "Période" ou "Per VPG Retention Policy" (défaut) |
| Nombre de jours | "Nombre de jours" | number | Visible seulement si type = "Période". Min : 30, Max : 90. Hint : "Valeur comprise entre 30 et 90" |

**Message warning en pied de modale :**
"La configuration de votre bucket peut prendre jusqu'à 15 minutes. Pendant ce délai, il ne vous sera pas possible d'ajouter un nouveau bucket."

### Boutons
- Primaire : "Ajouter" (désactivé si formulaire invalide)
- Secondaire : "Annuler"

### Construction du payload
```json
{
  "repositoryName": "<valeur saisie>",
  "bucketName": "<même valeur que repositoryName>",
  "endPointUrl": "<URL avec trailing slash supprimé>",
  "objectStorageAccessKey": "<accessKey>",
  "objectStorageSecretKey": "<secretKey>",
  "repositoryType": "standard" | "highPerformance",
  "numberOfDays": "<immutabilité ON && policy=Période ? immutabilityDays : 0>",
  "enableImmutability": true | false,
  "immutabilityPolicy": "<si activé: 'Period' ou 'perVPGRetentionPolicy'; si désactivé: 'perVPGRetentionPolicy'>"
}
```

### Endpoint
```
POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/extendedJournal
Body: ZertoLtrBucketAddPayload
```

### Comportement après succès
1. Toast succès : **"Le bucket LTR est en cours d'ajout. Veuillez patienter quelques instants."**
2. Écrire dans localStorage :
   ```
   clé : ltr-pending-add-{serviceName}-{datacenterId}
   valeur : { expectedCount: buckets.length + 1, bucketName: repositoryName }
   ```
3. Fermer la modale
4. Démarrer le polling (30s)

### Comportement en erreur
- Erreur 409 (conflict) → toast : **"Un ajout de bucket est déjà en cours. Veuillez patienter avant d'en ajouter un nouveau."**
- Autre erreur → toast : **"Une erreur est survenue lors de l'ajout du bucket LTR"**
- Modale fermée dans tous les cas d'erreur

---

## 4. Modale d'édition de bucket

### Titre
"Modifier le bucket LTR"

### Pré-remplissage des champs
| Champ | Valeur initiale |
|---|---|
| Nom du bucket | `bucket.repositoryName` |
| URL de l'endpoint | `bucket.endpointUrl` |
| Clé d'accès | vide (placeholder "****") |
| Clé secrète | vide (placeholder "****") |
| Type de stockage | `bucket.repositoryType` ou `"standard"` si absent |
| Activer l'immutabilité | `bucket.isImmutable ?? false` |
| Type d'immutabilité | "Période" si `bucket.isImmutable && bucket.immutabilityDays > 0`, sinon "Per VPG Retention Policy" |
| Nombre de jours | `bucket.immutabilityDays` si > 0, sinon 30 |

**Hint sous les champs clé d'accès / clé secrète :**
"Laissez les champs vides pour conserver les valeurs actuelles"

### Règle spéciale : clés access/secret
Les clés ne sont envoyées dans le payload **que si elles ont été modifiées** par l'utilisateur.

### Validation
- URL endpoint : même regex que l'ajout
- Nombre de jours : min 30, max 90, affiché uniquement si type = "Période"
- Nom du bucket : requis (pas de vérification d'unicité)

### Construction du payload
```json
{
  "repositoryId": "<bucket.repositoryId>",
  "repositoryName": "<valeur>",
  "endPointUrl": "<URL>",
  "repositoryType": "standard" | "highPerformance",
  "numberOfDays": "<immutabilité ON && policy=Période ? days : 0>",
  "enableImmutability": true | false,
  // inclus seulement si modifié par l'utilisateur :
  "objectStorageAccessKey": "<accessKey>",
  "objectStorageSecretKey": "<secretKey>"
}
```

### Endpoint
```
PUT /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/extendedJournal
Body: ZertoLtrBucketEditPayload
```

### Boutons
- Primaire : "Enregistrer" (désactivé si formulaire invalide)
- Secondaire : "Annuler"

### Comportement
- Succès : toast **"Le bucket LTR a été modifié avec succès."** + fermer modale
- Erreur : toast **"Une erreur est survenue lors de la modification du bucket LTR"**

---

## 5. Modale de suppression de bucket

### Titre
"Supprimer le bucket LTR"

### Contenu
- Type destructif (critical)
- Corps : "Souhaitez-vous vraiment supprimer le bucket LTR {repositoryName} ?"
- Bouton primaire (critical) : "Confirmer"
- Bouton secondaire : "Annuler"

### Endpoint
```
DELETE /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/extendedJournal?repositoryId={repositoryId}
```

### Comportement après succès
- Mise à jour **optimiste** du cache : supprimer l'entrée avec le `repositoryId` correspondant sans attendre de refetch
- Toast succès : **"Le bucket LTR est en cours de suppression. Veuillez patienter quelques instants."**
- Fermer modale

### Comportement en erreur
- Toast erreur : **"Une erreur est survenue lors de la suppression du bucket LTR"**

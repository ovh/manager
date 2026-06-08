# Zerto — Onglet VRA (Virtual Replication Appliance)

## Périmètre

L'onglet VRA permet de consulter les VRA d'un datacenter et de redimensionner leur profil CPU/RAM. Il est accessible uniquement quand `zertoStatus.drpType` est non-null (i.e. Zerto est actif). Le redimensionnement est asynchrone : l'état en attente est persisté en localStorage et polled jusqu'à résolution ou timeout.

---

## 1. Données chargées

### Endpoint
```
GET /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/vraResources
```
où `base` vaut `zerto` si `drpType === "ovh"`, ou `zertoSingle` si `drpType === "onPremise"`.

**Réponse** : tableau de `ZertoVrasResource[]` (voir spec-shared)

### Polling
- Actif uniquement si un `pendingState` est présent en localStorage
- Intervalle : **60 secondes**
- Stoppé après **3 erreurs API consécutives** (→ abandon du pending)

---

## 2. Structure de la page

### En-tête
- Titre : **"Dimensionnement VRA"**
- Description : "Vos VRAs sont les machines qui répliquent vos données vers votre site secondaire. Si vous avez configuré un grand nombre de réplications, vous devrez peut-être redimensionner vos VRAs pour terminer les réplications à temps."
  - Le mot "VRA" est rendu dans une balise `<abbr title="Virtual Replication Appliance">`
- Sous-titre : **"VRAs déployées sur votre Managed VMware vSphere"**
- Instruction : "Sélectionnez une ou plusieurs VRAs dans le tableau pour appliquer le profil cible."

### Tableau VRA

**Colonnes :**
| Colonne | Source | Notes |
|---|---|---|
| Nom | `vraName` | |
| VMId | `vmId` | |
| Ressources | `cpu` + `memory` | Affiche `{cpu} vCPU · {memory} GiB RAM` en situation normale |

**Colonne Ressources — états spéciaux :**
- Si la VRA est **en attente de resize** (vmId trouvé dans le pending) :
  - Affiche spinner + "Redimensionnement vers {cpu} vCPU · {memory} GiB RAM" (avec les valeurs cibles)
  - Si `isPendingError` (≥3 erreurs API consécutives) : texte rouge "Une erreur est survenue lors du redimensionnement"
- **Tri** : les VRA sont triées par `vmId` croissant

**Sélection :**
- Checkbox par ligne (sélection multiple)
- La sélection est requise avant de pouvoir choisir un profil cible ou lancer le resize

### Sélecteur de profil cible

- Label : **"Ressources cibles"**
- Dropdown avec les 4 profils :

| Valeur | Label affiché |
|---|---|
| `XS` | `1 vCPU · 2 GiB` |
| `S` | `2 vCPU · 6 GiB` |
| `L` | `4 vCPU · 12 GiB` |
| `XL` | `4 vCPU · 16 GiB` |

- **Désactivé** si aucune VRA n'est sélectionnée
- Tooltip si aucune VRA sélectionnée : "Sélectionnez une ou plusieurs VRAs"

### Bouton lancer le redimensionnement
- Label : **"Démarrer le redimensionnement"**
- **Désactivé** si : aucune VRA sélectionnée OU aucun profil sélectionné
- Tooltip si aucune VRA sélectionnée : "Sélectionnez une ou plusieurs VRAs"
- Au clic : ouvre la modale de confirmation

---

## 3. Modale de confirmation de resize

### Contenu
- Titre : **"Confirmer la reconfiguration VRA"**
- Description : "Les VRAs suivantes seront reconfigurées avec le profil {profile} :" (ex: "XL")
- Liste à puces : nom de chaque VRA sélectionnée
- Avertissement : "L'opération de redimensionnement impactera pendant quelques minutes vos réplications configurées dans vos Virtual Protection Groups (VPGs). Assurez-vous d'avoir suffisamment de ressources dans votre cluster pour pouvoir redimensionner vos VRAs."
- Bouton primaire : **"Confirmer"**
- Bouton secondaire : **"Annuler"**

### API appelée (une fois par VRA sélectionnée, en parallèle)
```
POST /dedicatedCloud/{serviceName}/datacenter/{datacenterId}/disasterRecovery/{base}/vraResources
Body: { resourcesSize: "XS" | "S" | "L" | "XL", vmId: number }
```
où `base` vaut `zerto` ou `zertoSingle` selon `drpType`.

### Comportement après succès
1. Afficher toast info (non-dismissible) : **"La reconfiguration VRA a démarré"**
2. Écrire dans localStorage :
   ```
   clé : vra-pending-resize-{serviceName}-{datacenterId}
   valeur : {
     startedAt: timestamp_ms,
     vras: [{ vmId, cpu, memory }]  // specs du profil cible (ex: XL = { cpu: 4, memory: 16 })
   }
   ```
   - Si un pending existait déjà pour d'autres VMs, les entrées existantes sont conservées (merge), les entrées avec les mêmes `vmId` sont remplacées
3. Vider la sélection et le profil choisi
4. Démarrer le polling (60s)

### Comportement en erreur
- Toast erreur : "Une erreur est survenue lors de la reconfiguration VRA"
- Modale fermée

---

## 4. Résolution du pending (polling)

À chaque fetch de la liste VRA :

**1. Vérification du timeout (10 minutes) :**
Si `Date.now() - pendingState.startedAt > 600 000 ms` :
- Supprimer la clé localStorage
- Supprimer le toast info en cours
- Afficher toast erreur : "La reconfiguration VRA a pris trop de temps. Veuillez rafraîchir la page pour vérifier l'état de vos VRAs."
- Stopper le polling

**2. Comparaison des valeurs actuelles vs cibles :**
Pour chaque VRA en attente, vérifier si `current.cpu === pending.cpu && current.memory === pending.memory` :
- Si **toutes** les VRA attendues sont à leur valeur cible → pending résolu :
  - Supprimer clé localStorage
  - Supprimer toast info
  - Toast succès : **"La reconfiguration VRA s'est terminée avec succès"**
- Si **certaines** seulement → mettre à jour le pending en conservant uniquement les VRA encore en attente

**3. Erreurs consécutives :**
Si l'API échoue 3 fois de suite :
- Supprimer clé localStorage
- Supprimer toast info
- Toast erreur : "Une erreur est survenue lors de la reconfiguration VRA"
- Stopper le polling

---

## 5. Gestion d'erreur de chargement

Si l'API échoue ET qu'il n'y a pas de pending actif :
- Afficher un message d'erreur critique à la place du tableau : **"Une erreur est survenue lors du chargement des VRAs"**

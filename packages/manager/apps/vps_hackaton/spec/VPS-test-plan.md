# Plan de Tests de Recette - Module VPS 2025

**Version** : 1.0  
**Date** : 27 janvier 2026  
**Référence** : [VPS-functional-specification.md](VPS-functional-specification.md)  
**Statut** : À valider

---

## 1. Introduction

### 1.1 Objectif
Ce document décrit les scénarios de test pour la recette fonctionnelle du module VPS du Manager OVHcloud. Il couvre l'ensemble des fonctionnalités décrites dans la spécification fonctionnelle.

### 1.2 Périmètre
- Liste des VPS
- Dashboard VPS
- Actions VPS (reboot, rescue, stop, start, rebuild)
- Gestion des snapshots
- Sauvegarde Veeam
- Backup Storage
- Monitoring
- Migration
- Gestion du service

### 1.3 Environnements de test

| Environnement | URL | Usage |
|---------------|-----|-------|
| Développement | https://manager.dev.ovh.net | Tests unitaires et intégration |
| Staging | https://manager.preprod.ovh.net | Recette fonctionnelle |
| Production | https://manager.ovhcloud.com | Smoke tests post-déploiement |

### 1.4 Prérequis

#### Comptes de test
| Compte | Description | VPS associés |
|--------|-------------|--------------|
| test-vps-admin | Compte avec plusieurs VPS | VPS Elite, Value, Starter |
| test-vps-empty | Compte sans VPS | Aucun |
| test-vps-options | Compte avec toutes les options | VPS avec Snapshot, Veeam, Backup Storage |
| test-vps-migration | Compte avec VPS 2020 | VPS éligible à la migration |

#### VPS de test
| Service Name | Gamme | État initial | Options |
|--------------|-------|--------------|---------|
| vps-elite-test | Elite 2025 | running | Snapshot activé, Veeam activé |
| vps-value-test | Value 2025 | running | Aucune option |
| vps-starter-test | Starter 2025 | stopped | Backup Storage activé |
| vps-migration-test | Essential 2020 | running | Migration disponible |

---

## 2. Tests de la Liste des VPS

### 2.1 Affichage de la liste

#### TC-LIST-001 : Affichage liste avec plusieurs VPS
**Prérequis** : Utilisateur connecté avec compte test-vps-admin  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à /vps | La page de liste s'affiche |
| 2 | Observer le chargement | Un loader s'affiche puis disparaît |
| 3 | Vérifier le contenu | Tous les VPS du compte sont listés |
| 4 | Vérifier les colonnes | Nom, État, Modèle, DC, IP, Expiration visibles |

**Visuel attendu** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS                                                      [Commander un VPS] │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔍 [Rechercher un VPS...                              ]                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Nom          │ État      │ Modèle       │ DC      │ IP            │ Expiration│
│───────────────┼───────────┼──────────────┼─────────┼───────────────┼───────────│
│  vps-elite    │ 🟢 Running│ Elite 2025   │ GRA11   │ 51.210.xx.xx  │ 15/02/26  │
│  vps-value    │ 🟢 Running│ Value 2025   │ SBG5    │ 51.91.xx.xx   │ 22/03/26  │
│  vps-starter  │ 🔴 Stopped│ Starter 2025 │ RBX8    │ 54.37.xx.xx   │ 01/04/26  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                              < 1  2  3 >    Afficher: [10 ▼] par page          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-LIST-002 : Affichage liste vide (onboarding)
**Prérequis** : Utilisateur connecté avec compte test-vps-empty  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à /vps | La page d'onboarding s'affiche |
| 2 | Vérifier le contenu | Message "Aucun VPS" avec illustration |
| 3 | Vérifier le CTA | Bouton "Commander un VPS" présent |
| 4 | Cliquer sur le CTA | Redirection vers page de commande |

**Visuel attendu** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS                                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                            ┌─────────────────┐                                  │
│                            │    🖥️  📦       │                                  │
│                            │   Illustration  │                                  │
│                            │      VPS        │                                  │
│                            └─────────────────┘                                  │
│                                                                                 │
│                        Vous n'avez pas encore de VPS                            │
│                                                                                 │
│              Découvrez nos offres VPS et déployez votre premier                 │
│                      serveur virtuel en quelques clics.                         │
│                                                                                 │
│                        ┌─────────────────────────┐                              │
│                        │  Commander un VPS  →    │                              │
│                        └─────────────────────────┘                              │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-LIST-003 : Indicateurs d'état visuels
**Prérequis** : VPS dans différents états disponibles  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer VPS "running" | Badge vert affiché |
| 2 | Observer VPS "stopped" | Badge rouge affiché |
| 3 | Observer VPS "rebooting" | Badge orange affiché |
| 4 | Observer VPS "maintenance" | Badge rouge affiché |

**Visuels des badges d'état** :
```
┌──────────────────────────────────────────────────────────────────┐
│  ÉTATS NORMAUX                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ 🟢 Running     │  │ 🔴 Stopped     │  │ 🟠 Rebooting   │     │
│  │ (vert #00D68F) │  │ (rouge #FF4D4D)│  │ (orange #FF9F40│     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
├──────────────────────────────────────────────────────────────────┤
│  ÉTATS SPÉCIAUX                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ 🟣 Rescued     │  │ 🔴 Maintenance │  │ 🟠 Installing  │     │
│  │ (violet)       │  │ (rouge)        │  │ (orange)       │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
├──────────────────────────────────────────────────────────────────┤
│  ÉTATS TRANSITOIRES (avec spinner)                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ ◌ Starting...  │  │ ◌ Stopping...  │  │ ◌ Backuping... │     │
│  │ (gris + anim)  │  │ (gris + anim)  │  │ (gris + anim)  │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
└──────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-LIST-004 : Tri de la liste
**Prérequis** : Compte avec plusieurs VPS  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur en-tête "Nom" | Liste triée par nom (A→Z) |
| 2 | Cliquer à nouveau sur "Nom" | Liste triée par nom (Z→A) |
| 3 | Cliquer sur "État" | Liste triée par état |
| 4 | Cliquer sur "Expiration" | Liste triée par date d'expiration |

**Statut** : ⬜ Non testé

---

#### TC-LIST-005 : Filtrage par recherche
**Prérequis** : Compte avec plusieurs VPS  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Saisir "elite" dans la recherche | Seuls les VPS contenant "elite" affichés |
| 2 | Effacer la recherche | Tous les VPS affichés à nouveau |
| 3 | Saisir un texte sans correspondance | Message "Aucun résultat" affiché |

**Statut** : ⬜ Non testé

---

#### TC-LIST-006 : Pagination
**Prérequis** : Compte avec plus de 10 VPS  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Vérifier pagination initiale | 10 éléments par page par défaut |
| 2 | Cliquer sur page 2 | Les éléments 11-20 s'affichent |
| 3 | Changer pour 25 par page | 25 éléments affichés |
| 4 | Aller à la dernière page | Derniers éléments affichés |

**Statut** : ⬜ Non testé

---

#### TC-LIST-007 : Navigation vers dashboard
**Prérequis** : Compte avec au moins un VPS  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur un VPS dans la liste | Navigation vers /vps/{serviceName}/dashboard |
| 2 | Vérifier l'URL | URL contient le bon serviceName |
| 3 | Vérifier le breadcrumb | "VPS > {nom du VPS}" affiché |

**Statut** : ⬜ Non testé

---

## 3. Tests du Dashboard VPS

### 3.1 Tuile Informations Générales

#### TC-DASH-001 : Affichage informations générales
**Prérequis** : Accès au dashboard du VPS vps-elite-test  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder au dashboard | La tuile Informations s'affiche |
| 2 | Vérifier le nom | Nom d'affichage correct |
| 3 | Vérifier le modèle | "Elite 2025" affiché |
| 4 | Vérifier les specs | vCores, RAM, Stockage corrects |
| 5 | Vérifier le datacenter | Localisation correcte |
| 6 | Vérifier l'OS | Distribution installée affichée |

**Visuel attendu - Dashboard complet** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS > vps-elite-test                                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│  ┌─── Actions rapides ───────────────────────────────────────────────────────┐  │
│  │ [Redémarrer] [Mode Rescue] [Arrêter] [Console KVM] [Réinitialiser MDP]    │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─ Informations ──────────────────┐  ┌─ Configuration ─────────────────────┐  │
│  │                                 │  │                                     │  │
│  │  État     : 🟢 Running          │  │  Nom d'affichage : Mon serveur web  │  │
│  │  Modèle   : Elite 2025          │  │  Monitoring SLA  : ✓ Activé         │  │
│  │  vCores   : 8                   │  │                                     │  │
│  │  RAM      : 32 Go               │  │  [Modifier]                         │  │
│  │  Stockage : 640 Go NVMe         │  │                                     │  │
│  │  DC       : Gravelines (GRA11)  │  └─────────────────────────────────────┘  │
│  │  OS       : Ubuntu 24.04 LTS    │                                           │
│  │                                 │  ┌─ Réseau ────────────────────────────┐  │
│  └─────────────────────────────────┘  │                                     │  │
│                                       │  IPv4 : 51.210.xx.xx       [📋]     │  │
│  ┌─ Options ───────────────────────┐  │  IPv6 : 2001:41d0:xxx::1   [📋]     │  │
│  │                                 │  │  Reverse : vps-elite.example.com    │  │
│  │  Snapshot      : ✓ 25/01/2026   │  │                                     │  │
│  │  Veeam         : ✓ Activé       │  │  [Modifier reverse]                 │  │
│  │  Backup Storage: ✓ 500 Go       │  │                                     │  │
│  │                                 │  └─────────────────────────────────────┘  │
│  │  [Gérer les options]            │                                           │
│  └─────────────────────────────────┘                                           │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-DASH-002 : État du VPS en temps réel
**Prérequis** : VPS en état "running"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer l'état initial | Badge vert "Running" |
| 2 | Déclencher un reboot (externe) | L'état passe à "Rebooting" (orange) |
| 3 | Attendre la fin du reboot | L'état revient à "Running" (vert) |

**Statut** : ⬜ Non testé

---

### 3.2 Tuile Configuration

#### TC-DASH-010 : Modification du nom d'affichage
**Prérequis** : Accès au dashboard d'un VPS  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Modifier" dans Configuration | Modale d'édition s'ouvre |
| 2 | Modifier le nom d'affichage | Champ éditable |
| 3 | Saisir un nom > 50 caractères | Message d'erreur de validation |
| 4 | Saisir un nom valide et confirmer | Nom mis à jour, toast de succès |
| 5 | Rafraîchir la page | Nouveau nom persisté |

**Statut** : ⬜ Non testé

---

#### TC-DASH-011 : Modification du monitoring SLA
**Prérequis** : Accès au dashboard d'un VPS  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Ouvrir la modale de configuration | Option monitoring visible |
| 2 | Activer/désactiver le monitoring | Toggle fonctionnel |
| 3 | Sauvegarder | Modification enregistrée |

**Statut** : ⬜ Non testé

---

### 3.3 Tuile Réseau

#### TC-DASH-020 : Affichage informations réseau
**Prérequis** : VPS avec IPv4 et IPv6  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer la tuile Réseau | IPv4 principale affichée |
| 2 | Cliquer sur "Copier" à côté de l'IP | IP copiée dans le presse-papier |
| 3 | Vérifier IPv6 | IPv6 affichée si disponible |
| 4 | Vérifier le reverse DNS | Reverse actuel affiché |

**Statut** : ⬜ Non testé

---

#### TC-DASH-021 : Modification du reverse DNS
**Prérequis** : VPS avec IPv4  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur modifier le reverse | Modale d'édition s'ouvre |
| 2 | Saisir un reverse invalide | Message d'erreur de format |
| 3 | Saisir un reverse valide | Champ accepté |
| 4 | Confirmer | Reverse mis à jour |

**Statut** : ⬜ Non testé

---

### 3.4 Tuile Options

#### TC-DASH-030 : Affichage état des options
**Prérequis** : VPS vps-elite-test (avec options)  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer section Snapshot | "Activé" avec date du snapshot |
| 2 | Observer section Veeam | "Activé" avec info backup |
| 3 | Observer section Backup Storage | État correct affiché |

**Statut** : ⬜ Non testé

---

#### TC-DASH-031 : Options non souscrites
**Prérequis** : VPS vps-value-test (sans options)  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer section Snapshot | "Non souscrit" + bouton Commander |
| 2 | Observer section Veeam | "Non souscrit" + bouton Commander |
| 3 | Cliquer sur "Commander" | Redirection vers page de commande |

**Statut** : ⬜ Non testé

---

### 3.5 Bandeau de migration

#### TC-DASH-040 : Affichage bandeau migration
**Prérequis** : VPS vps-migration-test (2020, éligible)  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder au dashboard | Bandeau migration visible en haut |
| 2 | Vérifier le message | Information sur migration 2025 |
| 3 | Cliquer sur "Migrer" | Redirection vers flux de migration |

**Statut** : ⬜ Non testé

---

#### TC-DASH-041 : Absence bandeau si VPS 2025
**Prérequis** : VPS vps-elite-test (2025)  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder au dashboard | Aucun bandeau de migration |

**Statut** : ⬜ Non testé

---

## 4. Tests des Actions VPS

### 4.1 Redémarrage

#### TC-ACT-001 : Redémarrage réussi
**Prérequis** : VPS en état "running", aucune tâche en cours  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Redémarrer" | Modale de confirmation s'ouvre |
| 2 | Lire le message | Avertissement sur l'interruption de service |
| 3 | Cliquer sur "Confirmer" | Modale se ferme |
| 4 | Observer le feedback | Toast "Redémarrage en cours" |
| 5 | Observer l'état | État passe à "Rebooting" |
| 6 | Attendre (~1-2 min) | État revient à "Running" |

**Visuel attendu - Modale de confirmation** :
```
┌─────────────────────────────────────────────────────────┐
│                                                    [X]  │
│           ⚠️  Redémarrer le VPS                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  Êtes-vous sûr de vouloir redémarrer ce VPS ?          │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ⚠ Cette action va interrompre temporairement    │  │
│  │    tous les services hébergés sur ce VPS.        │  │
│  │                                                   │  │
│  │    Durée estimée : 1 à 2 minutes                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  VPS concerné : vps-elite-test                          │
│                                                         │
│           [Annuler]        [Confirmer le redémarrage]   │
│                                    (bouton bleu)        │
└─────────────────────────────────────────────────────────┘
```

**Visuel attendu - Toast de succès** :
```
┌────────────────────────────────────────────────┐
│  ✓  Redémarrage en cours                       │
│     Le VPS redémarre, veuillez patienter...    │
└────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-ACT-002 : Redémarrage avec tâche en cours
**Prérequis** : VPS avec une tâche en cours  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer le bouton "Redémarrer" | Bouton désactivé (grisé) |
| 2 | Survoler le bouton | Tooltip "Une opération est en cours" |

**Statut** : ⬜ Non testé

---

#### TC-ACT-003 : Annulation du redémarrage
**Prérequis** : VPS en état "running"  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Redémarrer" | Modale s'ouvre |
| 2 | Cliquer sur "Annuler" | Modale se ferme |
| 3 | Vérifier l'état | VPS toujours "Running" |

**Statut** : ⬜ Non testé

---

### 4.2 Mode Rescue

#### TC-ACT-010 : Activation mode rescue
**Prérequis** : VPS en état "running"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Mode Rescue" | Modale d'activation s'ouvre |
| 2 | Lire les informations | Explication du mode rescue |
| 3 | Confirmer l'activation | Modale de progression |
| 4 | Observer le processus | État passe à "Rebooting" |
| 5 | Attendre la fin | État passe à "Rescued" |
| 6 | Vérifier l'email | Credentials reçus par email |

**Visuel attendu - Modale d'activation rescue** :
```
┌─────────────────────────────────────────────────────────┐
│                                                    [X]  │
│           🛟  Activer le mode rescue                    │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  Le mode rescue permet de démarrer votre VPS sur       │
│  un système d'exploitation temporaire pour effectuer   │
│  des opérations de maintenance ou de récupération.     │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ℹ️  Informations importantes :                   │  │
│  │                                                   │  │
│  │  • Le VPS redémarrera sur un système Linux       │  │
│  │  • Vos disques seront montés en /mnt             │  │
│  │  • Les identifiants seront envoyés par email     │  │
│  │  • Le mode rescue reste actif jusqu'à ce que     │  │
│  │    vous le désactiviez                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│           [Annuler]        [Activer le mode rescue]     │
│                               (bouton orange)           │
└─────────────────────────────────────────────────────────┘
```

**Visuel attendu - Dashboard en mode rescue** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ⚠️ VOTRE VPS EST EN MODE RESCUE                                                │
│  ────────────────────────────────────────────────────────────────────────────   │
│  Vos identifiants de connexion ont été envoyés par email.                       │
│  Vos disques sont montés dans /mnt. N'oubliez pas de quitter le mode rescue     │
│  une fois vos opérations terminées.                                             │
│                                                                 [Quitter rescue]│
└─────────────────────────────────────────────────────────────────────────────────┘
│                                                                                 │
│  État : 🟣 Rescued                                                              │
```

**Statut** : ⬜ Non testé

---

#### TC-ACT-011 : Sortie du mode rescue
**Prérequis** : VPS en état "rescued"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer le dashboard | Message "VPS en mode rescue" |
| 2 | Cliquer sur "Quitter le mode rescue" | Modale de confirmation |
| 3 | Confirmer | VPS redémarre en mode normal |
| 4 | Attendre | État revient à "Running" |

**Statut** : ⬜ Non testé

---

### 4.3 Arrêt / Démarrage

#### TC-ACT-020 : Arrêt du VPS
**Prérequis** : VPS en état "running"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Arrêter" | Modale d'avertissement s'ouvre |
| 2 | Lire le message | Avertissement perte de service |
| 3 | Confirmer | VPS s'arrête |
| 4 | Observer l'état | Passe à "Stopping" puis "Stopped" |
| 5 | Vérifier les boutons | "Démarrer" maintenant visible |

**Statut** : ⬜ Non testé

---

#### TC-ACT-021 : Démarrage du VPS
**Prérequis** : VPS en état "stopped"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Démarrer" | Action immédiate (pas de modale) |
| 2 | Observer le feedback | Toast "Démarrage en cours" |
| 3 | Observer l'état | Passe à "Running" |

**Statut** : ⬜ Non testé

---

### 4.4 Console KVM

#### TC-ACT-030 : Ouverture console KVM
**Prérequis** : VPS en état "running"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Console KVM" | Modale KVM s'ouvre |
| 2 | Observer le contenu | Console VNC chargée dans iframe |
| 3 | Interagir avec la console | Clavier/souris fonctionnels |
| 4 | Fermer la modale | Console se ferme proprement |

**Visuel attendu - Console KVM** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                            [X]  │
│  🖥️  Console KVM - vps-elite-test                                               │
│  ───────────────────────────────────────────────────────────────────────────    │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐    │
│  │                                                                         │    │
│  │  Ubuntu 24.04 LTS vps-elite tty1                                        │    │
│  │                                                                         │    │
│  │  vps-elite login: _                                                     │    │
│  │                                                                         │    │
│  │                                                                         │    │
│  │                      [ Console VNC ]                                    │    │
│  │                                                                         │    │
│  │                                                                         │    │
│  │                                                                         │    │
│  │                                                                         │    │
│  └─────────────────────────────────────────────────────────────────────────┘    │
│                                                                                 │
│  ┌──────────────────────────────────────────────────────────────────────────┐   │
│  │ [📋 Copier l'URL]  [🔄 Rafraîchir]  [⛶ Plein écran]  [Ctrl+Alt+Suppr]   │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ℹ️ Cliquez dans la console pour capturer clavier/souris. Échap pour relâcher. │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-ACT-031 : Copie URL KVM
**Prérequis** : VPS en état "running"  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Ouvrir la modale KVM | Options visibles |
| 2 | Cliquer sur "Copier l'URL" | URL copiée dans presse-papier |
| 3 | Ouvrir l'URL dans un nouvel onglet | Console accessible |

**Statut** : ⬜ Non testé

---

### 4.5 Réinitialisation mot de passe

#### TC-ACT-040 : Réinitialisation mot de passe root
**Prérequis** : VPS en état "running"  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Réinitialiser mot de passe" | Modale de confirmation |
| 2 | Lire l'avertissement | Info sur envoi par email |
| 3 | Confirmer | Tâche lancée |
| 4 | Observer le feedback | Toast "Mot de passe en cours de génération" |
| 5 | Vérifier l'email | Nouveau mot de passe reçu |

**Statut** : ⬜ Non testé

---

## 5. Tests de Réinstallation (Rebuild)

### 5.1 Sélection d'image

#### TC-REBUILD-001 : Liste des images disponibles
**Prérequis** : VPS gamme 2025  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Réinstaller" | Modale de sélection d'image |
| 2 | Observer les catégories | Linux, Windows, Applications |
| 3 | Parcourir les images | Nom, version, description visibles |
| 4 | Utiliser le filtre | Filtrage par texte fonctionnel |

**Visuel attendu - Wizard de réinstallation (Étape 1)** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                            [X]  │
│  🔄  Réinstaller le VPS                                                         │
│  ───────────────────────────────────────────────────────────────────────────    │
│                                                                                 │
│  ●───────────○───────────○───────────○                                          │
│  1. Image    2. Clé SSH  3. Options  4. Confirmation                            │
│                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  🔍 [Rechercher une image...                                              ]     │
│                                                                                 │
│  ┌─ Linux ──────────────────────────────────────────────────────────────────┐   │
│  │                                                                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │   │
│  │  │   🐧         │  │   🐧         │  │   🐧         │  │   🐧         │ │   │
│  │  │   Ubuntu     │  │   Debian     │  │   AlmaLinux  │  │   Rocky      │ │   │
│  │  │   24.04 LTS  │  │   12         │  │   9          │  │   Linux 9    │ │   │
│  │  │              │  │              │  │              │  │              │ │   │
│  │  │ ○ Sélect.    │  │ ○ Sélect.    │  │ ○ Sélect.    │  │ ○ Sélect.    │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘ │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│  ┌─ Windows ────────────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────┐  ┌──────────────┐                                      │   │
│  │  │   🪟         │  │   🪟         │                                      │   │
│  │  │   Windows    │  │   Windows    │                                      │   │
│  │  │   Server 22  │  │   Server 19  │                                      │   │
│  │  │ ○ Sélect.    │  │ ○ Sélect.    │                                      │   │
│  │  └──────────────┘  └──────────────┘                                      │   │
│  └──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│                                               [Annuler]    [Suivant →]          │
│                                                            (désactivé si        │
│                                                            aucune sélection)    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-002 : Sélection d'une image Linux
**Prérequis** : Modale de réinstallation ouverte  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur une image Linux (ex: Ubuntu) | Image sélectionnée (highlight) |
| 2 | Cliquer sur "Suivant" | Passage à l'étape clé SSH |

**Statut** : ⬜ Non testé

---

### 5.2 Configuration clé SSH

#### TC-REBUILD-010 : Sélection clé SSH existante
**Prérequis** : Compte avec clés SSH enregistrées  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer la liste des clés | Clés de /me/sshKey affichées |
| 2 | Sélectionner une clé | Clé cochée |
| 3 | Passer à l'étape suivante | Clé mémorisée |

**Visuel attendu - Wizard de réinstallation (Étape 2)** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                            [X]  │
│  🔄  Réinstaller le VPS                                                         │
│  ───────────────────────────────────────────────────────────────────────────    │
│                                                                                 │
│  ✓───────────●───────────○───────────○                                          │
│  1. Image    2. Clé SSH  3. Options  4. Confirmation                            │
│                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────  │
│                                                                                 │
│  🔑 Configurer l'authentification SSH                                           │
│                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │  ○  Utiliser une clé SSH existante                                        │  │
│  │     ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │     │  ☑ ma-cle-principale     ssh-rsa AAAAB3...     Ajoutée le 15/01 │   │  │
│  │     │  ☐ cle-backup            ssh-ed25519 AAAA...   Ajoutée le 03/12 │   │  │
│  │     │  ☐ cle-dev               ssh-rsa AAAAB3...     Ajoutée le 20/11 │   │  │
│  │     └─────────────────────────────────────────────────────────────────┘   │  │
│  ├───────────────────────────────────────────────────────────────────────────┤  │
│  │  ○  Saisir une nouvelle clé SSH publique                                  │  │
│  │     ┌─────────────────────────────────────────────────────────────────┐   │  │
│  │     │  ssh-rsa AAAAB3NzaC1yc2EAAA...                                  │   │  │
│  │     └─────────────────────────────────────────────────────────────────┘   │  │
│  ├───────────────────────────────────────────────────────────────────────────┤  │
│  │  ○  Pas de clé SSH (authentification par mot de passe uniquement)         │  │
│  │     ⚠️ Non recommandé pour des raisons de sécurité                        │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│                                    [← Retour]    [Annuler]    [Suivant →]       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-011 : Saisie clé SSH manuelle
**Prérequis** : Étape clé SSH  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Choisir "Saisir une clé" | Champ texte affiché |
| 2 | Saisir une clé invalide | Message d'erreur format |
| 3 | Saisir une clé valide (ssh-rsa...) | Validation OK |

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-012 : Sans clé SSH
**Prérequis** : Étape clé SSH  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Choisir "Pas de clé SSH" | Avertissement affiché |
| 2 | Option "Ne pas envoyer mot de passe" | Option désactivée/grisée |

**Statut** : ⬜ Non testé

---

### 5.3 Options avancées

#### TC-REBUILD-020 : Option ne pas envoyer mot de passe
**Prérequis** : Clé SSH sélectionnée  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer l'option | Checkbox disponible |
| 2 | Cocher l'option | Option activée |
| 3 | Info bulle | Explication de l'option |

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-021 : Option installer RTM
**Prérequis** : Étape options avancées  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer l'option RTM | Checkbox disponible |
| 2 | Cocher l'option | Option activée |

**Statut** : ⬜ Non testé

---

### 5.4 Confirmation et exécution

#### TC-REBUILD-030 : Récapitulatif avant confirmation
**Prérequis** : Toutes les étapes complétées  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à l'écran de confirmation | Récapitulatif affiché |
| 2 | Vérifier les infos | Image, clé SSH, options listées |
| 3 | Lire les avertissements | Messages de perte de données |
| 4 | Observer la checkbox | Confirmation obligatoire |

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-031 : Exécution rebuild réussie
**Prérequis** : Récapitulatif validé  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cocher la confirmation | Bouton "Réinstaller" activé |
| 2 | Cliquer sur "Réinstaller" | Modale de progression |
| 3 | Observer l'état VPS | Passe à "Installing" |
| 4 | Attendre (5-15 min) | Progression affichée |
| 5 | Fin de l'installation | Toast de succès |
| 6 | Vérifier l'état | VPS en "Running" avec nouvelle image |

**Statut** : ⬜ Non testé

---

#### TC-REBUILD-032 : Rebuild avec erreur
**Prérequis** : Simuler une erreur API  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Lancer un rebuild | Erreur API simulée |
| 2 | Observer le feedback | Message d'erreur clair |
| 3 | Vérifier les options | Bouton "Réessayer" disponible |

**Statut** : ⬜ Non testé

---

## 6. Tests des Snapshots

### 6.1 Affichage

#### TC-SNAP-001 : Affichage snapshot existant
**Prérequis** : VPS avec snapshot créé  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer la tuile Options | Section Snapshot visible |
| 2 | Vérifier les infos | Date de création, description |
| 3 | Vérifier les actions | Restaurer, Supprimer, Télécharger |

**Visuel attendu - Section Snapshot avec snapshot existant** :
```
┌─ Snapshot ───────────────────────────────────────────────────────────────┐
│                                                                         │
│  ✓ Snapshot actif                                                       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📸  Snapshot du 25/01/2026 à 14:32                                │    │
│  │                                                                   │    │
│  │  Description : Avant mise à jour système                          │    │
│  │  Taille      : 12.4 Go                                           │    │
│  │                                                                   │    │
│  │  ┌───────────────┐  ┌───────────────┐  ┌─────────────────┐        │    │
│  │  │ ↻ Restaurer   │  │ ⬇ Télécharger│  │ 🗑 Supprimer     │        │    │
│  │  └───────────────┘  └───────────────┘  └─────────────────┘        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ℹ️ Un seul snapshot peut être conservé à la fois.                      │
│     Supprimez-le pour en créer un nouveau.                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-SNAP-002 : Affichage sans snapshot
**Prérequis** : VPS avec option snapshot mais sans snapshot  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer la section | "Aucun snapshot" affiché |
| 2 | Vérifier le bouton | "Créer un snapshot" disponible |

**Statut** : ⬜ Non testé

---

### 6.2 Création

#### TC-SNAP-010 : Création snapshot réussie
**Prérequis** : VPS avec option snapshot, sans snapshot existant  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Créer un snapshot" | Modale s'ouvre |
| 2 | Saisir une description (optionnel) | Champ texte |
| 3 | Cliquer sur "Créer" | Tâche lancée |
| 4 | Observer la progression | État "Backuping" sur le VPS |
| 5 | Attendre la fin | Toast de succès |
| 6 | Vérifier la tuile | Snapshot apparaît avec infos |

**Visuel attendu - Modale de création de snapshot** :
```
┌─────────────────────────────────────────────────────────┐
│                                                    [X]  │
│           📸  Créer un snapshot                         │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  Un snapshot permet de sauvegarder l'état actuel       │
│  de votre VPS pour le restaurer ultérieurement.        │
│                                                         │
│  Description (optionnelle) :                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Avant mise à jour système                          │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ℹ️ La création peut prendre plusieurs minutes.    │  │
│  │     Votre VPS restera accessible pendant            │  │
│  │     l'opération.                                    │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│           [Annuler]        [Créer le snapshot]          │
│                             (bouton bleu)               │
└─────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-SNAP-011 : Création impossible si snapshot existe
**Prérequis** : VPS avec snapshot existant  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer le bouton "Créer" | Bouton désactivé ou absent |
| 2 | Message explicatif | "Supprimez le snapshot existant" |

**Statut** : ⬜ Non testé

---

### 6.3 Restauration

#### TC-SNAP-020 : Restauration snapshot
**Prérequis** : VPS avec snapshot existant  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Restaurer" | Modale d'avertissement |
| 2 | Lire le message | Avertissement perte données |
| 3 | Cocher la confirmation | Obligatoire |
| 4 | Cliquer sur "Restaurer" | Tâche lancée |
| 5 | Observer l'état | VPS en restauration |
| 6 | Attendre la fin | VPS restauré à l'état du snapshot |

**Visuel attendu - Modale de restauration (avertissement critique)** :
```
┌─────────────────────────────────────────────────────────┐
│                                                    [X]  │
│           🚨  Restaurer le snapshot                      │
│  ───────────────────────────────────────────────────    │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  ⚠️  ATTENTION : ACTION DESTRUCTIVE                  │  │
│  │                                                   │  │
│  │  Cette action va REMPLACER l'état actuel de       │  │
│  │  votre VPS par celui du snapshot.                 │  │
│  │                                                   │  │
│  │  • Toutes les données modifiées depuis le         │  │
│  │    25/01/2026 seront PERDUES                      │  │
│  │  • Le VPS redémarrera automatiquement             │  │
│  │  • Durée estimée : 5 à 15 minutes                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  ☐  Je comprends que cette action est irréversible     │
│     et que mes données actuelles seront perdues.        │
│                                                         │
│           [Annuler]        [Restaurer]                  │
│                            (bouton rouge,               │
│                             désactivé si non coché)     │
└─────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

### 6.4 Suppression

#### TC-SNAP-030 : Suppression snapshot
**Prérequis** : VPS avec snapshot existant  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Supprimer" | Modale de confirmation |
| 2 | Confirmer | Snapshot supprimé |
| 3 | Vérifier la tuile | "Aucun snapshot" affiché |
| 4 | Bouton "Créer" | Maintenant disponible |

**Statut** : ⬜ Non testé

---

### 6.5 Téléchargement

#### TC-SNAP-040 : Téléchargement snapshot
**Prérequis** : VPS avec snapshot existant  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Télécharger" | Génération URL |
| 2 | Observer le résultat | URL temporaire affichée |
| 3 | Info validité | "Valide 24h" indiqué |
| 4 | Cliquer sur l'URL | Téléchargement démarre |

**Statut** : ⬜ Non testé

---

## 7. Tests Veeam

### 7.1 Affichage

#### TC-VEEAM-001 : Affichage état Veeam activé
**Prérequis** : VPS avec option Veeam activée  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer la section Veeam | "Activé" affiché |
| 2 | Vérifier l'heure de backup | Heure programmée visible |
| 3 | Lien vers gestion | "Gérer" cliquable |

**Statut** : ⬜ Non testé

---

### 7.2 Points de restauration

#### TC-VEEAM-010 : Liste points de restauration
**Prérequis** : VPS avec backups Veeam  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à la page Veeam | Liste des points affichée |
| 2 | Vérifier les infos | Date/heure de chaque point |
| 3 | Vérifier les états | "Available", "Restored" |

**Statut** : ⬜ Non testé

---

#### TC-VEEAM-011 : Restauration fichiers (mount)
**Prérequis** : Point de restauration disponible  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Sélectionner un point | Actions disponibles |
| 2 | Choisir "Restaurer fichiers" | Modale de confirmation |
| 3 | Confirmer | Backup monté |
| 4 | Vérifier les accès | URLs NFS/SMB fournies |

**Statut** : ⬜ Non testé

---

#### TC-VEEAM-012 : Restauration complète
**Prérequis** : Point de restauration disponible  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Choisir "Restauration complète" | Modale d'avertissement |
| 2 | Lire l'avertissement | Perte données actuelles |
| 3 | Confirmer | Restauration lancée |
| 4 | Attendre | VPS restauré |

**Statut** : ⬜ Non testé

---

### 7.3 Configuration

#### TC-VEEAM-020 : Modification horaire backup
**Prérequis** : Option Veeam activée  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur modifier l'horaire | Time picker affiché |
| 2 | Sélectionner nouvelle heure | Heure sélectionnée |
| 3 | Sauvegarder | Horaire mis à jour |

**Statut** : ⬜ Non testé

---

## 8. Tests Backup Storage

### 8.1 Affichage

#### TC-BACKUP-001 : Informations Backup Storage
**Prérequis** : VPS avec Backup Storage activé  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à la page Backup Storage | Informations affichées |
| 2 | Vérifier quota | Espace total/utilisé |
| 3 | Vérifier URL FTP | Adresse serveur FTP |
| 4 | Vérifier identifiants | Login visible |

**Statut** : ⬜ Non testé

---

### 8.2 Mot de passe

#### TC-BACKUP-010 : Réinitialisation mot de passe FTP
**Prérequis** : Backup Storage activé  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer "Réinitialiser mot de passe" | Modale confirmation |
| 2 | Confirmer | Nouveau mot de passe généré |
| 3 | Affichage ou email | Mot de passe communiqué |

**Statut** : ⬜ Non testé

---

### 8.3 ACL

#### TC-BACKUP-020 : Ajout ACL
**Prérequis** : Backup Storage activé  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer "Ajouter une ACL" | Modale s'ouvre |
| 2 | Saisir IP invalide | Erreur de validation |
| 3 | Saisir IP/CIDR valide | Validation OK |
| 4 | Sélectionner protocoles | FTP, NFS, CIFS checkboxes |
| 5 | Confirmer | ACL ajoutée à la liste |

**Statut** : ⬜ Non testé

---

#### TC-BACKUP-021 : Suppression ACL
**Prérequis** : ACL existante  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer supprimer sur une ACL | Modale confirmation |
| 2 | Confirmer | ACL supprimée |

**Statut** : ⬜ Non testé

---

## 9. Tests Monitoring

### 9.1 Graphiques

#### TC-MON-001 : Affichage graphique CPU
**Prérequis** : VPS en fonctionnement  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à la page Monitoring | Graphiques affichés |
| 2 | Observer graphique CPU | Courbe d'utilisation visible |
| 3 | Survoler la courbe | Tooltip avec valeur précise |
| 4 | Vérifier l'échelle | 0-100% |

**Visuel attendu - Page Monitoring** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS > vps-elite-test > Monitoring                                             │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Période :  [24h] [7 jours] [30 jours] [1 an]                       🔄 Rafraîchir │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│  ┌─ CPU ─────────────────────────────────────────────────────────────────────┐  │
│  │  100%│                                                                   │  │
│  │      │                                                                   │  │
│  │   75%│          ╱╲                                                     │  │
│  │      │         ╱  ╲                              ┌────────────────┐    │  │
│  │   50%│    ╱╲  ╱    ╲╱╲                        │ 14:32 - 45.2%  │    │  │
│  │      │   ╱  ╲╱       ╲  ╲                       └────────────────┘    │  │
│  │   25%│  ╱                 ╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲╱╲                        │  │
│  │      │╱╲                                         ╲                       │  │
│  │    0%└─────────────────────────────────────────────────────────────│  │
│  │        00:00    04:00    08:00    12:00    16:00    20:00    Maintenant│  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ Mémoire (32 Go) ─────────────────────────────────────────────────────────┐  │
│  │   32Go│                                                                   │  │
│  │      │━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━│  │
│  │   24Go│                                                                   │  │
│  │      │─────────────────────────────────────────────────────────────│  │
│  │   16Go│█████████████████████████████████████████████████████████████│  │
│  │      │█████████████████████████████████████████████████████████████│  │
│  │    8Go│█████████████████████████████████████████████████████████████│  │
│  │      │█████████████████████████████████████████████████████████████│  │
│  │    0Go└─────────────────────────────────────────────────────────────│  │
│  │        00:00    04:00    08:00    12:00    16:00    20:00    Maintenant│  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
│  ┌─ Réseau ───────────────────────────────────────────────────────────────┐  │
│  │         Légende :  ━━━ Entrant (rx)    - - - Sortant (tx)              │  │
│  │  50Mb/s│                                                                   │  │
│  │       │    ━━━━━━━━━━━                                                   │  │
│  │  25Mb/s│   ━          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │       │━━━- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - │  │
│  │   0   └─────────────────────────────────────────────────────────────│  │
│  │        00:00    04:00    08:00    12:00    16:00    20:00    Maintenant│  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-MON-002 : Affichage graphique mémoire
**Prérequis** : VPS en fonctionnement  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer graphique mémoire | Courbe visible |
| 2 | Vérifier les valeurs | En Go ou Mo |
| 3 | Maximum affiché | Correspond à la RAM du VPS |

**Statut** : ⬜ Non testé

---

#### TC-MON-003 : Affichage graphique réseau
**Prérequis** : VPS avec trafic  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Observer graphique réseau | Trafic in/out visible |
| 2 | Légende | "Entrant" et "Sortant" différenciés |

**Statut** : ⬜ Non testé

---

### 9.2 Périodes

#### TC-MON-010 : Changement de période
**Prérequis** : Page monitoring ouverte  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Sélectionner "Dernières 24h" | Graphiques mis à jour |
| 2 | Sélectionner "Dernière semaine" | Échelle de temps ajustée |
| 3 | Sélectionner "Dernier mois" | Plus de points de données |
| 4 | Sélectionner "Dernière année" | Vue annuelle |

**Statut** : ⬜ Non testé

---

## 10. Tests Migration

### 10.1 Éligibilité

#### TC-MIG-001 : VPS éligible à la migration
**Prérequis** : VPS 2020 éligible  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder au dashboard | Bandeau migration visible |
| 2 | Cliquer sur "Migrer" | Page migration s'ouvre |
| 3 | Vérifier les infos | Plan actuel vs nouveau plan |

**Visuel attendu - Bandeau de migration** :
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  🚀 MIGRATION DISPONIBLE                                   [En savoir plus] [X] │
│  ─────────────────────────────────────────────────────────────────────────────  │
│  Votre VPS est éligible à la nouvelle gamme 2025 !                               │
│  Profitez de meilleures performances au même prix.                [Migrer →]   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS > vps-essential-test > Migration                                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                       Migrez vers la gamme VPS 2025                             │
│                                                                                 │
│  ┌─────────────────────────────────┐    ┌─────────────────────────────────┐  │
│  │         ACTUEL                   │    │         NOUVEAU                  │  │
│  │                                 │    │                                  │  │
│  │    Essential 2020               │ →  │    Essential 2025                │  │
│  │    2 vCores                     │    │    2 vCores (+20% perf)          │  │
│  │    4 Go RAM                     │    │    4 Go RAM DDR5                 │  │
│  │    80 Go SSD                    │    │    80 Go NVMe                    │  │
│  │                                 │    │                                  │  │
│  │    9,99 €/mois                  │    │    9,99 €/mois                   │  │
│  └─────────────────────────────────┘    └─────────────────────────────────┘  │
│                                                                                 │
│  ℹ️ La migration conserve vos données et votre adresse IP.                     │
│     Temps d'indisponibilité estimé : 15-30 minutes.                             │
│                                                                                 │
│                          [Planifier la migration]                               │
│                              (bouton bleu)                                      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

**Statut** : ⬜ Non testé

---

#### TC-MIG-002 : VPS non éligible
**Prérequis** : VPS 2025 ou non éligible  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder au dashboard | Pas de bandeau migration |
| 2 | Accéder directement à /migration | Message "Non éligible" |

**Statut** : ⬜ Non testé

---

### 10.2 Demande de migration

#### TC-MIG-010 : Demande de migration
**Prérequis** : VPS éligible  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à la page migration | Options affichées |
| 2 | Sélectionner le plan cible | Plan sélectionné |
| 3 | Cliquer "Demander la migration" | Confirmation demandée |
| 4 | Confirmer | Migration demandée |
| 5 | Vérifier l'état | "Planned" ou file d'attente |

**Statut** : ⬜ Non testé

---

### 10.3 Planification

#### TC-MIG-020 : Planification date migration
**Prérequis** : Migration demandée (état planned)  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder aux options de planification | Date picker visible |
| 2 | Sélectionner une date | Date validée |
| 3 | Confirmer | Date enregistrée |
| 4 | Email de confirmation | Reçu avec les détails |

**Statut** : ⬜ Non testé

---

### 10.4 Annulation

#### TC-MIG-030 : Annulation migration
**Prérequis** : Migration planifiée  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer "Annuler la migration" | Modale confirmation |
| 2 | Confirmer | Migration annulée |
| 3 | Vérifier l'état | Revenu à "Available" |

**Statut** : ⬜ Non testé

---

## 11. Tests Gestion du Service

### 11.1 Résiliation

#### TC-SVC-001 : Résiliation VPS
**Prérequis** : VPS actif  
**Priorité** : Haute

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Cliquer sur "Résilier" | Modale de résiliation |
| 2 | Lire les avertissements | Conséquences expliquées |
| 3 | Sélectionner un motif | Liste de motifs |
| 4 | Confirmer | Demande de résiliation envoyée |
| 5 | Email de confirmation | Token reçu par email |
| 6 | Vérifier le statut | "Résiliation en attente" |

**Statut** : ⬜ Non testé

---

### 11.2 Contacts

#### TC-SVC-010 : Changement de contact admin
**Prérequis** : Droits de gestion des contacts  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder aux contacts | Liste des contacts affichée |
| 2 | Modifier le contact admin | Champ NIC handle |
| 3 | Saisir NIC invalide | Erreur de validation |
| 4 | Saisir NIC valide | Validation OK |
| 5 | Confirmer | Demande de changement envoyée |
| 6 | Email aux parties | Validation demandée |

**Statut** : ⬜ Non testé

---

### 11.3 Engagement

#### TC-SVC-020 : Souscription engagement 12 mois
**Prérequis** : VPS sans engagement  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Accéder à la section engagement | Options affichées |
| 2 | Voir les prix | Comparatif mensuel vs engagé |
| 3 | Sélectionner 12 mois | Option sélectionnée |
| 4 | Cliquer "Souscrire" | Redirection bon de commande |

**Statut** : ⬜ Non testé

---

## 12. Tests Non-Fonctionnels

### 12.1 Performance

#### TC-PERF-001 : Temps de chargement liste
**Prérequis** : Compte avec 10+ VPS  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Mesurer le chargement de /vps | < 2 secondes |
| 2 | Vérifier le Time to Interactive | < 3 secondes |

**Statut** : ⬜ Non testé

---

#### TC-PERF-002 : Temps de chargement dashboard
**Prérequis** : VPS avec toutes les options  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Mesurer le chargement dashboard | < 3 secondes |
| 2 | Toutes les tuiles chargées | Pas de skeleton persistant |

**Statut** : ⬜ Non testé

---

### 12.2 Responsive

#### TC-RESP-001 : Affichage tablette
**Prérequis** : Device tablette ou émulation  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Afficher la liste en 768px | 2 colonnes de tuiles |
| 2 | Navigation fonctionnelle | Tous les éléments accessibles |
| 3 | Modales | S'affichent correctement |

**Statut** : ⬜ Non testé

---

#### TC-RESP-002 : Affichage mobile
**Prérequis** : Device mobile ou émulation  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Afficher en < 768px | 1 colonne, menu hamburger |
| 2 | Navigation | Menu fonctionnel |
| 3 | Actions | Toutes accessibles |

**Statut** : ⬜ Non testé

---

### 12.3 Accessibilité

#### TC-A11Y-001 : Navigation clavier
**Prérequis** : Aucun  
**Priorité** : Moyenne

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Naviguer avec Tab | Focus visible sur tous les éléments |
| 2 | Activer avec Entrée | Boutons et liens fonctionnels |
| 3 | Fermer modale avec Echap | Modale se ferme |

**Statut** : ⬜ Non testé

---

#### TC-A11Y-002 : Lecteur d'écran
**Prérequis** : Lecteur d'écran (NVDA, VoiceOver)  
**Priorité** : Basse

| Étape | Action | Résultat attendu |
|-------|--------|------------------|
| 1 | Parcourir la liste | VPS annoncés avec état |
| 2 | Lire le dashboard | Informations vocalisées |
| 3 | Interagir avec modale | Contenu annoncé |

**Statut** : ⬜ Non testé

---

## 13. Tests de Régression

### 13.1 Smoke Tests (Post-déploiement)

| ID | Test | Criticité |
|----|------|-----------|
| SMOKE-01 | Accès à /vps | Bloquant |
| SMOKE-02 | Liste des VPS s'affiche | Bloquant |
| SMOKE-03 | Accès au dashboard | Bloquant |
| SMOKE-04 | Informations VPS correctes | Bloquant |
| SMOKE-05 | Bouton Reboot cliquable | Bloquant |
| SMOKE-06 | Console KVM s'ouvre | Majeur |
| SMOKE-07 | Section Snapshot visible | Majeur |
| SMOKE-08 | Monitoring affiche des données | Mineur |

---

## 14. Matrice de Traçabilité

| Spec ID | Tests associés |
|---------|----------------|
| SPEC-VPS-001 | TC-LIST-001, TC-LIST-004, TC-LIST-005, TC-LIST-006 |
| SPEC-VPS-002 | TC-LIST-003 |
| SPEC-VPS-003 | TC-LIST-007 |
| SPEC-VPS-010 | TC-DASH-001, TC-DASH-002 |
| SPEC-VPS-011 | TC-DASH-010, TC-DASH-011 |
| SPEC-VPS-012 | TC-DASH-020, TC-DASH-021 |
| SPEC-VPS-013 | TC-DASH-030, TC-DASH-031 |
| SPEC-VPS-020 | TC-ACT-001, TC-ACT-002, TC-ACT-003 |
| SPEC-VPS-021 | TC-ACT-010, TC-ACT-011 |
| SPEC-VPS-022 | TC-ACT-020 |
| SPEC-VPS-023 | TC-ACT-021 |
| SPEC-VPS-024 | TC-REBUILD-001 à TC-REBUILD-032 |
| SPEC-VPS-026 | TC-ACT-030, TC-ACT-031 |
| SPEC-VPS-027 | TC-ACT-040 |
| SPEC-VPS-030 | TC-SNAP-001, TC-SNAP-010, TC-SNAP-011 |
| SPEC-VPS-031 | TC-SNAP-020 |
| SPEC-VPS-032 | TC-SNAP-030 |
| SPEC-VPS-033 | TC-SNAP-040 |
| SPEC-VPS-040 | TC-VEEAM-001, TC-VEEAM-020 |
| SPEC-VPS-041 | TC-VEEAM-010, TC-VEEAM-011, TC-VEEAM-012 |
| SPEC-VPS-050 | TC-BACKUP-001, TC-BACKUP-010 |
| SPEC-VPS-051 | TC-BACKUP-020, TC-BACKUP-021 |
| SPEC-VPS-060 | TC-MON-001, TC-MON-002, TC-MON-003, TC-MON-010 |
| SPEC-VPS-070 | TC-MIG-001 à TC-MIG-030 |
| SPEC-VPS-100 | TC-SVC-001 |
| SPEC-VPS-102 | TC-SVC-010 |
| SPEC-VPS-103 | TC-SVC-020 |

---

## 15. Rapport de Recette

### Template de rapport

```
=== RAPPORT DE RECETTE VPS ===
Date : ____/____/______
Testeur : ______________
Environnement : ________
Version : ______________

RÉSUMÉ
------
Tests exécutés : ___
Tests réussis : ___
Tests échoués : ___
Tests bloqués : ___

TESTS ÉCHOUÉS
-------------
ID | Description | Sévérité | Bug ID
---|-------------|----------|-------
   |             |          |

TESTS BLOQUÉS
-------------
ID | Raison du blocage
---|------------------
   |

CONCLUSION
----------
[ ] RECETTE VALIDÉE
[ ] RECETTE VALIDÉE AVEC RÉSERVES
[ ] RECETTE REFUSÉE

Commentaires :
______________________________________________
______________________________________________

Signature testeur : ____________
Signature PO : ____________
```

---

## 16. Annexes

### A. Visuels des composants de feedback

#### A.1 Toasts de notification

```
┌─ TOAST SUCCÈS ──────────────────────────────────────────────┐
│  ✅  Opération réussie                               [X]    │
│      Le VPS a été redémarré avec succès.                    │
│      ▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬░░░░░░ (auto-close 5s)            │
└─────────────────────────────────────────────────────────────┘

┌─ TOAST INFO ────────────────────────────────────────────────┐
│  ℹ️  Opération en cours                              [X]    │
│      La réinstallation est en cours, veuillez patienter...  │
│      Progression : ████████████░░░░░░░░ 65%                 │
└─────────────────────────────────────────────────────────────┘

┌─ TOAST AVERTISSEMENT ───────────────────────────────────────┐
│  ⚠️  Attention                                       [X]    │
│      Votre VPS sera inaccessible pendant l'opération.       │
└─────────────────────────────────────────────────────────────┘

┌─ TOAST ERREUR ──────────────────────────────────────────────┐
│  ❌  Erreur                                          [X]    │
│      Impossible de redémarrer le VPS.                       │
│      Code erreur : 409 - Une opération est déjà en cours.   │
│                                                             │
│      [Voir les détails]    [Réessayer]                      │
└─────────────────────────────────────────────────────────────┘
```

#### A.2 États de chargement (Skeleton)

```
┌─ LISTE VPS - CHARGEMENT ────────────────────────────────────────────────────────┐
│  ☁ VPS                                                      [Commander un VPS] │
├─────────────────────────────────────────────────────────────────────────────────┤
│  🔍 [Rechercher un VPS...                              ]                        │
├─────────────────────────────────────────────────────────────────────────────────┤
│  Nom          │ État      │ Modèle       │ DC      │ IP            │ Expiration│
│───────────────┼───────────┼──────────────┼─────────┼───────────────┼───────────│
│  ░░░░░░░░░░░  │ ░░░░░░░░  │ ░░░░░░░░░░░  │ ░░░░░   │ ░░░░░░░░░░░░  │ ░░░░░░░░  │
│  ░░░░░░░░░    │ ░░░░░░░   │ ░░░░░░░░░░   │ ░░░░    │ ░░░░░░░░░░░   │ ░░░░░░░   │
│  ░░░░░░░░░░░░ │ ░░░░░░░░  │ ░░░░░░░░░░░  │ ░░░░░   │ ░░░░░░░░░░░░  │ ░░░░░░░░  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                               ◌ Chargement en cours...                          │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### A.3 États d'erreur de page

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS > vps-unknown                                                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                            ┌─────────────────────┐                              │
│                            │     ⚠️  404         │                              │
│                            │   Illustration      │                              │
│                            │   Page non trouvée  │                              │
│                            └─────────────────────┘                              │
│                                                                                 │
│                         VPS introuvable                                         │
│                                                                                 │
│              Le VPS "vps-unknown" n'existe pas ou vous n'avez                   │
│                      pas les droits pour y accéder.                             │
│                                                                                 │
│                         [Retour à la liste des VPS]                             │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────┐
│  ☁ VPS                                                                          │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│                            ┌─────────────────────┐                              │
│                            │     ❌  500         │                              │
│                            │   Illustration      │                              │
│                            │   Erreur serveur    │                              │
│                            └─────────────────────┘                              │
│                                                                                 │
│                         Une erreur est survenue                                 │
│                                                                                 │
│              Nous n'avons pas pu charger vos VPS. Veuillez                      │
│                     réessayer dans quelques instants.                           │
│                                                                                 │
│                              [Réessayer]                                        │
│                                                                                 │
│              Si le problème persiste, contactez le support.                     │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### A.4 Bouton désactivé avec tooltip

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                 │
│  Actions rapides :                                                              │
│                                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐                    │
│  │  Redémarrer    │  │  Mode Rescue   │  │  Arrêter       │                    │
│  │  (grisé)       │  │  (grisé)       │  │  (grisé)       │                    │
│  └───────┬────────┘  └────────────────┘  └────────────────┘                    │
│          │                                                                      │
│          ▼                                                                      │
│  ┌─────────────────────────────────────────────┐                               │
│  │  ⚠️ Action non disponible                   │                               │
│  │                                             │                               │
│  │  Une opération est déjà en cours sur ce    │                               │
│  │  VPS. Veuillez attendre qu'elle se         │                               │
│  │  termine avant d'effectuer une nouvelle    │                               │
│  │  action.                                   │                               │
│  │                                             │                               │
│  │  Opération en cours : Réinstallation       │                               │
│  │  Démarrée il y a : 3 minutes               │                               │
│  └─────────────────────────────────────────────┘                               │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

#### A.5 Modale de progression

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│              🔄  Réinstallation en cours                       │
│  ────────────────────────────────────────────────────────────  │
│                                                                 │
│              ████████████████████░░░░░░░░░░░  65%              │
│                                                                 │
│  Étapes :                                                       │
│                                                                 │
│  ✓  Préparation de l'image                                     │
│  ✓  Arrêt du VPS                                               │
│  ✓  Formatage du disque                                        │
│  ◌  Installation du système    (en cours...)                   │
│  ○  Configuration réseau                                       │
│  ○  Finalisation                                               │
│                                                                 │
│  Temps écoulé : 4:32                                           │
│  Temps restant estimé : ~3 minutes                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ⚠️ Ne fermez pas cette fenêtre pendant l'opération.     │ │
│  │     Vous pouvez cependant naviguer ailleurs,              │ │
│  │     l'opération continuera en arrière-plan.               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│                    [Exécuter en arrière-plan]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### B. Codes d'erreur à tester

| Code | Message | Scénario de test |
|------|---------|------------------|
| 400 | Paramètre invalide | TC-REBUILD-011 (clé SSH invalide) |
| 401 | Session expirée | Test manuel déconnexion |
| 403 | Non autorisé | Test avec compte sans droits |
| 404 | VPS non trouvé | Accès URL avec ID inexistant |
| 409 | Tâche en cours | TC-ACT-002 |
| 500 | Erreur serveur | TC-REBUILD-032 |

### B. Données de test

```json
{
  "vps_running": {
    "serviceName": "vps-elite-test",
    "state": "running",
    "model": "Elite 2025",
    "ip": "51.XX.XX.XX"
  },
  "vps_stopped": {
    "serviceName": "vps-starter-test",
    "state": "stopped"
  },
  "ssh_key_valid": "ssh-rsa AAAAB3NzaC1yc2EAAA... test@example.com",
  "ssh_key_invalid": "invalid-key-format"
}
```

### C. Checklist pré-recette

- [ ] Environnement de staging accessible
- [ ] Comptes de test créés et configurés
- [ ] VPS de test provisionnés
- [ ] Options activées sur les VPS concernés
- [ ] Accès aux logs disponible
- [ ] Outil de bug tracking prêt

---

*Document généré le 27 janvier 2026 - Version 1.0*

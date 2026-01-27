# Spécification Fonctionnelle - Module VPS (Virtual Private Server)

**Version** : 1.0  
**Date** : 27 janvier 2026  
**Auteur** : Agent IA - Specs Fonctionnelles  
**Statut** : Draft  
**Module concerné** : `packages/manager/apps/vps` et `packages/manager/modules/vps`

---

## 1. Résumé Exécutif

### Objectif
Le module VPS du Manager OVH permet aux clients de gérer leurs serveurs privés virtuels (VPS) de manière complète et intuitive. Il offre une interface centralisée pour surveiller, configurer, sauvegarder et administrer les VPS.

### Bénéfices Utilisateurs
- Gestion simplifiée de l'ensemble du cycle de vie des VPS
- Accès rapide aux actions critiques (reboot, reinstall, KVM)
- Monitoring en temps réel des ressources
- Options de sauvegarde flexibles (Snapshot, Veeam, Backup Storage)
- Migration facilitée vers les nouvelles gammes de VPS

### Impact Business
- Autonomie accrue des clients dans la gestion de leur infrastructure
- Réduction des tickets support grâce à une interface self-service complète
- Facilitation des upsells via les options additionnelles visibles dans l'interface

---

## 2. Contexte et Justification

### Pourquoi ce module ?
Le VPS est un produit phare d'OVHcloud offrant un équilibre entre performance et coût. Les clients ont besoin d'une interface intuitive pour :
- Administrer leurs serveurs sans compétences avancées en ligne de commande
- Accéder rapidement aux informations critiques (état, IP, ressources)
- Effectuer des opérations de maintenance courantes
- Gérer les options de sauvegarde et de sécurité

### Gamme VPS 2025

Cette spécification se concentre sur la **nouvelle gamme VPS 2025** qui remplace les anciennes gammes (2014, 2019, 2020).

| Gamme | Version | Caractéristiques |
|-------|---------|------------------|
| Starter | 2025v1 | Entrée de gamme, ressources limitées |
| Value | 2025v1 | Équilibre performance/prix |
| Essential | 2025v1 | Usage professionnel standard |
| Comfort | 2025v1 | Ressources étendues |
| Elite | 2025v1 | Haute performance |

> **Note** : Les anciennes gammes (2014v1, 2019v1, 2020) sont en cours de migration vers la gamme 2025. Les spécifications ci-dessous concernent exclusivement la gamme 2025.

---

## 3. Personas et Cas d'Usage

### Personas

#### Persona 1 : Développeur Indépendant
- **Profil** : Développeur web/mobile freelance
- **Besoins** : Héberger ses applications, environnements de test
- **Compétences** : Bonnes connaissances techniques
- **Fréquence d'utilisation** : Hebdomadaire

#### Persona 2 : Administrateur Système PME
- **Profil** : Responsable IT d'une petite entreprise
- **Besoins** : Gérer plusieurs VPS pour différents services
- **Compétences** : Expert technique
- **Fréquence d'utilisation** : Quotidienne

#### Persona 3 : Entrepreneur Digital
- **Profil** : Propriétaire d'un site e-commerce
- **Besoins** : Assurer la disponibilité de son site
- **Compétences** : Compétences techniques limitées
- **Fréquence d'utilisation** : Mensuelle

### Cas d'Usage Principaux

| ID | User Story | Priorité |
|----|------------|----------|
| US-001 | En tant qu'utilisateur, je veux voir la liste de tous mes VPS afin d'avoir une vue d'ensemble de mon infrastructure | Must |
| US-002 | En tant qu'utilisateur, je veux accéder au dashboard d'un VPS pour voir son état et ses caractéristiques | Must |
| US-003 | En tant qu'utilisateur, je veux redémarrer mon VPS pour appliquer des modifications | Must |
| US-004 | En tant qu'utilisateur, je veux accéder à la console KVM pour dépanner mon serveur | Must |
| US-005 | En tant qu'utilisateur, je veux réinstaller mon VPS avec un nouveau système d'exploitation | Must |
| US-006 | En tant qu'utilisateur, je veux créer un snapshot de mon VPS avant une opération risquée | Should |
| US-007 | En tant qu'utilisateur, je veux configurer les sauvegardes automatisées Veeam | Should |
| US-008 | En tant qu'utilisateur, je veux surveiller les performances de mon VPS (CPU, RAM, disque) | Should |
| US-009 | En tant qu'utilisateur, je veux upgrader les ressources de mon VPS (upscale) | Could |
| US-010 | En tant qu'utilisateur, je veux migrer mon VPS vers une nouvelle gamme | Could |

---

## 4. Exigences Fonctionnelles

### 4.1 Module Liste des VPS

#### **[SPEC-VPS-001]** Affichage de la liste des VPS
- **Priorité** : Must
- **Description** : L'utilisateur doit pouvoir visualiser tous ses VPS dans un tableau paginé avec filtrage et tri
- **Colonnes affichées** :
  - Nom du service (serviceName)
  - Nom d'affichage (displayName)
  - État (running, stopped, maintenance, etc.)
  - Modèle/Gamme
  - Localisation (datacenter)
  - Adresse IP principale
  - Date d'expiration

#### **[SPEC-VPS-002]** États visuels des VPS
- **Priorité** : Must
- **Description** : Chaque VPS doit afficher un indicateur visuel de son état
- **Règle métier** :
  ```javascript
  VPS_STATES = {
    ERROR: ['maintenance', 'stopped', 'stopping'], // Badge rouge
    WARNING: ['backuping', 'installing', 'rebooting', 'upgrading', 'rescued'], // Badge orange
    SUCCESS: ['running'], // Badge vert
  };
  ```

#### **[SPEC-VPS-003]** Accès rapide aux actions
- **Priorité** : Should
- **Description** : Depuis la liste, l'utilisateur peut accéder directement aux actions principales via un menu contextuel

### 4.2 Module Dashboard VPS

#### **[SPEC-VPS-010]** Tuile Informations Générales
- **Priorité** : Must
- **Description** : Affiche les informations essentielles du VPS
- **Données affichées** :
  | Champ | Source API | Description |
  |-------|------------|-------------|
  | Nom | `displayName` | Nom personnalisable |
  | Service | `name` | Identifiant technique |
  | Modèle | `model.name` | Ex: "VPS Elite 2025" |
  | vCores | `model.vcore` | Nombre de cœurs virtuels |
  | RAM | `model.memory` | Mémoire en Go |
  | Stockage | `model.disk` | Espace disque en Go |
  | Datacenter | `location.datacentre` | Localisation |
  | Système | `distribution` | OS installé |

#### **[SPEC-VPS-011]** Tuile Configuration
- **Priorité** : Must
- **Description** : Permet de visualiser et modifier la configuration du VPS
- **Actions disponibles** :
  - Modifier le nom d'affichage
  - Configurer le monitoring SLA
  - Modifier le reverse DNS
  - Gérer le keymap KVM

#### **[SPEC-VPS-012]** Tuile Réseau
- **Priorité** : Must
- **Description** : Affiche les informations réseau du VPS
- **Données** :
  - IPv4 principale
  - IPv6 (si disponible)
  - IPs additionnelles
  - Reverse DNS
  - Gateway
  - MAC Address

#### **[SPEC-VPS-013]** Tuile Options
- **Priorité** : Should
- **Description** : Affiche l'état des options souscrites
- **Options** :
  | Option | États possibles | Actions |
  |--------|-----------------|---------|
  | Snapshot | Activé/Disponible/Non disponible | Commander, Créer, Restaurer, Supprimer, Télécharger |
  | Automated Backup (Veeam) | Activé/Non activé | Commander, Gérer, Résilier |
  | Backup Storage | Activé/Non activé | Commander, Gérer, Résilier |
  | Additional Disk | Configuré/Non configuré | Commander, Upgrader |

### 4.3 Actions VPS

#### **[SPEC-VPS-020]** Redémarrage (Reboot)
- **Priorité** : Must
- **Description** : Permet de redémarrer le VPS
- **API** : `POST /vps/{serviceName}/reboot`
- **Prérequis** : VPS non en cours de tâche
- **Confirmation** : Modale de confirmation requise
- **Feedback** : 
  - Succès : Toast "Redémarrage en cours"
  - Tâche asynchrone créée avec polling

#### **[SPEC-VPS-021]** Redémarrage en mode Rescue
- **Priorité** : Must
- **Description** : Redémarre le VPS sur un système de secours
- **API** : `PUT /vps/{serviceName}` (netbootMode: 'rescue') puis `POST /vps/{serviceName}/reboot`
- **Cas d'usage** : Dépannage, récupération de données
- **Comportement** :
  1. Afficher modale avec sélection du mot de passe
  2. Modifier le netbootMode
  3. Redémarrer le VPS
  4. Envoyer les credentials par email

#### **[SPEC-VPS-022]** Arrêt (Stop)
- **Priorité** : Must
- **Description** : Arrête le VPS (power off)
- **API** : `POST /vps/{serviceName}/stop`
- **Avertissement** : Message d'alerte sur la perte de service

#### **[SPEC-VPS-023]** Démarrage (Start)
- **Priorité** : Must
- **Description** : Démarre un VPS arrêté
- **API** : `POST /vps/{serviceName}/start`
- **Prérequis** : VPS à l'état "stopped"

#### **[SPEC-VPS-024]** Réinstallation (Rebuild)
- **Priorité** : Must
- **Description** : Permet de réinstaller le VPS avec une nouvelle image système (gamme 2025)
- **API** : `POST /vps/{serviceName}/rebuild`
- **Prérequis** :
  - VPS de gamme 2025
  - Aucune tâche en cours sur le VPS
- **Paramètres** :
  | Paramètre | Type | Obligatoire | Description |
  |-----------|------|-------------|-------------|
  | imageId | string | Oui | ID de l'image (récupéré via `GET /vps/{serviceName}/images/available`) |
  | sshKey | string | Non | Nom de la clé SSH enregistrée (depuis `/me/sshKey`) |
  | publicSshKey | string | Non | Clé SSH publique à préinstaller (alternative à sshKey) |
  | doNotSendPassword | boolean | Non | Ne pas envoyer le mot de passe par email (requiert sshKey ou publicSshKey) |
  | installRTM | boolean | Non | Installer Real Time Monitoring sur le VPS |

- **APIs associées** :
  | Endpoint | Méthode | Description |
  |----------|---------|-------------|
  | `/vps/{serviceName}/images/available` | GET | Liste des images disponibles pour le VPS |
  | `/vps/{serviceName}/images/available/{id}` | GET | Détails d'une image spécifique |
  | `/vps/{serviceName}/images/current` | GET | Image actuellement installée |
  | `/me/sshKey` | GET | Liste des clés SSH enregistrées |

- **Flux utilisateur** :
  ```mermaid
  flowchart TD
      A[Clic Réinstaller] --> B[Modale de sélection d'image]
      B --> C{Image sélectionnée ?}
      C -->|Non| B
      C -->|Oui| D[Options avancées]
      D --> E{Clé SSH ?}
      E -->|Oui| F[Sélection clé existante ou saisie]
      E -->|Non| G[Option mot de passe]
      F --> H{Ne pas envoyer mot de passe ?}
      H -->|Oui| I[Confirmation]
      H -->|Non| I
      G --> I
      I --> J{Confirmer ?}
      J -->|Non| B
      J -->|Oui| K[Appel API rebuild]
      K --> L[Polling tâche]
      L --> M[Succès/Erreur]
  ```

- **Avertissements** :
  - ⚠️ Toutes les données du VPS seront effacées
  - ⚠️ Le VPS sera indisponible pendant la réinstallation (environ 5-15 minutes)
  - ⚠️ L'adresse IP du VPS sera conservée

#### **[SPEC-VPS-026]** Accès Console KVM
- **Priorité** : Must
- **Description** : Ouvre une console VNC pour accéder au VPS
- **APIs** :
  - `POST /vps/{serviceName}/getConsoleUrl` : URL console web
  - `POST /vps/{serviceName}/openConsoleAccess` : Accès VNC over WebSocket
- **Protocoles supportés** : VNC, VNCOverWebSocket
- **Interface** : 
  - Modale avec iframe ou nouvelle fenêtre
  - Possibilité de copier l'URL KVM

#### **[SPEC-VPS-027]** Réinitialisation du mot de passe root
- **Priorité** : Must
- **Description** : Génère un nouveau mot de passe root
- **API** : `POST /vps/{serviceName}/setPassword`
- **Comportement** :
  - Génération d'un mot de passe aléatoire sécurisé
  - Envoi par email au contact admin
  - Tâche asynchrone

### 4.4 Gestion des Snapshots

#### **[SPEC-VPS-030]** Création de snapshot
- **Priorité** : Must
- **Description** : Crée un instantané du VPS
- **API** : `POST /vps/{serviceName}/createSnapshot`
- **Prérequis** :
  - Option snapshot souscrite
  - Aucun snapshot existant (1 seul autorisé)
  - Aucune tâche en cours
- **Paramètres** :
  | Paramètre | Type | Description |
  |-----------|------|-------------|
  | description | string | Description du snapshot (optionnel) |

#### **[SPEC-VPS-031]** Restauration de snapshot
- **Priorité** : Must
- **Description** : Restaure le VPS à partir du snapshot
- **API** : `POST /vps/{serviceName}/snapshot/revert`
- **Avertissement** : Perte des données actuelles

#### **[SPEC-VPS-032]** Suppression de snapshot
- **Priorité** : Must
- **Description** : Supprime le snapshot existant
- **API** : `DELETE /vps/{serviceName}/snapshot`

#### **[SPEC-VPS-033]** Téléchargement de snapshot
- **Priorité** : Should
- **Description** : Génère une URL de téléchargement
- **API** : `GET /vps/{serviceName}/snapshot/download`
- **Retour** : URL temporaire valide 24h

#### **[SPEC-VPS-034]** Annulation de snapshot en cours
- **Priorité** : Should
- **Description** : Annule une opération de snapshot en cours
- **API** : `POST /vps/{serviceName}/abortSnapshot`

### 4.5 Sauvegarde Automatisée (Veeam / Automated Backup)

#### **[SPEC-VPS-040]** Configuration Veeam
- **Priorité** : Should
- **Description** : Gestion des sauvegardes automatisées Veeam
- **APIs** :
  | Endpoint | Méthode | Description |
  |----------|---------|-------------|
  | `/vps/{serviceName}/automatedBackup` | GET | État de la configuration |
  | `/vps/{serviceName}/automatedBackup/reschedule` | POST | Modifier l'heure de backup |
  | `/vps/{serviceName}/automatedBackup/restorePoints` | GET | Liste des points de restauration |
  | `/vps/{serviceName}/automatedBackup/restore` | POST | Restaurer depuis un point |
  | `/vps/{serviceName}/automatedBackup/attachedBackup` | GET | Backup monté actuellement |
  | `/vps/{serviceName}/automatedBackup/detachBackup` | POST | Démonter un backup |

#### **[SPEC-VPS-041]** Points de restauration Veeam
- **Priorité** : Should
- **Description** : Liste et restauration des points Veeam
- **États des points** : `available`, `restored`, `restoring`
- **Types de restauration** :
  | Type | Description |
  |------|-------------|
  | file | Monte le backup pour récupération de fichiers |
  | full | Restauration complète du VPS |

### 4.6 Backup Storage (FTP)

#### **[SPEC-VPS-050]** Gestion du Backup Storage
- **Priorité** : Should
- **Description** : Espace FTP de sauvegarde dédié au VPS
- **APIs** :
  | Endpoint | Description |
  |----------|-------------|
  | `GET /vps/{serviceName}/backupftp` | Informations du backup FTP |
  | `POST /vps/{serviceName}/backupftp/password` | Réinitialiser le mot de passe |
  | `GET /vps/{serviceName}/backupftp/access` | Liste des ACL |
  | `POST /vps/{serviceName}/backupftp/access` | Ajouter une ACL |
  | `DELETE /vps/{serviceName}/backupftp/access/{ipBlock}` | Supprimer une ACL |

#### **[SPEC-VPS-051]** ACL Backup Storage
- **Priorité** : Should
- **Description** : Gestion des droits d'accès au backup FTP
- **Protocoles** :
  | Protocole | Port | Description |
  |-----------|------|-------------|
  | FTP | 21 | File Transfer Protocol |
  | FTPS | 990 | FTP over SSL |
  | CIFS/SMB | 445 | Windows sharing |
  | NFS | 2049 | Network File System |

### 4.7 Monitoring

#### **[SPEC-VPS-060]** Graphiques de monitoring
- **Priorité** : Should
- **Description** : Affiche les métriques de performance
- **Périodes disponibles** : lastday, lastweek, lastmonth, lastyear
- **Métriques** :
  | Métrique | Unité | Description |
  |----------|-------|-------------|
  | cpu:used | % | Utilisation CPU |
  | cpu:max | % | CPU maximum |
  | mem:used | bytes | Mémoire utilisée |
  | mem:max | bytes | Mémoire totale |
  | net:tx | bytes/s | Trafic sortant |
  | net:rx | bytes/s | Trafic entrant |

#### **[SPEC-VPS-061]** Monitoring disque
- **Priorité** : Should
- **Description** : Surveillance de l'espace disque
- **API** : `GET /vps/{serviceName}/disks/{id}/monitoring`
- **Alertes** : Seuil configurable pour espace disque faible

### 4.8 Migration

#### **[SPEC-VPS-070]** Migration VPS 2020 vers 2025
- **Priorité** : Could
- **Description** : Migration vers la nouvelle gamme VPS 2025
- **APIs** :
  | Endpoint | Méthode | Description |
  |----------|---------|-------------|
  | `GET /vps/{serviceName}/migration2020` | GET | État de la migration |
  | `POST /vps/{serviceName}/migration2020` | POST | Demander la migration |
  | `PUT /vps/{serviceName}/migration2020` | PUT | Planifier/modifier la date |
  | `DELETE /vps/{serviceName}/migration2020` | DELETE | Annuler la migration |

- **États de migration** :
  | État | Description |
  |------|-------------|
  | available | Migration disponible |
  | planned | Migration planifiée |
  | ongoing | Migration en cours |
  | done | Migration terminée |

### 4.9 Upscale / Upgrade

#### **[SPEC-VPS-080]** Upgrade de gamme
- **Priorité** : Could
- **Description** : Passage à une gamme supérieure
- **API** : `GET /vps/{serviceName}/availableUpgrade`
- **Flux** : Redirection vers le bon de commande OVH

#### **[SPEC-VPS-081]** Upscale (ressources)
- **Priorité** : Could
- **Description** : Augmentation des ressources (RAM, CPU, disque)
- **Contraintes** : Disponible uniquement sur certaines gammes

### 4.10 DNS Secondaire

#### **[SPEC-VPS-090]** Gestion DNS Secondaire
- **Priorité** : Could
- **Description** : Configuration des zones DNS secondaires
- **APIs** :
  | Endpoint | Méthode | Description |
  |----------|---------|-------------|
  | `GET /vps/{serviceName}/secondaryDnsDomains` | GET | Liste des domaines |
  | `POST /vps/{serviceName}/secondaryDnsDomains` | POST | Ajouter un domaine |
  | `DELETE /vps/{serviceName}/secondaryDnsDomains/{domain}` | DELETE | Supprimer |

### 4.11 Gestion du Service

#### **[SPEC-VPS-100]** Résiliation
- **Priorité** : Must
- **Description** : Permet de résilier le VPS
- **API** : `POST /vps/{serviceName}/terminate`
- **Flux** :
  1. Clic sur "Résilier"
  2. Modale de confirmation avec motif
  3. Email de confirmation envoyé
  4. `POST /vps/{serviceName}/confirmTermination` avec token

#### **[SPEC-VPS-101]** Annulation de résiliation
- **Priorité** : Should
- **Description** : Annule une résiliation en attente
- **Accès** : Via le module de facturation

#### **[SPEC-VPS-102]** Changement de contact
- **Priorité** : Should
- **Description** : Modifier les contacts admin/tech/billing
- **API** : `POST /vps/{serviceName}/changeContact`

#### **[SPEC-VPS-103]** Engagement (Commitment)
- **Priorité** : Should
- **Description** : Souscrire à un engagement pour réduction tarifaire
- **Durées** : 12 mois, 24 mois

---

## 5. Interface Utilisateur

### 5.1 Structure de Navigation

```
/vps
├── /vps/index                     # Liste des VPS
├── /vps/onboarding                # Page d'accueil sans VPS
└── /vps/detail/{serviceName}
    ├── /dashboard                  # Tableau de bord principal
    │   ├── /display-ips           # Modale IPs
    │   ├── /kvm                   # Console KVM
    │   ├── /reboot                # Redémarrage
    │   ├── /reinstall             # Réinstallation
    │   ├── /rebuild               # Rebuild (2025)
    │   ├── /snapshot-*            # Actions snapshot
    │   ├── /commitment            # Engagement
    │   ├── /migrate               # Migration
    │   └── /terminate             # Résiliation
    ├── /backup-storage            # Backup FTP
    │   └── /order
    ├── /veeam                     # Sauvegardes Veeam
    │   └── /order
    ├── /snapshot                  # Gestion snapshots
    │   └── /order
    ├── /secondary-dns             # DNS secondaire
    ├── /monitoring                # Graphiques
    ├── /upscale                   # Augmentation ressources
    ├── /upgrade                   # Changement gamme
    └── /additional-disk           # Disques additionnels
```

### 5.2 Maquette Dashboard (Wireframe textuel)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Breadcrumb: VPS > vps-xxxxx]                           [Actions ▼]         │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─ Migration Banner (conditionnel) ───────────────────────────────────────┐ │
│ │ ⚠ Votre VPS peut être migré vers la nouvelle gamme 2025. [Migrer]      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────────┐ │
│ │   INFORMATIONS      │ │   CONFIGURATION     │ │   RACCOURCIS            │ │
│ ├─────────────────────┤ ├─────────────────────┤ ├─────────────────────────┤ │
│ │ État: ● Running     │ │ Nom: Mon VPS        │ │ [Redémarrer]            │ │
│ │ Modèle: Elite 2025  │ │ Monitoring: Activé  │ │ [Mode Rescue]           │ │
│ │ vCores: 8           │ │ SLA: Oui           │ │ [Réinstaller]           │ │
│ │ RAM: 32 Go          │ │ Keymap: fr         │ │ [Console KVM]           │ │
│ │ Disque: 640 Go      │ │                     │ │ [Changer propriétaire]  │ │
│ │ DC: GRA             │ │ [Modifier ✎]        │ │ [Résilier]              │ │
│ │ IP: 1.2.3.4         │ │                     │ │                         │ │
│ └─────────────────────┘ └─────────────────────┘ └─────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │   OPTIONS                                                               │ │
│ ├───────────────────────┬───────────────────────┬─────────────────────────┤ │
│ │ SNAPSHOT              │ VEEAM BACKUP          │ BACKUP STORAGE          │ │
│ ├───────────────────────┼───────────────────────┼─────────────────────────┤ │
│ │ ● Activé              │ ○ Non activé          │ ● Activé                │ │
│ │ Créé le: 25/01/2026   │                       │ Quota: 500 Go           │ │
│ │ [Créer] [Restaurer]   │ [Commander]           │ [Gérer] [Résilier]      │ │
│ │ [Télécharger]         │                       │                         │ │
│ └───────────────────────┴───────────────────────┴─────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │   ABONNEMENT                                                            │ │
│ ├─────────────────────────────────────────────────────────────────────────┤ │
│ │ Création: 01/01/2025    Expiration: 01/02/2026    Renouvellement: Auto  │ │
│ │ [Gérer le renouvellement] [S'engager pour réduire le prix]              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 États Visuels

#### États de chargement
- **Loading** : Spinner centré avec message "Chargement en cours..."
- **Skeleton** : Placeholders gris animés pendant le chargement des tuiles

#### États d'erreur
- **Erreur API** : Bannière rouge avec message d'erreur et bouton "Réessayer"
- **VPS expiré** : Bannière warning avec lien vers renouvellement

#### États vides
- **Aucun VPS** : Page onboarding avec illustration et CTA "Commander un VPS"
- **Aucun snapshot** : Message "Aucun snapshot. Créez-en un pour sauvegarder votre VPS."

---

## 6. Gestion des Erreurs

### 6.1 Messages d'Erreur API

| Code | Contexte | Message Utilisateur |
|------|----------|---------------------|
| 400 | Paramètre invalide | "Les paramètres fournis sont invalides. Veuillez vérifier votre saisie." |
| 401 | Non authentifié | "Votre session a expiré. Veuillez vous reconnecter." |
| 403 | Non autorisé | "Vous n'avez pas les droits pour effectuer cette action." |
| 404 | VPS non trouvé | "Ce VPS n'existe pas ou a été supprimé." |
| 409 | Conflit (tâche en cours) | "Une opération est déjà en cours sur ce VPS. Veuillez patienter." |
| 500 | Erreur serveur | "Une erreur est survenue. Veuillez réessayer ultérieurement." |

### 6.2 Erreurs Métier Spécifiques

| Erreur | Message | Action suggérée |
|--------|---------|-----------------|
| Snapshot déjà existant | "Un snapshot existe déjà. Supprimez-le avant d'en créer un nouveau." | Lien vers suppression |
| Option non disponible | "Cette option n'est pas disponible pour votre gamme de VPS." | Lien vers upgrade |
| Quota IP atteint | "Vous avez atteint le nombre maximum d'IPs additionnelles." | - |
| Migration impossible | "Ce VPS ne peut pas être migré actuellement." | Contact support |

### 6.3 Comportements Dégradés

- **API Monitoring indisponible** : Masquer la section monitoring, afficher message informatif
- **API Veeam indisponible** : Afficher état "Information indisponible" avec bouton refresh
- **Tâche en timeout** : Proposer de rafraîchir la page ou contacter le support

---

## 7. Exigences Non-Fonctionnelles

### 7.1 Performance

| Métrique | Cible | Mesure |
|----------|-------|--------|
| Temps de chargement liste | < 2s | Time to Interactive |
| Temps de chargement dashboard | < 3s | Time to Interactive |
| Temps de réponse actions | < 500ms | Jusqu'au feedback visuel |

### 7.2 Accessibilité (WCAG 2.1 AA)

- Navigation au clavier complète
- Labels ARIA sur tous les éléments interactifs
- Contraste minimum 4.5:1
- Focus visible sur tous les éléments
- Messages d'erreur associés aux champs

### 7.3 Internationalisation

- Langues supportées : FR, EN, DE, ES, IT, PL, PT
- Format des dates selon locale
- Format des nombres selon locale
- Traductions via fichiers JSON dans `/translations`

### 7.4 Responsive Design

| Breakpoint | Comportement |
|------------|--------------|
| Desktop (>1200px) | 3 colonnes de tuiles |
| Tablet (768-1199px) | 2 colonnes de tuiles |
| Mobile (<768px) | 1 colonne, menu hamburger |

---

## 8. Dépendances et Impacts

### 8.1 APIs Backend Requises

| API | Version | Documentation |
|-----|---------|---------------|
| /vps | v1 | https://eu.api.ovh.com/v1/vps.json |
| /me/sshKey | v1 | Clés SSH utilisateur |
| /order | v1 | Commande d'options |
| /service | v1 | Informations service |

### 8.2 Composants UI Utilisés

| Composant | Package | Usage |
|-----------|---------|-------|
| oui-datagrid | @ovh-ux/ui-kit | Liste des VPS |
| oui-tile | @ovh-ux/ui-kit | Tuiles dashboard |
| oui-modal | @ovh-ux/ui-kit | Modales de confirmation |
| oui-message | @ovh-ux/ui-kit | Alertes et notifications |
| oui-action-menu | @ovh-ux/ui-kit | Menus d'actions |
| oui-chart | @ovh-ux/ui-kit | Graphiques monitoring |

### 8.3 Services Partagés

- `VpsService` : Service principal d'appel API
- `VpsTaskService` : Gestion du polling des tâches asynchrones
- `CucCloudMessage` : Notifications toast
- `CucControllerHelper` : Helpers communs (navigation, modales)

### 8.4 Modules Impactés

```
packages/manager/modules/vps/
├── src/
│   ├── dashboard/          # Module principal
│   ├── backup-storage/     # Option backup FTP
│   ├── veeam/              # Option Veeam
│   ├── snapshot/           # Option Snapshot
│   ├── monitoring/         # Graphiques
│   ├── secondary-dns/      # DNS secondaire
│   ├── upscale/            # Upgrade ressources
│   ├── upgrade/            # Upgrade gamme
│   ├── migration/          # Migration 2020->2025
│   └── additional-disk/    # Disques additionnels
```

---

## 9. Critères d'Acceptation

### 9.1 Liste des VPS

- [ ] La liste affiche tous les VPS du compte
- [ ] Le tri par colonne fonctionne
- [ ] Le filtre par nom/état fonctionne
- [ ] La pagination fonctionne correctement
- [ ] Le clic sur un VPS ouvre le dashboard

### 9.2 Dashboard

- [ ] Les informations du VPS s'affichent correctement
- [ ] L'état du VPS est visible et mis à jour
- [ ] Les actions sont accessibles selon l'état du VPS
- [ ] Les options affichent leur état correct

### 9.3 Actions

- [ ] Le reboot déclenche une tâche et affiche un feedback
- [ ] Le mode rescue fonctionne et envoie les credentials
- [ ] La réinstallation liste les templates disponibles
- [ ] Le KVM s'ouvre dans une modale fonctionnelle
- [ ] La réinitialisation du mot de passe envoie un email

### 9.4 Snapshots

- [ ] La création de snapshot fonctionne
- [ ] La restauration affiche un avertissement et fonctionne
- [ ] Le téléchargement génère une URL valide
- [ ] La suppression fonctionne avec confirmation

### 9.5 Monitoring

- [ ] Les graphiques s'affichent pour toutes les périodes
- [ ] Les données sont cohérentes avec l'état du VPS
- [ ] Le changement de période met à jour les graphiques

---

## 10. Scénarios de Test

### 10.1 Scénarios Nominaux

#### Test N1 : Redémarrage d'un VPS
```gherkin
Feature: Redémarrage VPS
  Scenario: Redémarrage réussi
    Given je suis sur le dashboard du VPS "vps-test"
    And le VPS est à l'état "running"
    When je clique sur "Redémarrer"
    And je confirme dans la modale
    Then une notification "Redémarrage en cours" s'affiche
    And l'état passe à "rebooting"
    And après quelques secondes l'état revient à "running"
```

#### Test N2 : Création de snapshot
```gherkin
Feature: Création Snapshot
  Scenario: Création réussie
    Given je suis sur le dashboard du VPS "vps-test"
    And l'option snapshot est activée
    And aucun snapshot n'existe
    When je clique sur "Créer un snapshot"
    And je saisis la description "Backup avant mise à jour"
    And je confirme
    Then une tâche de snapshot est créée
    And le snapshot apparaît dans la tuile Options
```

### 10.2 Scénarios d'Erreur

#### Test E1 : Action sur VPS avec tâche en cours
```gherkin
Feature: Gestion des conflits
  Scenario: Action bloquée si tâche en cours
    Given je suis sur le dashboard du VPS "vps-test"
    And une tâche de reinstallation est en cours
    When je clique sur "Redémarrer"
    Then un message d'erreur s'affiche "Une opération est déjà en cours"
    And le bouton reste désactivé
```

#### Test E2 : Snapshot déjà existant
```gherkin
Feature: Gestion des snapshots
  Scenario: Création impossible si snapshot existant
    Given je suis sur le dashboard du VPS "vps-test"
    And un snapshot existe déjà
    When je clique sur "Créer un snapshot"
    Then un message d'erreur s'affiche
    And on me propose de supprimer l'existant
```

### 10.3 Données de Test

| Service Name | Gamme | État | Options |
|--------------|-------|------|---------|
| vps-test-01 | Elite 2025 | running | Snapshot, Veeam |
| vps-test-02 | Value 2025 | stopped | Aucune |
| vps-test-03 | Essential 2019 | maintenance | Backup Storage |
| vps-test-04 | Starter 2025 | rescued | Snapshot |

---

## 11. Hors Scope

Les éléments suivants sont explicitement **hors du périmètre** de cette version :

- ❌ Gestion multi-sélection dans la liste (actions groupées)
- ❌ API v2 / IcebergV2 pour la liste des VPS
- ❌ Mode sombre / thème personnalisé
- ❌ Application mobile native
- ❌ Notifications push temps réel (WebSocket)
- ❌ Import/Export de configuration VPS
- ❌ Clonage de VPS
- ❌ Templates personnalisés utilisateur

---

## 12. Évolutions Futures

### Phase 2 (Q2 2026)
- Migration vers React/TypeScript (nouveau stack technique)
- API v2 avec pagination côté serveur
- Amélioration du monitoring avec métriques avancées

### Phase 3 (Q3 2026)
- Actions groupées sur plusieurs VPS
- Comparaison de VPS
- Alertes configurables (email/SMS)

### Phase 4 (Q4 2026)
- Interface Terraform/API complète
- Intégration avec d'autres produits OVH (vRack, IP Failover)

---

## 13. Questions Ouvertes

| # | Question | Impact | Décision attendue de |
|---|----------|--------|---------------------|
| Q1 | Doit-on supporter les VPS version 2014 encore longtemps ? | UX/Maintenance | Product Owner |
| Q2 | Le monitoring doit-il inclure les alertes email ? | Développement | Product Owner |
| Q3 | Faut-il permettre le multi-select dans la liste ? | UX/Dev | UX Designer |
| Q4 | API v2 prioritaire pour la liste des VPS ? | Architecture | Tech Lead |

---

## 14. Glossaire

| Terme | Définition |
|-------|------------|
| **VPS** | Virtual Private Server - Serveur privé virtuel |
| **KVM** | Keyboard Video Mouse - Console d'accès distant |
| **Snapshot** | Image instantanée de l'état du VPS |
| **Veeam** | Solution de sauvegarde automatisée |
| **Backup Storage** | Espace FTP de stockage de sauvegardes |
| **Rescue Mode** | Mode de démarrage sur système de secours |
| **Template** | Modèle d'installation (OS + configuration) |
| **Image** | Image disque pour rebuild (nouvelle gamme) |
| **Upscale** | Augmentation des ressources à chaud |
| **Netboot Mode** | Mode de démarrage réseau (local/rescue) |
| **SLA Monitoring** | Surveillance de disponibilité avec engagement |

---

## 15. Références

### Documentation Technique
- [API VPS OVH](https://eu.api.ovh.com/v1/vps.json?format=openapi3)
- [Guide VPS OVHcloud](https://docs.ovhcloud.com/fr/vps/)

### Code Source
- [Module VPS](packages/manager/modules/vps/src)
- [App VPS](packages/manager/apps/vps/src)
- [UI Kit](packages/manager-ui-kit/src)

### Design
- [OVH Design System](https://ovh.github.io/design-system/)

---

*Document généré le 27 janvier 2026 - Version 1.0*

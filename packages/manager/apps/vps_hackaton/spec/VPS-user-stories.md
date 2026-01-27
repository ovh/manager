# Plan de Découpage - User Stories VPS 2025

**Version** : 1.0  
**Date** : 27 janvier 2026  
**Référence** : [VPS-functional-specification.md](VPS-functional-specification.md)  
**Estimation totale** : ~45-55 jours de développement

---

## Vue d'ensemble des Lots (Epics)

| Epic | Nom | Priorité | Estimation | Dépendances |
|------|-----|----------|------------|-------------|
| E1 | Liste des VPS | Must | 5-6 jours | - |
| E2 | Dashboard VPS | Must | 8-10 jours | E1 |
| E3 | Actions VPS de base | Must | 7-9 jours | E2 |
| E4 | Réinstallation (Rebuild) | Must | 5-6 jours | E2 |
| E5 | Gestion des Snapshots | Should | 5-6 jours | E2 |
| E6 | Sauvegarde Veeam | Should | 4-5 jours | E2 |
| E7 | Backup Storage | Should | 3-4 jours | E2 |
| E8 | Monitoring | Should | 4-5 jours | E2 |
| E9 | Migration 2020→2025 | Could | 3-4 jours | E2 |
| E10 | Gestion du Service | Must | 3-4 jours | E2 |

---

## Epic 1 : Liste des VPS

**Objectif** : Permettre à l'utilisateur de visualiser l'ensemble de ses VPS  
**Durée totale estimée** : 5-6 jours

### User Stories

#### US-1.1 : Affichage de la liste des VPS
**En tant qu'** utilisateur connecté  
**Je veux** voir la liste de tous mes VPS  
**Afin de** avoir une vue d'ensemble de mon infrastructure  

**Critères d'acceptation** :
- [ ] La liste affiche tous les VPS du compte
- [ ] Les colonnes affichées : nom, état, modèle, datacenter, IP, expiration
- [ ] Un loader s'affiche pendant le chargement
- [ ] Un message "Aucun VPS" s'affiche si la liste est vide

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-001

---

#### US-1.2 : Indicateurs d'état visuels
**En tant qu'** utilisateur  
**Je veux** voir l'état de chaque VPS avec un code couleur  
**Afin de** identifier rapidement les VPS nécessitant attention  

**Critères d'acceptation** :
- [ ] Badge vert pour "running"
- [ ] Badge orange pour "rebooting", "installing", "backuping", "upgrading", "rescued"
- [ ] Badge rouge pour "stopped", "maintenance", "stopping"
- [ ] L'état se rafraîchit automatiquement

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-002

---

#### US-1.3 : Tri et filtrage de la liste
**En tant qu'** utilisateur avec plusieurs VPS  
**Je veux** pouvoir trier et filtrer la liste  
**Afin de** trouver rapidement un VPS spécifique  

**Critères d'acceptation** :
- [ ] Tri par colonne (nom, état, datacenter, expiration)
- [ ] Filtre par texte (recherche dans le nom)
- [ ] Filtre par état
- [ ] Pagination fonctionnelle (10, 25, 50 éléments)

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-001, SPEC-VPS-003

---

#### US-1.4 : Navigation vers le dashboard
**En tant qu'** utilisateur  
**Je veux** cliquer sur un VPS pour accéder à son dashboard  
**Afin de** gérer ce VPS en détail  

**Critères d'acceptation** :
- [ ] Clic sur la ligne ouvre le dashboard
- [ ] L'URL contient le serviceName
- [ ] Breadcrumb mis à jour

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-003

---

#### US-1.5 : Page d'onboarding sans VPS
**En tant qu'** nouvel utilisateur sans VPS  
**Je veux** voir une page d'accueil engageante  
**Afin de** comprendre comment commander un VPS  

**Critères d'acceptation** :
- [ ] Illustration et message explicatif
- [ ] Bouton CTA "Commander un VPS"
- [ ] Redirection vers la page de commande

**Estimation** : 0.5 jour  
**Specs** : Section 5.3 (États vides)

---

## Epic 2 : Dashboard VPS

**Objectif** : Afficher les informations détaillées et permettre la configuration d'un VPS  
**Durée totale estimée** : 8-10 jours

### User Stories

#### US-2.1 : Tuile Informations Générales
**En tant qu'** utilisateur sur le dashboard  
**Je veux** voir les informations principales de mon VPS  
**Afin de** connaître ses caractéristiques  

**Critères d'acceptation** :
- [ ] Affichage : nom, service, modèle, vCores, RAM, stockage, datacenter, OS
- [ ] État du VPS avec badge coloré
- [ ] Données chargées depuis l'API /vps/{serviceName}

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-010

---

#### US-2.2 : Tuile Configuration
**En tant qu'** utilisateur  
**Je veux** voir et modifier la configuration de mon VPS  
**Afin de** personnaliser son fonctionnement  

**Critères d'acceptation** :
- [ ] Affichage : nom d'affichage, monitoring SLA, keymap
- [ ] Bouton "Modifier" ouvre une modale
- [ ] Modification du nom d'affichage via API PUT
- [ ] Modification du monitoring SLA
- [ ] Modification du keymap KVM

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-011

---

#### US-2.3 : Tuile Réseau
**En tant qu'** utilisateur  
**Je veux** voir les informations réseau de mon VPS  
**Afin de** configurer mes accès et DNS  

**Critères d'acceptation** :
- [ ] Affichage IPv4 principale avec bouton copier
- [ ] Affichage IPv6 (si disponible)
- [ ] Liste des IPs additionnelles
- [ ] Reverse DNS avec possibilité de modification
- [ ] Gateway et MAC address

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-012

---

#### US-2.4 : Tuile Options
**En tant qu'** utilisateur  
**Je veux** voir l'état de mes options souscrites  
**Afin de** gérer mes services additionnels  

**Critères d'acceptation** :
- [ ] Section Snapshot : état, date, actions
- [ ] Section Veeam : état, lien vers gestion
- [ ] Section Backup Storage : état, quota, lien
- [ ] Section Disque additionnel : état, capacité
- [ ] Boutons "Commander" pour options non souscrites

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-013

---

#### US-2.5 : Tuile Abonnement
**En tant qu'** utilisateur  
**Je veux** voir les informations de facturation de mon VPS  
**Afin de** gérer mon abonnement  

**Critères d'acceptation** :
- [ ] Date de création
- [ ] Date d'expiration
- [ ] Mode de renouvellement
- [ ] Lien vers gestion du renouvellement
- [ ] Lien vers engagement (commitment)

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-103

---

#### US-2.6 : Bandeau de migration
**En tant qu'** utilisateur avec un VPS ancienne gamme  
**Je veux** être informé de la possibilité de migrer  
**Afin de** bénéficier de la nouvelle gamme 2025  

**Critères d'acceptation** :
- [ ] Bandeau affiché uniquement si migration disponible
- [ ] Message explicatif avec avantages
- [ ] Bouton "Migrer" vers le flux de migration
- [ ] Possibilité de masquer temporairement

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-070

---

#### US-2.7 : Menu d'actions rapides
**En tant qu'** utilisateur  
**Je veux** accéder rapidement aux actions principales  
**Afin de** gagner du temps  

**Critères d'acceptation** :
- [ ] Tuile "Raccourcis" avec boutons d'actions
- [ ] Actions : Redémarrer, Mode Rescue, Réinstaller, Console KVM
- [ ] Actions contextuelles selon l'état du VPS
- [ ] Boutons désactivés si action impossible

**Estimation** : 1 jour  
**Specs** : Section 5.2 (Wireframe)

---

## Epic 3 : Actions VPS de base

**Objectif** : Permettre les opérations de maintenance courantes  
**Durée totale estimée** : 7-9 jours

### User Stories

#### US-3.1 : Redémarrage du VPS
**En tant qu'** utilisateur  
**Je veux** redémarrer mon VPS  
**Afin d'** appliquer des modifications ou résoudre un problème  

**Critères d'acceptation** :
- [ ] Bouton "Redémarrer" accessible depuis le dashboard
- [ ] Modale de confirmation avec avertissement
- [ ] Appel API POST /vps/{serviceName}/reboot
- [ ] Toast de confirmation "Redémarrage en cours"
- [ ] Polling de l'état jusqu'à "running"
- [ ] Gestion erreur si tâche déjà en cours

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-020

---

#### US-3.2 : Redémarrage en mode Rescue
**En tant qu'** utilisateur  
**Je veux** démarrer mon VPS en mode rescue  
**Afin de** dépanner ou récupérer des données  

**Critères d'acceptation** :
- [ ] Modale avec explication du mode rescue
- [ ] Option pour générer un nouveau mot de passe
- [ ] Modification du netbootMode via API PUT
- [ ] Redémarrage automatique après modification
- [ ] Envoi des credentials par email
- [ ] Message indiquant comment sortir du mode rescue

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-021

---

#### US-3.3 : Arrêt du VPS
**En tant qu'** utilisateur  
**Je veux** arrêter mon VPS  
**Afin de** l'éteindre temporairement  

**Critères d'acceptation** :
- [ ] Bouton "Arrêter" (visible uniquement si VPS running)
- [ ] Modale d'avertissement sur la perte de service
- [ ] Appel API POST /vps/{serviceName}/stop
- [ ] État passe à "stopping" puis "stopped"

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-022

---

#### US-3.4 : Démarrage du VPS
**En tant qu'** utilisateur  
**Je veux** démarrer mon VPS arrêté  
**Afin de** le remettre en service  

**Critères d'acceptation** :
- [ ] Bouton "Démarrer" (visible uniquement si VPS stopped)
- [ ] Appel API POST /vps/{serviceName}/start
- [ ] État passe à "running"

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-023

---

#### US-3.5 : Accès console KVM
**En tant qu'** utilisateur  
**Je veux** accéder à la console de mon VPS  
**Afin de** le dépanner ou configurer  

**Critères d'acceptation** :
- [ ] Bouton "Console KVM" ouvre une modale
- [ ] Choix entre console web et VNC externe
- [ ] Appel API POST /vps/{serviceName}/getConsoleUrl
- [ ] Affichage iframe avec la console ou lien externe
- [ ] Bouton copier l'URL de la console
- [ ] Instructions pour client VNC externe

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-026

---

#### US-3.6 : Réinitialisation mot de passe root
**En tant qu'** utilisateur  
**Je veux** réinitialiser le mot de passe root  
**Afin de** récupérer l'accès à mon VPS  

**Critères d'acceptation** :
- [ ] Action accessible depuis le menu
- [ ] Modale de confirmation
- [ ] Appel API POST /vps/{serviceName}/setPassword
- [ ] Message indiquant l'envoi par email
- [ ] Polling de la tâche asynchrone

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-027

---

## Epic 4 : Réinstallation (Rebuild)

**Objectif** : Permettre la réinstallation du VPS avec une nouvelle image  
**Durée totale estimée** : 5-6 jours

### User Stories

#### US-4.1 : Liste des images disponibles
**En tant qu'** utilisateur  
**Je veux** voir les images système disponibles  
**Afin de** choisir celle à installer  

**Critères d'acceptation** :
- [ ] Appel API GET /vps/{serviceName}/images/available
- [ ] Affichage par catégorie (Linux, Windows, Applications)
- [ ] Affichage nom, description, version
- [ ] Filtrage par texte
- [ ] Image actuelle mise en évidence

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-024

---

#### US-4.2 : Sélection de la clé SSH
**En tant qu'** utilisateur  
**Je veux** choisir ou saisir une clé SSH  
**Afin de** me connecter de manière sécurisée après réinstallation  

**Critères d'acceptation** :
- [ ] Liste des clés SSH depuis GET /me/sshKey
- [ ] Possibilité de sélectionner une clé existante
- [ ] Possibilité de saisir une clé publique manuellement
- [ ] Validation du format de la clé
- [ ] Option "Pas de clé SSH" avec avertissement

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-024

---

#### US-4.3 : Options avancées de réinstallation
**En tant qu'** utilisateur avancé  
**Je veux** configurer les options de réinstallation  
**Afin de** personnaliser l'installation  

**Critères d'acceptation** :
- [ ] Option "Ne pas envoyer le mot de passe" (si clé SSH)
- [ ] Option "Installer RTM" (Real Time Monitoring)
- [ ] Affichage conditionnel selon l'image choisie

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-024

---

#### US-4.4 : Confirmation et exécution rebuild
**En tant qu'** utilisateur  
**Je veux** confirmer et lancer la réinstallation  
**Afin de** réinstaller mon VPS  

**Critères d'acceptation** :
- [ ] Récapitulatif des choix (image, clé SSH, options)
- [ ] Avertissements clairs sur la perte de données
- [ ] Checkbox de confirmation obligatoire
- [ ] Appel API POST /vps/{serviceName}/rebuild
- [ ] Polling de la tâche avec progression
- [ ] Message de succès avec instructions

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-024

---

## Epic 5 : Gestion des Snapshots

**Objectif** : Permettre la sauvegarde et restauration via snapshots  
**Durée totale estimée** : 5-6 jours

### User Stories

#### US-5.1 : Affichage état snapshot
**En tant qu'** utilisateur  
**Je veux** voir l'état de mon option snapshot  
**Afin de** savoir si j'ai un snapshot disponible  

**Critères d'acceptation** :
- [ ] Affichage "Non souscrit" avec bouton commander
- [ ] Si souscrit : date création, description du snapshot
- [ ] Si pas de snapshot : message et bouton créer
- [ ] Indicateur d'opération en cours

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-030

---

#### US-5.2 : Création de snapshot
**En tant qu'** utilisateur  
**Je veux** créer un snapshot de mon VPS  
**Afin de** sauvegarder son état actuel  

**Critères d'acceptation** :
- [ ] Bouton "Créer" (désactivé si snapshot existe)
- [ ] Modale avec champ description optionnel
- [ ] Appel API POST /vps/{serviceName}/createSnapshot
- [ ] Polling de la tâche
- [ ] Message de succès

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-030

---

#### US-5.3 : Restauration de snapshot
**En tant qu'** utilisateur  
**Je veux** restaurer mon VPS depuis le snapshot  
**Afin de** revenir à un état antérieur  

**Critères d'acceptation** :
- [ ] Bouton "Restaurer" (si snapshot existe)
- [ ] Modale d'avertissement sur la perte de données
- [ ] Checkbox de confirmation
- [ ] Appel API POST /vps/{serviceName}/snapshot/revert
- [ ] Polling et message de succès

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-031

---

#### US-5.4 : Suppression de snapshot
**En tant qu'** utilisateur  
**Je veux** supprimer mon snapshot  
**Afin de** pouvoir en créer un nouveau  

**Critères d'acceptation** :
- [ ] Bouton "Supprimer"
- [ ] Modale de confirmation
- [ ] Appel API DELETE /vps/{serviceName}/snapshot
- [ ] Mise à jour de l'interface

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-032

---

#### US-5.5 : Téléchargement de snapshot
**En tant qu'** utilisateur  
**Je veux** télécharger mon snapshot  
**Afin de** conserver une copie locale  

**Critères d'acceptation** :
- [ ] Bouton "Télécharger"
- [ ] Appel API GET /vps/{serviceName}/snapshot/download
- [ ] Affichage URL temporaire (24h)
- [ ] Instructions de téléchargement

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-033

---

## Epic 6 : Sauvegarde Veeam

**Objectif** : Permettre la gestion des sauvegardes automatisées Veeam  
**Durée totale estimée** : 4-5 jours

### User Stories

#### US-6.1 : Affichage état Veeam
**En tant qu'** utilisateur  
**Je veux** voir l'état de mon option Veeam  
**Afin de** savoir si mes sauvegardes sont actives  

**Critères d'acceptation** :
- [ ] Affichage "Non souscrit" avec bouton commander
- [ ] Si souscrit : heure de backup, dernier backup
- [ ] Lien vers la page de gestion détaillée

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-040

---

#### US-6.2 : Liste des points de restauration
**En tant qu'** utilisateur  
**Je veux** voir mes points de restauration Veeam  
**Afin de** choisir lequel restaurer  

**Critères d'acceptation** :
- [ ] Liste des points avec date/heure
- [ ] État de chaque point (available, restored)
- [ ] Pagination si nombreux points

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-041

---

#### US-6.3 : Restauration depuis Veeam
**En tant qu'** utilisateur  
**Je veux** restaurer mon VPS depuis un point Veeam  
**Afin de** récupérer mes données  

**Critères d'acceptation** :
- [ ] Sélection du point de restauration
- [ ] Choix du type : fichiers (mount) ou complète (full)
- [ ] Modale de confirmation avec avertissements
- [ ] Appel API POST /vps/{serviceName}/automatedBackup/restore
- [ ] Polling et affichage résultat

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-041

---

#### US-6.4 : Modification horaire backup
**En tant qu'** utilisateur  
**Je veux** modifier l'heure de backup automatique  
**Afin de** l'adapter à mon usage  

**Critères d'acceptation** :
- [ ] Sélection de l'heure (time picker)
- [ ] Appel API POST /vps/{serviceName}/automatedBackup/reschedule
- [ ] Confirmation de la modification

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-040

---

#### US-6.5 : Démontage backup monté
**En tant qu'** utilisateur  
**Je veux** démonter un backup monté  
**Afin de** libérer les ressources  

**Critères d'acceptation** :
- [ ] Affichage si backup monté (attachedBackup)
- [ ] Bouton "Démonter"
- [ ] Appel API POST /vps/{serviceName}/automatedBackup/detachBackup

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-040

---

## Epic 7 : Backup Storage

**Objectif** : Permettre la gestion de l'espace FTP de sauvegarde  
**Durée totale estimée** : 3-4 jours

### User Stories

#### US-7.1 : Affichage informations Backup Storage
**En tant qu'** utilisateur  
**Je veux** voir les informations de mon backup storage  
**Afin de** connaître son état et utilisation  

**Critères d'acceptation** :
- [ ] Affichage : quota, utilisation, URL FTP
- [ ] Identifiants de connexion
- [ ] Protocoles disponibles (FTP, FTPS, NFS, CIFS)

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-050

---

#### US-7.2 : Réinitialisation mot de passe FTP
**En tant qu'** utilisateur  
**Je veux** réinitialiser le mot de passe FTP  
**Afin de** récupérer l'accès  

**Critères d'acceptation** :
- [ ] Bouton "Réinitialiser mot de passe"
- [ ] Appel API POST /vps/{serviceName}/backupftp/password
- [ ] Affichage du nouveau mot de passe ou envoi email

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-050

---

#### US-7.3 : Gestion des ACL
**En tant qu'** utilisateur  
**Je veux** gérer les autorisations d'accès  
**Afin de** contrôler qui peut accéder au backup  

**Critères d'acceptation** :
- [ ] Liste des ACL existantes
- [ ] Ajout d'une ACL (IP + protocoles)
- [ ] Suppression d'une ACL
- [ ] Validation du format IP/CIDR

**Estimation** : 1.5-2 jours  
**Specs** : SPEC-VPS-051

---

## Epic 8 : Monitoring

**Objectif** : Afficher les métriques de performance du VPS  
**Durée totale estimée** : 4-5 jours

### User Stories

#### US-8.1 : Graphiques CPU et mémoire
**En tant qu'** utilisateur  
**Je veux** voir l'utilisation CPU et mémoire  
**Afin de** surveiller les performances  

**Critères d'acceptation** :
- [ ] Graphique CPU (usage en %)
- [ ] Graphique mémoire (usage en Go)
- [ ] Sélecteur de période (jour, semaine, mois, année)
- [ ] Tooltip avec valeurs précises

**Estimation** : 2 jours  
**Specs** : SPEC-VPS-060

---

#### US-8.2 : Graphiques réseau
**En tant qu'** utilisateur  
**Je veux** voir le trafic réseau  
**Afin de** surveiller la bande passante  

**Critères d'acceptation** :
- [ ] Graphique trafic entrant (rx)
- [ ] Graphique trafic sortant (tx)
- [ ] Unités adaptatives (KB/s, MB/s)

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-060

---

#### US-8.3 : Monitoring disque
**En tant qu'** utilisateur  
**Je veux** voir l'utilisation disque  
**Afin d'** anticiper les problèmes d'espace  

**Critères d'acceptation** :
- [ ] Graphique utilisation disque
- [ ] Affichage espace libre/utilisé
- [ ] Alerte visuelle si seuil critique

**Estimation** : 1-2 jours  
**Specs** : SPEC-VPS-061

---

## Epic 9 : Migration 2020→2025

**Objectif** : Permettre la migration vers la nouvelle gamme  
**Durée totale estimée** : 3-4 jours

### User Stories

#### US-9.1 : Affichage état migration
**En tant qu'** utilisateur avec VPS 2020  
**Je veux** savoir si je peux migrer  
**Afin de** bénéficier de la nouvelle gamme  

**Critères d'acceptation** :
- [ ] Appel API GET /vps/{serviceName}/migration2020
- [ ] Affichage état : available, planned, ongoing, done
- [ ] Détails du plan de destination proposé

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-070

---

#### US-9.2 : Demande de migration
**En tant qu'** utilisateur  
**Je veux** demander la migration  
**Afin de** passer à la gamme 2025  

**Critères d'acceptation** :
- [ ] Présentation des avantages de la nouvelle gamme
- [ ] Choix du plan de destination
- [ ] Appel API POST /vps/{serviceName}/migration2020
- [ ] Confirmation de la mise en file d'attente

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-070

---

#### US-9.3 : Planification de la migration
**En tant qu'** utilisateur  
**Je veux** choisir la date de migration  
**Afin de** planifier la maintenance  

**Critères d'acceptation** :
- [ ] Sélection date/heure (date picker)
- [ ] Contraintes de créneaux disponibles
- [ ] Appel API PUT /vps/{serviceName}/migration2020
- [ ] Email de confirmation

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-070

---

#### US-9.4 : Annulation de migration
**En tant qu'** utilisateur  
**Je veux** annuler ma demande de migration  
**Afin de** revenir sur ma décision  

**Critères d'acceptation** :
- [ ] Bouton "Annuler" (si état planned)
- [ ] Modale de confirmation
- [ ] Appel API DELETE /vps/{serviceName}/migration2020

**Estimation** : 0.5 jour  
**Specs** : SPEC-VPS-070

---

## Epic 10 : Gestion du Service

**Objectif** : Permettre la gestion administrative du VPS  
**Durée totale estimée** : 3-4 jours

### User Stories

#### US-10.1 : Résiliation du VPS
**En tant qu'** utilisateur  
**Je veux** résilier mon VPS  
**Afin de** mettre fin à mon abonnement  

**Critères d'acceptation** :
- [ ] Bouton "Résilier" dans les actions
- [ ] Modale avec motif de résiliation
- [ ] Avertissements sur les conséquences
- [ ] Appel API POST /vps/{serviceName}/terminate
- [ ] Email de confirmation envoyé
- [ ] Indication du délai effectif

**Estimation** : 1.5 jours  
**Specs** : SPEC-VPS-100

---

#### US-10.2 : Changement de contacts
**En tant qu'** utilisateur  
**Je veux** modifier les contacts du VPS  
**Afin de** déléguer la gestion  

**Critères d'acceptation** :
- [ ] Affichage contacts actuels (admin, tech, billing)
- [ ] Modification via modale
- [ ] Validation NIC handle
- [ ] Appel API POST /vps/{serviceName}/changeContact
- [ ] Email de confirmation aux parties

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-102

---

#### US-10.3 : Souscription engagement
**En tant qu'** utilisateur  
**Je veux** souscrire un engagement  
**Afin de** bénéficier d'une réduction  

**Critères d'acceptation** :
- [ ] Affichage des options (12 mois, 24 mois)
- [ ] Comparatif prix mensuel vs engagé
- [ ] Redirection vers bon de commande
- [ ] Mise à jour après souscription

**Estimation** : 1 jour  
**Specs** : SPEC-VPS-103

---

## Récapitulatif des Estimations

### Par priorité

| Priorité | Epics | Durée estimée |
|----------|-------|---------------|
| **Must** | E1, E2, E3, E4, E10 | 28-35 jours |
| **Should** | E5, E6, E7, E8 | 16-20 jours |
| **Could** | E9 | 3-4 jours |

### Planning suggéré (sprints de 2 semaines)

| Sprint | Contenu | Durée |
|--------|---------|-------|
| Sprint 1 | E1 (Liste) + US-2.1 à US-2.3 | 2 semaines |
| Sprint 2 | E2 suite (Dashboard) + E3 début | 2 semaines |
| Sprint 3 | E3 suite + E4 (Rebuild) | 2 semaines |
| Sprint 4 | E5 (Snapshots) + E10 (Service) | 2 semaines |
| Sprint 5 | E6 (Veeam) + E7 (Backup Storage) | 2 semaines |
| Sprint 6 | E8 (Monitoring) + E9 (Migration) | 2 semaines |

**Durée totale projet : ~12 semaines (3 mois)**

---

## Notes et Hypothèses

### Hypothèses de calcul
- 1 jour = 1 développeur front-end
- Inclut : développement, tests unitaires, code review
- **Non inclus** : tests E2E, recette, documentation utilisateur

### Facteurs de risque
- Complexité API : certaines APIs peuvent nécessiter plus de gestion d'erreurs
- Composants UI : réutilisation des composants existants supposée
- Dépendances backend : APIs supposées stables et documentées

### Ressources recommandées
- 1 développeur front-end senior
- 1 développeur front-end junior (support)
- 0.5 UX designer (pour validation)
- 0.5 QA (pour recette continue)

---

*Document généré le 27 janvier 2026*

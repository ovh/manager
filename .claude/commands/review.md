name: /review
description: >
  Analyse une pull request GitHub en profondeur avec validation des commentaires
  avant envoi. Se concentre sur les lignes modifiées avec critères d'analyse
  de qualité de code et sécurité.

parameters:
  - name: pr_url
    description: URL de la pull request GitHub à reviewer
    required: true
  - name: auto_approve
    description: Approuver automatiquement si aucun problème critique (défaut: false)
    required: false
    default: false

usage: >
  /review https://github.com/ovh/manager/pull/123
  /review https://github.com/ovh/manager/pull/123 --auto_approve=true

workflow:
  1. Vérification de l'existance de la PR
  2. Récupération locale de la PR
  3. Analyse des modifications de dépendances
  4. Analyse détaillée des fichiers selon leur type
  5. Génération du rapport de review structuré
  6. Validation interactive avec aperçu
  7. Envoi de la review sur GitHub
  8. Nettoyage des fichiers temporaires

analysis_criteria:
  security:
    - Détection d'injection XSS (innerHTML, dangerouslySetInnerHTML)
    - Validation des entrées utilisateur
    - Manipulation DOM sécurisée
    - Analyse des nouvelles dépendances suspectes
  
  code_quality:
    - Console statements en production
    - Types TypeScript stricts (any, @ts-ignore)
    - Patterns de performance React (memo, useCallback, useMemo)
    - Complexité du code et lisibilité
  
  architecture:
    - Breaking changes détectés (API, interfaces)
    - Impact analysis sur autres fichiers
    - Cohérence avec patterns existants du projet
    - Respect des conventions OVH/Manager
  
  ovh_specific:
    - Usage correct des composants ODS
    - Patterns manager-react-components
    - Conventions i18n (clés traduction)
    - Routing et navigation cohérents
  
  user_experience:
    - Accessibilité (ARIA, contraste, navigation clavier)
    - Gestion des états d'erreur et loading
    - Performance frontend (bundle, lazy loading)
    - UX patterns cohérents

priority_levels:
  P0: "🚨 Bloquant - doit être corrigé avant merge"
  P1: "⚠️ Important - fortement recommandé"
  P2: "💡 Suggestion - amélioration possible"
  INFO: "ℹ️ Information - point d'attention"

implementation:
  steps:
    - name: "Vérification PR"
      description: "Vérifier que la PR existe et est ouverte"
      
    - name: "Checkout local"
      description: "Récupérer la PR localement pour analyse"
      
    - name: "Analyse dépendances"
      description: "Détecter les modifications de package.json/yarn.lock"
      
    - name: "Analyse contextuelle"
      description: "Examiner les changements dans leur contexte architectural"
      
    - name: "Analyse par fichier"
      description: "Review détaillée selon type (JS/TS/CSS) avec suggestions concrètes"
      
    - name: "Détection impact"
      description: "Identifier les breaking changes et fichiers potentiellement affectés"
      
    - name: "Génération commentaires ciblés"
      description: "Créer commentaires inline avec exemples avant/après"
      
    - name: "Validation interactive"
      description: "Afficher aperçu, présenter les 5 options de validation_options et demander choix utilisateur"
      
    - name: "Envoi commentaires ciblés"
      description: "Poster commentaires inline + review globale sur GitHub"
      
    - name: "Nettoyage"
      description: "Supprimer les fichiers temporaires"

validation_options:
  1: "REQUEST_CHANGES - Pour changements obligatoires"
  2: "COMMENT - Pour suggestions et remarques"
  3: "APPROVE - Pour approuver la PR"
  4: "EDIT - Modifier les commentaires avant envoi"
  5: "CANCEL - Annuler la review"

output_format:
  - Commentaires inline sur GitHub par ligne de code concernée
  - Suggestions concrètes avec exemples avant/après
  - Détection breaking changes avec impact analysis
  - Recommandations spécifiques OVH/Manager patterns
  - Liens vers documentation et guidelines du projet
  - Review globale avec synthèse priorisée

notes:
  - Analyse contextuelle et impact des changements
  - Commentaires inline ciblés avec gh api
  - Suggestions actionables avec exemples concrets
  - Détection patterns OVH/Manager spécifiques
  - Validation interactive obligatoire : TOUJOURS afficher les 5 options de validation_options
  - Focus qualité, sécurité, architecture et UX
  - N'affiche pas Bash(COMMAND) dans le retour console terminal de l'UI Claude
COURTET Tom, CERVASI Ewen, FUMA Jordan, DUQUAIRE Mathieu


# 🎯 Workshop Outil d'Insertion - Plateforme d'Évaluation Adaptative


### 🎯 Fonctionnalités principales

- **Questionnaires adaptatifs** avec ajustement dynamique de la difficulté
- **Système de notation Elo** pour un suivi précis des compétences
- **Questions à réponses ouvertes** (Free Text) avec IA intégrée
- **Interface d'administration** pour la gestion des questions
- **Support multi-formats** : QCM et réponses libres

---

## 🧠 Algorithmes d'Adaptabilité

### 1. 🎲 Algorithme de Difficulté Progressive

#### Principe de fonctionnement
L'algorithme ajuste dynamiquement la difficulté des questions selon les performances de l'utilisateur :

```
Difficulté initiale = 3 (niveau moyen)

Pour chaque réponse :
├── Réponse correcte → Difficulté + 1 (max: 5)
└── Réponse incorrecte → Difficulté - 1 (min: 1)
```

#### Mécanisme de sélection
1. **Démarrage** : Question aléatoire de difficulté 3
2. **Adaptation** : Ajustement +1/-1 selon la réponse
3. **Recherche** : Sélection d'une question disponible au niveau cible
4. **Fallback** : Si aucune question disponible, recherche par proximité
5. **Anti-doublon** : Exclusion des questions déjà posées

#### Avantages
- Convergence rapide vers le niveau réel
- Maintien de l'engagement (ni trop facile, ni trop difficile)
- Évaluation progressive et précise

### 2. 🏆 Système de Notation Elo

#### Principe mathématique
Adaptation du système Elo des échecs pour l'évaluation pédagogique :

```
Nouveau_Elo = Ancien_Elo + K × (Score_réel - Score_attendu)

Où :
- K = 32 × (difficulté / 3)  // Facteur d'ajustement
- Score_réel = 1 (correct) ou 0 (incorrect)
- Score_attendu = f(difficulté, elo_actuel)
```

#### Calcul du score attendu
```javascript
expectedScore = 1 / (1 + Math.pow(10, (difficultyElo - currentElo) / 400))
```

#### Caractéristiques
- **Plage** : 400 - 2400 points
- **Démarrage** : 1000 points (niveau moyen)
- **Historique** : Sauvegarde pour analyse et retour en arrière
- **Adaptation** : Plus la difficulté est élevée, plus l'impact est important

### 3. 🎯 Sélection Intelligente par Elo

L'algorithme sélectionne les questions les plus appropriées selon le niveau Elo :

```
Niveau Elo → Difficulté recommandée
├── < 800   → Difficulté 1-2
├── 800-1200 → Difficulté 2-3
├── 1200-1600 → Difficulté 3-4
└── > 1600   → Difficulté 4-5
```

---

## 🏗️ Architecture Technique

### Stack technologique
- **Frontend** : Nuxt.js 3 + Vue.js 3 + TypeScript
- **Styling** : Tailwind CSS + Nuxt UI
- **State Management** : Pinia
- **IA** : OpenAI API (correction automatique)
- **Validation** : Zod
- **Tracking** : xAPI (Tin Can API)

### Structure des stores Pinia

#### 📊 `questions.ts` - Gestion des questions
```typescript
interface Question {
  id: number
  type: 'qcm' | 'free_text'
  question: string
  options?: string[]
  correctAnswer?: number
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string
}
```

**Fonctions clés :**
- `initializeAdaptiveSystem()` : Initialisation du parcours adaptatif
- `nextAdaptiveQuestion(wasCorrect)` : Sélection de la question suivante
- `getRandomQuestionByDifficulty()` : Sélection par niveau
- `selectQuestionForElo()` : Sélection basée sur le score Elo

#### 🏆 `elo.ts` - Système de notation
```typescript
interface EloState {
  elo: number          // Score actuel
  eloHistory: number[] // Historique des scores
}
```

**Fonctions clés :**
- `updateElo(difficulty, isCorrect)` : Mise à jour du score
- `calculateExpectedScore()` : Calcul de probabilité
- `resetElo()` : Réinitialisation

#### 🔤 `gaptext.ts` - Questions à texte lacunaire
Gestion spécialisée pour les exercices de complétion avec IA.

#### 📈 `xapi.ts` - Suivi des apprentissages
Intégration xAPI pour l'analyse des parcours d'apprentissage.

---

## 🎮 Types d'Évaluations

### 1. **Questionnaire Adaptatif Classique**
- Ajustement de difficulté en temps réel
- Questions QCM et réponses libres
- Suivi Elo intégré

### 2. **Gap Text (Texte à Trous)**
- Exercices de complétion intelligents
- Correction automatique par IA
- Analyse sémantique des réponses

### 3. **Évaluation par Niveau Elo**
- Sélection de questions basée sur le score
- Progression personnalisée
- Historique détaillé

---

## 👨‍💼 Interface d'Administration

L'interface admin (`/admin`) permet :
- **CRUD complet** des questions
- **Filtrage** par catégorie et difficulté
- **Import/Export** JSON
- **Validation** automatique des données
- **Recherche** avancée
- **Prévisualisation** en temps réel

---

## 📊 Suivi et Analytics

### xAPI Integration
- Tracking des interactions utilisateur
- Analyse des parcours d'apprentissage
- Métriques de performance
- Données exportables

---

## 🚀 Installation et Configuration

### Prérequis
- Node.js 18+ 
- npm, pnpm, yarn ou bun
- Clé API OpenAI (optionnelle, pour les questions à réponse libre)

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd Workshop-Outil-Insertion

# Installer les dépendances
npm install
# ou
pnpm install
# ou
yarn install
# ou
bun install
```

### Configuration

#### Variables d'environnement
Créer un fichier `.env` à la racine :
```env
# OpenAI API (optionnel)
OPENAI_API_KEY=your_openai_api_key_here

# Configuration xAPI (optionnel)
XAPI_ENDPOINT=https://your-lrs-endpoint.com
XAPI_USERNAME=your_username
XAPI_PASSWORD=your_password
```

#### Configuration des questions
Les questions sont stockées dans `/public/questions.json` :
```json
{
  "questions": [
    {
      "id": 1,
      "type": "qcm",
      "question": "Quelle est la capitale de la France ?",
      "options": ["Londres", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2,
      "difficulty": 2,
      "category": "Géographie"
    }
  ]
}
```

## Development Server

<!-- 
Étape 2 : Démarrage du serveur de développement
Cette étape permet de démarrer le serveur de développement sur l'adresse http://localhost:3000.
-->

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

---

## 🗺️ Routes et Navigation

### Pages principales
- **`/`** - Page d'accueil avec sélection du type d'évaluation
- **`/questionnaire`** - Interface de questionnaire adaptatif
- **`/gaptext`** - Exercices de texte à trous avec IA
- **`/admin`** - Interface d'administration des questions
- **`/createEvaluation`** - Création d'évaluations personnalisées

### API Endpoints
- **`POST /api/questions`** - Gestion des questions (CRUD)
- **`POST /api/openai`** - Correction automatique par IA
- **`POST /api/xapi`** - Envoi des données xAPI

---

## 📚 Exemples d'Utilisation

### 1. Création d'un questionnaire adaptatif
```typescript
// Dans un composant Vue
import { useQuestionStore } from '~/stores/questions'
import { useEloStore } from '~/stores/elo'

const questionStore = useQuestionStore()
const eloStore = useEloStore()

// Initialiser le système adaptatif
questionStore.initializeAdaptiveSystem()

// Après chaque réponse
function handleAnswer(isCorrect: boolean) {
  // Mettre à jour le score Elo
  eloStore.updateElo(currentDifficulty, isCorrect)
  
  // Sélectionner la prochaine question
  questionStore.nextAdaptiveQuestion(isCorrect)
}
```

### 2. Utilisation du système Elo
```typescript
// Obtenir une question adaptée au niveau Elo
const currentElo = eloStore.currentElo
const adaptedQuestion = questionStore.selectQuestionForElo(currentElo)

// Suivre l'évolution du score
console.log('Historique Elo:', eloStore.eloHistory)
```

### 3. Gestion des questions Gap Text
```typescript
// Correction automatique avec IA
const gapTextStore = useGapTextStore()

const result = await gapTextStore.checkAnswerWithAI(
  userAnswer,
  expectedAnswer,
  context
)

if (result.isCorrect) {
  // Réponse correcte
  console.log('Score:', result.score)
}
```

---

## 🔍 Algorithmes en Détail

### Algorithme de Convergence
L'algorithme converge vers le niveau réel de l'utilisateur en moyenne en **5-7 questions** :

1. **Phase d'exploration** (questions 1-3) : Ajustements importants
2. **Phase de convergence** (questions 4-6) : Affinage du niveau
3. **Phase de confirmation** (questions 7+) : Validation du niveau

### Optimisations Implémentées
- **Cache intelligent** : Évite les recalculs coûteux
- **Pré-sélection** : Questions pré-filtrées par difficulté
- **Fallback gracieux** : Gestion des cas limites
- **Anti-pattern** : Évite les séquences prévisibles

---

## 🛠️ Dépannage

### Problèmes courants

#### Questions non chargées
```bash
# Vérifier que le fichier existe
ls public/questions.json

# Vérifier la syntaxe JSON
npx jsonlint public/questions.json
```

#### Erreur OpenAI API
```bash
# Vérifier la clé API
echo $OPENAI_API_KEY

# Tester la connexion
curl -H "Authorization: Bearer $OPENAI_API_KEY" \
     https://api.openai.com/v1/models
```

#### Problèmes de performance
- Limiter le nombre de questions chargées
- Utiliser la pagination pour les grandes listes
- Optimiser les filtres de difficulté

---

## 📊 Métriques et KPI

### Indicateurs de performance
- **Temps de convergence** : Nombre de questions pour atteindre le niveau
- **Précision Elo** : Écart entre niveau estimé et réel
- **Engagement** : Temps passé par question
- **Taux d'abandon** : Pourcentage d'utilisateurs qui quittent

### Analyse des données
```typescript
// Exemple d'analyse des performances
const analytics = {
  averageConvergenceTime: 6.2, // questions
  eloAccuracy: 0.85, // 85% de précision
  averageEngagementTime: 45, // secondes par question
  completionRate: 0.78 // 78% de complétion
}
```

---

## 🕰️ Roadmap

### Version actuelle (v1.0)
- ✅ Algorithme adaptatif de base
- ✅ Système Elo
- ✅ Interface d'administration
- ✅ Questions Gap Text
- ✅ Intégration xAPI

### Prochaines versions
- 🔄 **v1.1** : Amélioration de l'IA de correction
- 🔄 **v1.2** : Analytics avancées et tableaux de bord
- 🔄 **v1.3** : Support multi-langues
- 🔄 **v2.0** : Algorithmes d'apprentissage automatique

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Veuillez :

1. **Fork** le projet
2. Créer une **branche** pour votre fonctionnalité
3. **Commiter** vos changements
4. **Pousser** vers la branche
5. Ouvrir une **Pull Request**

### Standards de code
- Utiliser **TypeScript** pour le typage
- Suivre les conventions **ESLint**
- Ajouter des **tests** pour les nouvelles fonctionnalités
- Documenter les **algorithmes complexes**

---

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

Pour toute question ou problème :
- Ouvrir une **issue** sur GitHub
- Consulter la **documentation** technique
- Contacter l'équipe de développement

---

*Développé avec ❤️ pour l'éducation adaptative et l'évaluation intelligente des compétences.*

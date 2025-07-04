import { defineStore } from 'pinia'
import { loadQuestionsFromFile, loadQuestionsFromStorage } from '~/utils/questionsManager'

// Type pour les questions
// Type représentant une question du questionnaire
// Peut être de type QCM ou texte libre
// Les options et la bonne réponse sont optionnelles pour les questions à réponse libre
type Question = {
  id: number
  type: 'qcm' | 'free_text'
  question: string
  options?: string[]
  correctAnswer?: number
  difficulty: number
  category: string
}

export const useQuestionStore = defineStore('questions', {
  // État du store Pinia pour la gestion des questions
state: () => ({
    // Liste de toutes les questions chargées (depuis le JSON ou le localStorage)
questions: [] as Question[],
    // Questions actuellement sélectionnées pour le parcours (peut évoluer en mode adaptatif)
currentQuestions: [] as Question[], // Maintenant utilisé pour stocker les questions générées dynamiquement
    // Niveau de difficulté courant (utilisé pour l'adaptation du parcours)
currentDifficulty: 3, // Commence toujours à la difficulté moyenne
    // IDs des questions déjà posées (évite les doublons)
usedQuestionIds: [] as number[], // Pour éviter les doublons
    // IDs des questions générées dans l'ordre du parcours adaptatif
adaptiveQuestionIds: [] as number[], // NOUVEAU : IDs des questions générées pour le parcours adaptatif
  }),

  getters: {
    // Retourne le nombre de questions actuellement dans le parcours
 totalQuestions: (state) => state.currentQuestions.length,
  },

  actions: {
    /**
     * Charge toutes les questions disponibles depuis le fichier JSON ou le localStorage
     */
        /**
     * Charge toutes les questions disponibles depuis le fichier JSON ou le localStorage
     * Met à jour la liste des questions du store.
     */
    async loadQuestions() {
      try {
        // D'abord essayer de charger depuis le fichier JSON
        let loadedQuestions = await loadQuestionsFromFile()
        
        // Si pas de questions dans le fichier, essayer le localStorage
        if (loadedQuestions.length === 0) {
          loadedQuestions = loadQuestionsFromStorage()
        }
        
        // Mettre à jour le store avec les questions chargées
        this.questions = loadedQuestions
      } catch (error) {
        console.error('Erreur lors du chargement des questions:', error)
        this.questions = []
      }

      // Si aucune question n'est chargée, utiliser des questions par défaut
      if (this.questions.length === 0) {
        console.warn('Aucune question trouvée, utilisation des questions par défaut')
        this.questions = [
          // Niveau 1 - Très facile
          {
            id: 1,
            type: 'qcm',
            question: "Quelle est la capitale de la France ?",
            options: ["Berlin", "Londres", "Paris", "Madrid"],
            correctAnswer: 2,
            difficulty: 1,
            category: "Géographie"
          },
          // Free text question example 1
          {
            id: 2,
            type: 'free_text',
            question: "Décrivez votre expérience professionnelle en quelques phrases.",
            difficulty: 2,
            category: "Professionnel",
            hint: "Parlez de vos rôles précédents et de vos compétences clés."
          },
          {
            id: 3,
            type: 'qcm',
            question: "Comment s'appelle le verbe à l'infinitif dans la phrase : 'Je mange une pomme' ?",
            options: ["Manger", "Mange", "Mangeons", "Mangé"],
            correctAnswer: 0,
            difficulty: 1,
            category: "Français"
          },
          // Free text question example 2
          {
            id: 4,
            type: 'free_text',
            question: "Quelles sont vos principales motivations pour ce poste ?",
            difficulty: 3,
            category: "Motivation",
            hint: "Mentionnez vos intérêts et objectifs professionnels."
          },
          {
            id: 5,
            type: 'qcm',
            question: "Which of these is a greeting in English?",
            options: ["Hello", "Goodbye", "See you", "Thanks"],
            correctAnswer: 0,
            difficulty: 1,
            category: "Anglais"
          },
          // Niveau 5 - Très difficile
          {
            id: 13,
            type: 'qcm',
            question: "Quelle est la fonction du subjonctif dans la phrase : 'Il faut que tu sois là' ?",
            options: ["Exprimer un souhait", "Exprimer une obligation", "Exprimer une certitude", "Exprimer une réalité"],
            correctAnswer: 1,
            difficulty: 5,
            category: "Français"
          },
          // Free text question example 3
          {
            id: 14,
            type: 'free_text',
            question: "Décrivez une situation où vous avez dû résoudre un problème complexe.",
            difficulty: 4,
            category: "Compétences",
            hint: "Expliquez le problème, vos actions et le résultat obtenu."
          },
          {
            id: 15,
            type: 'qcm',
            question: "Dans Excel, quelle fonction utiliseriez-vous pour trouver la somme d'une plage de cellules?",
            options: ["SUM", "AVERAGE", "COUNT", "VLOOKUP"],
            correctAnswer: 0,
            difficulty: 5,
            category: "Informatique"
          },
          // Exemple de question à réponse libre
          {
            id: 100,
            type: 'free_text',
            question: "Décrivez votre expérience avec les outils bureautiques en quelques phrases.",
            difficulty: 3,
            category: "Informatique"
          }
        ]
      }

      // Sélectionner 5 questions aléatoires pour le questionnaire
      // Initialiser la difficulté et les questions utilisées
      this.currentDifficulty = 3
      this.usedQuestionIds = []
      this.currentQuestions = []
      // Sélectionner la première question de difficulté 3
      const first = this.getRandomQuestionByDifficulty(3)
      if (first) {
        this.currentQuestions.push(first)
        this.usedQuestionIds.push(first.id)
      }
    },

    /**
     * Sélectionne un nombre spécifique de questions aléatoires
     * @param count Nombre de questions à sélectionner
     */
    /**
 * Sélectionne un nombre spécifique de questions aléatoires pour un parcours non adaptatif.
 * La première question est toujours de niveau 3 si possible.
 */
selectRandomQuestions(count: number) {
      // S'assurer qu'on ne demande pas plus de questions qu'il n'en existe
      const maxCount = Math.min(count, this.questions.length)
      // Sélectionner une question de niveau 3 en premier (aléatoire parmi toutes celles de difficulté 3)
      const niveau3Questions = this.questions.filter((q: Question) => q.difficulty === 3)
      let first: Question | undefined = undefined
      if (niveau3Questions.length > 0) {
        first = niveau3Questions[Math.floor(Math.random() * niveau3Questions.length)]
      }
      // Mélanger les questions restantes en excluant celle déjà choisie
      const remaining = this.questions.filter((q: Question) => !first || q.id !== first.id).sort(() => 0.5 - Math.random())
      // Construire la liste finale
      this.currentQuestions = []
      if (first) {
        this.currentQuestions.push(first)
      }
      this.currentQuestions.push(...remaining.slice(0, maxCount - this.currentQuestions.length))
    },
    /**
 * Initialise le système adaptatif :
 * - Remet la difficulté à 3
 * - Vide les historiques
 * - Sélectionne une première question de difficulté 3
 */
initializeAdaptiveSystem() {
      this.currentDifficulty = 3
      this.usedQuestionIds = []
      this.currentQuestions = []
      this.adaptiveQuestionIds = []
      
      // Sélectionner la première question de difficulté 3
      const firstQuestion = this.getRandomQuestionByDifficulty(3, 'all')
      if (firstQuestion) {
        this.currentQuestions.push(firstQuestion)
        this.usedQuestionIds.push(firstQuestion.id)
        this.adaptiveQuestionIds.push(firstQuestion.id)
      }
    },
    // 3. Ajouter une méthode pour obtenir l'ID de la question courante
    /**
     * Obtient l'ID de la question à l'index spécifié dans le parcours adaptatif
     */
    /**
 * Retourne l'ID de la question à l'index donné dans le parcours adaptatif.
 */
getCurrentQuestionId(index: number): number | null {
      if (index >= 0 && index < this.adaptiveQuestionIds.length) {
        return this.adaptiveQuestionIds[index]
      }
      return null
    },

    // 4. Modifier la méthode nextAdaptiveQuestion
    /**
     * Ajoute dynamiquement la prochaine question selon la réponse du joueur
     * @param wasCorrect true si la réponse était correcte
     */
    /**
 * Ajoute dynamiquement la prochaine question selon la réponse de l'utilisateur.
 * Adapte la difficulté à la hausse ou la baisse selon la réussite.
 * Ajoute l'ID de la nouvelle question au parcours adaptatif.
 */
nextAdaptiveQuestion(wasCorrect: boolean) {
      // Ajuster la difficulté selon la réponse
      if (wasCorrect) {
        this.currentDifficulty = Math.min(5, this.currentDifficulty + 1)
      } else {
        this.currentDifficulty = Math.max(1, this.currentDifficulty - 1)
      }
      
      // Essayer de trouver une question de la nouvelle difficulté
      let nextQuestion = this.getRandomQuestionByDifficulty(this.currentDifficulty, 'all')
      
      // Si aucune question de cette difficulté n'est disponible, chercher dans les niveaux adjacents
      if (!nextQuestion) {
        for (let offset = 1; offset <= 2; offset++) {
          // Essayer un niveau plus haut
          if (this.currentDifficulty + offset <= 5) {
            nextQuestion = this.getRandomQuestionByDifficulty(this.currentDifficulty + offset, 'all')
            if (nextQuestion) break
          }
          
          // Essayer un niveau plus bas
          if (this.currentDifficulty - offset >= 1) {
            nextQuestion = this.getRandomQuestionByDifficulty(this.currentDifficulty - offset, 'all')
            if (nextQuestion) break
          }
        }
      }
      
      // Si on a trouvé une question, l'ajouter au parcours
      if (nextQuestion) {
        this.currentQuestions.push(nextQuestion)
        this.usedQuestionIds.push(nextQuestion.id)
        this.adaptiveQuestionIds.push(nextQuestion.id)
        
        console.log(`Question suivante ajoutée: ID ${nextQuestion.id}, Difficulté ${nextQuestion.difficulty}`)
      } else {
        console.warn('Aucune question disponible pour la difficulté', this.currentDifficulty)
      }
    },

    /**
     * Sélectionne des questions adaptées au niveau Elo actuel
     * @param elo Score Elo actuel
     */
    selectQuestionForElo(elo: number) {
      // Convertir l'Elo en niveau de difficulté cible
      // 400-800 = niveau 1, 800-1200 = niveau 2, etc.
      let targetDifficulty = Math.floor((elo - 400) / 400) + 1

      // Limiter entre 1 et 5
      targetDifficulty = Math.max(1, Math.min(5, targetDifficulty))

      // Sélectionner des questions proches du niveau cible
      // 60% du niveau cible, 20% un niveau en-dessous, 20% un niveau au-dessus
      const filteredQuestions = this.questions.filter((q: Question) => {
        return Math.abs(q.difficulty - targetDifficulty) <= 1
      })

      if (filteredQuestions.length > 0) {
        // Remplacer les questions actuelles par celles adaptées au niveau
        const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random())
        this.currentQuestions = shuffled.slice(0, 5)
      }
    },

    /**
     * Récupère la question à l'index spécifié
     * @param index Index de la question
     */
    /**
 * Récupère la question à l'index spécifié dans currentQuestions (utile pour l'affichage ou la navigation).
 */
getCurrentQuestion(index: number): Question | null {
      if (index >= 0 && index < this.currentQuestions.length) {
        return this.currentQuestions[index]
      }
      return null
    },

    /**
     * Récupère une question par son ID
     * @param id ID de la question
     */
    getQuestionById(id: number): Question | null {
      return this.questions.find((q: Question) => q.id === id) || null
    },

    /**
     * Sélectionne une question aléatoire d'une difficulté donnée, en évitant les doublons
     * Par défaut, ne renvoie que des QCM (pour la compatibilité avec le code existant)
     */
    /**
 * Sélectionne une question aléatoire d'une difficulté donnée et d'un type donné.
 * Évite les doublons grâce à usedQuestionIds.
 */
getRandomQuestionByDifficulty(difficulty: number, questionType: 'qcm' | 'free_text' | 'all' = 'qcm'): Question | null {
      // Filtrer les questions par difficulté et non utilisées
      let availableQuestions = this.questions.filter((q: Question) => {
        const matchesDifficulty = q.difficulty === difficulty
        const notUsed = !this.usedQuestionIds.includes(q.id)
        return matchesDifficulty && notUsed
      })

      // Si on demande un type spécifique, filtrer par type
      if (questionType !== 'all') {
        availableQuestions = availableQuestions.filter((q: Question) => q.type === questionType)
      }

      if (availableQuestions.length === 0) return null
      const idx = Math.floor(Math.random() * availableQuestions.length)
      return availableQuestions[idx]
    },

    /**
     * Filtre les questions pour ne garder que les QCM (utile pour les questions qui nécessitent des options)
     */
    /**
 * Filtre les questions pour ne garder que les QCM (utile pour les questions qui nécessitent des options).
 */
getQCMQuestions() {
      return this.questions.filter((q: Question) => q.type === 'qcm')
    }
  }
})
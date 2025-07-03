import { defineStore } from 'pinia'

// Type pour les questions
export interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: number // 1-5 (facile à très difficile)
  category: string
}

export const useQuestionStore = defineStore('questions', {
  state: () => ({
    questions: [] as Question[],
    currentQuestions: [] as Question[],
    currentDifficulty: 3, // Commence toujours à la difficulté moyenne
    usedQuestionIds: [] as number[], // Pour éviter les doublons
  }),

  getters: {
    totalQuestions: (state) => state.currentQuestions.length,
  },

  actions: {
    /**
     * Charge toutes les questions disponibles
     */
    loadQuestions() {
      // Simuler le chargement des questions
      this.questions = [
        // Niveau 1 - Très facile
        {
          id: 1,
          question: "Quelle est la capitale de la France ?",
          options: ["Berlin", "Londres", "Paris", "Madrid"],
          correctAnswer: 2,
          difficulty: 1,
          category: "Géographie"
        },
        {
          id: 2,
          question: "Comment s'appelle le verbe à l'infinitif dans la phrase : 'Je mange une pomme' ?",
          options: ["Manger", "Mange", "Mangeons", "Mangé"],
          correctAnswer: 0,
          difficulty: 1,
          category: "Français"
        },
        {
          id: 3,
          question: "Which of these is a greeting in English?",
          options: ["Hello", "Goodbye", "See you", "Thanks"],
          correctAnswer: 0,
          difficulty: 1,
          category: "Anglais"
        },

        // Niveau 2 - Facile
        {
          id: 4,
          question: "Quel est le synonyme du mot 'heureux' ?",
          options: ["Triste", "Content", "Mécontent", "Fatigué"],
          correctAnswer: 1,
          difficulty: 2,
          category: "Français"
        },
        {
          id: 5,
          question: "What is the English translation of 'Je suis fatigué'?",
          options: ["I am tired", "I am happy", "I am sad", "I am sick"],
          correctAnswer: 0,
          difficulty: 2,
          category: "Anglais"
        },
        {
          id: 6,
          question: "Quel est le raccourci clavier pour copier dans un document ?",
          options: ["Ctrl + P", "Ctrl + C", "Ctrl + V", "Ctrl + X"],
          correctAnswer: 1,
          difficulty: 2,
          category: "Informatique"
        },

        // Niveau 3 - Moyen
        {
          id: 7,
          question: "Quel est l'antonyme du mot 'dur' ?",
          options: ["Solide", "Mou", "Rugueux", "Épais"],
          correctAnswer: 1,
          difficulty: 3,
          category: "Français"
        },
        {
          id: 8,
          question: "How do you say 'I love you' in French?",
          options: ["Je t'aime", "Je suis content", "Je suis fatigué", "Je mange"],
          correctAnswer: 0,
          difficulty: 3,
          category: "Anglais"
        },
        {
          id: 9,
          question: "Dans Microsoft Word, quelle option utiliseriez-vous pour modifier la taille de la police ?",
          options: ["Home", "Insert", "Page Layout", "Review"],
          correctAnswer: 0,
          difficulty: 3,
          category: "Informatique"
        },

        // Niveau 4 - Difficile
        {
          id: 10,
          question: "What is the plural of 'child' in English?",
          options: ["Children", "Childes", "Childer", "Childs"],
          correctAnswer: 0,
          difficulty: 4,
          category: "Anglais"
        },
        {
          id: 11,
          question: "Conjuguez le verbe 'avoir' au présent pour la 1ère personne du pluriel.",
          options: ["Nous avons", "Nous avez", "Nous ont", "Nous avoir"],
          correctAnswer: 0,
          difficulty: 4,
          category: "Français"
        },
        {
          id: 12,
          question: "Quel est le raccourci clavier pour coller dans un document ?",
          options: ["Ctrl + P", "Ctrl + C", "Ctrl + V", "Ctrl + X"],
          correctAnswer: 2,
          difficulty: 4,
          category: "Informatique"
        },

        // Niveau 5 - Très difficile
        {
          id: 13,
          question: "Quelle est la fonction du subjonctif dans la phrase : 'Il faut que tu sois là' ?",
          options: ["Exprimer un souhait", "Exprimer une obligation", "Exprimer une certitude", "Exprimer une réalité"],
          correctAnswer: 1,
          difficulty: 5,
          category: "Français"
        },
        {
          id: 14,
          question: "Which of these sentences is correct in English?",
          options: ["He don't like pizza", "He doesn't likes pizza", "He doesn't like pizza", "He don't likes pizza"],
          correctAnswer: 2,
          difficulty: 5,
          category: "Anglais"
        },
        {
          id: 15,
          question: "Dans Excel, quelle fonction utiliseriez-vous pour trouver la somme d'une plage de cellules?",
          options: ["SUM", "AVERAGE", "COUNT", "VLOOKUP"],
          correctAnswer: 0,
          difficulty: 5,
          category: "Informatique"
        },
        {
          id: 16,
          question: "Dans Excel, quelle fonction utiliseriez-vous pour calculer la moyenne d'une plage de cellules?",
          options: ["SUM", "AVERAGE", "COUNT", "VLOOKUP"],
          correctAnswer: 1,
          difficulty: 5,
          category: "Informatique"
        },
        {
          id: 17,
          question: "Dans Excel, quelle fonction utiliseriez-vous pour compter le nombre de cellules non vides?",
          options: ["SUM", "AVERAGE", "COUNT", "VLOOKUP"],
          correctAnswer: 2,
          difficulty: 5,
          category: "Informatique"
        },
        {
          id: 18,
          question: "Dans Excel, quelle fonction utiliseriez-vous pour rechercher une valeur dans un tableau?",
          options: ["SUM", "AVERAGE", "COUNT", "VLOOKUP"],
          correctAnswer: 3,
          difficulty: 5,
          category: "Informatique"
        },
        {
          id: 19,
          question: "Quel est le complément d'objet direct dans la phrase : 'Marie mange une pomme' ?",
          options: ["Marie", "mange", "une pomme", "Il n'y en a pas"],
          correctAnswer: 2,
          difficulty: 5,
          category: "Français"
        },
        {
          id: 20,
          question: "What is the past participle of 'to write' in English?",
          options: ["Wrote", "Written", "Writing", "Writes"],
          correctAnswer: 1,
          difficulty: 5,
          category: "Anglais"
        },
      ]

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
    selectRandomQuestions(count: number) {
      // S'assurer qu'on ne demande pas plus de questions qu'il n'en existe
      const maxCount = Math.min(count, this.questions.length)

      // Copier et mélanger les questions
      const shuffled = [...this.questions].sort(() => 0.5 - Math.random())

      // Sélectionner le nombre demandé
      this.currentQuestions = shuffled.slice(0, Math.min(5, maxCount))
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
     */
    getRandomQuestionByDifficulty(difficulty: number): Question | null {
      const pool = this.questions.filter(
          (q: Question) => q.difficulty === difficulty && !this.usedQuestionIds.includes(q.id)
      )
      if (pool.length === 0) return null
      const idx = Math.floor(Math.random() * pool.length)
      return pool[idx]
    },

    /**
     * Ajoute dynamiquement la prochaine question selon la réponse du joueur
     * @param wasCorrect true si la réponse était correcte
     */
    nextAdaptiveQuestion(wasCorrect: boolean) {
      if (wasCorrect) {
        this.currentDifficulty = Math.min(5, this.currentDifficulty + 1)
      } else {
        this.currentDifficulty = Math.max(1, this.currentDifficulty - 1)
      }
      let next = this.getRandomQuestionByDifficulty(this.currentDifficulty)
      if (!next) {
        for (let offset = 1; offset <= 2; offset++) {
          next = this.getRandomQuestionByDifficulty(this.currentDifficulty + offset)
          if (next) break
          next = this.getRandomQuestionByDifficulty(this.currentDifficulty - offset)
          if (next) break
        }
      }
      if (next) {
        this.currentQuestions.push(next)
        this.usedQuestionIds.push(next.id)
      }
    }
  }
})
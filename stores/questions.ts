import { defineStore } from 'pinia'

// Type pour les questions
interface Question {
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
          question: "Combien font 2 + 2 ?",
          options: ["3", "4", "5", "6"],
          correctAnswer: 1,
          difficulty: 1,
          category: "Mathématiques"
        },
        {
          id: 3,
          question: "Quelle couleur obtient-on en mélangeant le bleu et le jaune ?",
          options: ["Rouge", "Orange", "Vert", "Violet"],
          correctAnswer: 2,
          difficulty: 1,
          category: "Arts"
        },
        
        // Niveau 2 - Facile
        {
          id: 4,
          question: "Quel est le plus grand océan du monde ?",
          options: ["Atlantique", "Indien", "Arctique", "Pacifique"],
          correctAnswer: 3,
          difficulty: 2,
          category: "Géographie"
        },
        {
          id: 5,
          question: "Qui a peint La Joconde ?",
          options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Claude Monet"],
          correctAnswer: 2,
          difficulty: 2,
          category: "Arts"
        },
        {
          id: 6,
          question: "En quelle année a commencé la Première Guerre mondiale ?",
          options: ["1905", "1914", "1918", "1939"],
          correctAnswer: 1,
          difficulty: 2,
          category: "Histoire"
        },
        
        // Niveau 3 - Moyen
        {
          id: 7,
          question: "Quel est l'élément chimique dont le symbole est 'Fe' ?",
          options: ["Fluor", "Fer", "Francium", "Fermium"],
          correctAnswer: 1,
          difficulty: 3,
          category: "Sciences"
        },
        {
          id: 8,
          question: "Qui a écrit 'Les Misérables' ?",
          options: ["Albert Camus", "Victor Hugo", "Émile Zola", "Gustave Flaubert"],
          correctAnswer: 1,
          difficulty: 3,
          category: "Littérature"
        },
        {
          id: 9,
          question: "Quel pays a remporté le plus de Coupes du Monde de football ?",
          options: ["Allemagne", "Italie", "Argentine", "Brésil"],
          correctAnswer: 3,
          difficulty: 3,
          category: "Sport"
        },
        
        // Niveau 4 - Difficile
        {
          id: 10,
          question: "Quelle est la capitale de l'Australie ?",
          options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
          correctAnswer: 2,
          difficulty: 4,
          category: "Géographie"
        },
        {
          id: 11,
          question: "Qui a formulé la théorie de la relativité ?",
          options: ["Isaac Newton", "Albert Einstein", "Niels Bohr", "Marie Curie"],
          correctAnswer: 1,
          difficulty: 4,
          category: "Sciences"
        },
        {
          id: 12,
          question: "En quelle année a été signé le Traité de Versailles ?",
          options: ["1914", "1918", "1919", "1945"],
          correctAnswer: 2,
          difficulty: 4,
          category: "Histoire"
        },
        
        // Niveau 5 - Très difficile
        {
          id: 13,
          question: "Quel est le théorème qui stipule qu'il n'existe pas d'ensemble de tous les ensembles ?",
          options: ["Théorème de Gödel", "Paradoxe de Russell", "Théorème de Cantor", "Axiome de Zermelo"],
          correctAnswer: 1,
          difficulty: 5,
          category: "Mathématiques"
        },
        {
          id: 14,
          question: "Qui a composé l'opéra 'La Flûte enchantée' ?",
          options: ["Ludwig van Beethoven", "Johann Sebastian Bach", "Wolfgang Amadeus Mozart", "Richard Wagner"],
          correctAnswer: 2,
          difficulty: 5,
          category: "Arts"
        },
        {
          id: 15,
          question: "Quel scientifique a découvert la pénicilline ?",
          options: ["Louis Pasteur", "Alexander Fleming", "Robert Koch", "Joseph Lister"],
          correctAnswer: 1,
          difficulty: 5,
          category: "Sciences"
        }
      ]
      
      // Sélectionner 10 questions aléatoires pour le questionnaire
      this.selectRandomQuestions(10)
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
      this.currentQuestions = shuffled.slice(0, maxCount)
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
        this.currentQuestions = shuffled.slice(0, 10)
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
    }
  }
})

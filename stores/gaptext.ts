import { defineStore } from 'pinia'

/**
 * Interface pour une question de type texte à trous
 */
export interface GapTextQuestion {
  id: number
  title: string
  text: string // Texte avec des marqueurs [gap-X] où X est l'index du trou
  gaps: string[] // Les réponses correctes pour chaque trou
  difficulty: number
  category: string
}

export const useGapTextStore = defineStore('gaptext', {
  state: () => ({
    questions: [] as GapTextQuestion[],
    currentQuestionIndex: 0,
    userAnswers: [] as string[],
    isFinished: false
  }),
  
  getters: {
    currentQuestion(): GapTextQuestion | null {
      if (this.questions.length > 0 && this.currentQuestionIndex < this.questions.length) {
        return this.questions[this.currentQuestionIndex]
      }
      return null
    },
    
    totalQuestions(): number {
      return this.questions.length
    },
    
    isLastQuestion(): boolean {
      return this.currentQuestionIndex === this.questions.length - 1
    },
    
    /**
     * Prépare le texte pour l'affichage en remplaçant les marqueurs [gap-X] par des inputs
     */
    formattedText(): string[] {
      if (!this.currentQuestion) return []
      
      // Diviser le texte aux marqueurs [gap-X]
      const parts = this.currentQuestion.text.split(/\[gap-\d+\]/g)
      return parts
    },
    
    /**
     * Extrait les positions des trous dans le texte
     */
    gapPositions(): number[] {
      if (!this.currentQuestion) return []
      
      const positions: number[] = []
      const regex = /\[gap-(\d+)\]/g
      let match
      
      while ((match = regex.exec(this.currentQuestion.text)) !== null) {
        positions.push(parseInt(match[1]))
      }
      
      return positions
    },
    
    /**
     * Calcule le score de l'utilisateur (pourcentage de bonnes réponses)
     */
    score(): number {
      if (this.userAnswers.length === 0) return 0
      
      let correctCount = 0
      const question = this.currentQuestion
      
      if (!question) return 0
      
      for (let i = 0; i < question.gaps.length; i++) {
        if (this.userAnswers[i]?.toLowerCase() === question.gaps[i].toLowerCase()) {
          correctCount++
        }
      }
      
      return Math.round((correctCount / question.gaps.length) * 100)
    }
  },
  
  actions: {
    /**
     * Charge les questions de texte à trous
     */
    loadQuestions() {
      this.questions = [
        {
          id: 1,
          title: "Les bases de l'informatique",
          text: "Un ordinateur est composé principalement d'un [gap-0] qui traite les informations, de la [gap-1] qui stocke temporairement les données, et d'un [gap-2] qui stocke les données de façon permanente.",
          gaps: ["processeur", "mémoire vive", "disque dur"],
          difficulty: 1,
          category: "Informatique"
        },
        {
          id: 2,
          title: "Grammaire française",
          text: "Le [gap-0] est un mot qui sert à déterminer le nom. Il peut être [gap-1] (le, la, les) ou [gap-2] (un, une, des).",
          gaps: ["déterminant", "défini", "indéfini"],
          difficulty: 2,
          category: "Français"
        },
        {
          id: 3,
          title: "Histoire de France",
          text: "La Révolution française a débuté en [gap-0] avec la prise de la [gap-1]. Elle a conduit à l'abolition de la [gap-2] et à la Déclaration des droits de l'homme et du citoyen.",
          gaps: ["1789", "Bastille", "monarchie absolue"],
          difficulty: 3,
          category: "Histoire"
        },
        {
          id: 4,
          title: "Géographie mondiale",
          text: "Le plus grand océan du monde est l'océan [gap-0], suivi par l'océan [gap-1]. Le plus haut sommet du monde, l'[gap-2], se trouve dans la chaîne de l'Himalaya.",
          gaps: ["Pacifique", "Atlantique", "Everest"],
          difficulty: 2,
          category: "Géographie"
        },
        {
          id: 5,
          title: "Mathématiques",
          text: "Le théorème de [gap-0] établit que dans un triangle rectangle, le carré de l'[gap-1] est égal à la somme des carrés des deux autres [gap-2].",
          gaps: ["Pythagore", "hypoténuse", "côtés"],
          difficulty: 3,
          category: "Mathématiques"
        }
      ]
      
      // Initialiser les réponses utilisateur
      this.resetUserAnswers()
    },
    
    /**
     * Réinitialise les réponses de l'utilisateur
     */
    resetUserAnswers() {
      if (this.currentQuestion) {
        this.userAnswers = new Array(this.currentQuestion.gaps.length).fill('')
      }
    },
    
    /**
     * Met à jour une réponse utilisateur
     */
    updateAnswer(index: number, value: string) {
      if (index >= 0 && index < this.userAnswers.length) {
        this.userAnswers[index] = value
      }
    },
    
    /**
     * Passe à la question suivante
     */
    nextQuestion() {
      if (this.isLastQuestion) {
        this.isFinished = true
      } else {
        this.currentQuestionIndex++
        this.resetUserAnswers()
      }
    },
    
    /**
     * Vérifie si toutes les réponses ont été remplies
     */
    allAnswersFilled(): boolean {
      return this.userAnswers.every((answer: string) => answer.trim() !== '')
    },
    
    /**
     * Récupère une question par son ID
     */
    getQuestionById(id: number): GapTextQuestion | null {
      return this.questions.find((q: GapTextQuestion) => q.id === id) || null
    }
  }
})

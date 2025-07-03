interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  difficulty: number
  category: string
}

// Fonction pour charger les questions depuis le fichier JSON
export async function loadQuestionsFromFile(): Promise<Question[]> {
  try {
    const response = await fetch('/questions.json')
    const questions = await response.json()
    return questions
  } catch (error) {
    console.error('Erreur lors du chargement des questions:', error)
    return []
  }
}

// Fonction pour sauvegarder les questions (côté client, on utilise le localStorage comme fallback)
export function saveQuestionsToStorage(questions: Question[]): void {
  localStorage.setItem('questions', JSON.stringify(questions))
}

// Fonction pour charger les questions depuis le localStorage
export function loadQuestionsFromStorage(): Question[] {
  try {
    const stored = localStorage.getItem('questions')
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Erreur lors du chargement depuis le localStorage:', error)
    return []
  }
}

// Fonction pour ajouter une question
export function addQuestion(questions: Question[], newQuestion: Omit<Question, 'id'>): Question[] {
  const maxId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) : 0
  const questionWithId = { ...newQuestion, id: maxId + 1 }
  return [...questions, questionWithId]
}

// Fonction pour modifier une question
export function updateQuestion(questions: Question[], updatedQuestion: Question): Question[] {
  return questions.map(q => q.id === updatedQuestion.id ? updatedQuestion : q)
}

// Fonction pour supprimer une question
export function deleteQuestion(questions: Question[], questionId: number): Question[] {
  return questions.filter(q => q.id !== questionId)
}

// Fonction pour exporter les questions au format JSON (pour téléchargement)
export function exportQuestionsAsJSON(questions: Question[]): string {
  return JSON.stringify(questions, null, 2)
}

// Fonction pour valider une question
export function validateQuestion(question: Partial<Question>): string[] {
  const errors: string[] = []
  
  if (!question.question || question.question.trim() === '') {
    errors.push('La question est obligatoire')
  }
  
  if (!question.options || question.options.length < 2) {
    errors.push('Au moins 2 options sont requises')
  }
  
  if (question.correctAnswer === undefined || question.correctAnswer < 0 || 
      (question.options && question.correctAnswer >= question.options.length)) {
    errors.push('La réponse correcte doit être un index valide des options')
  }
  
  if (!question.difficulty || question.difficulty < 1 || question.difficulty > 5) {
    errors.push('La difficulté doit être entre 1 et 5')
  }
  
  if (!question.category || question.category.trim() === '') {
    errors.push('La catégorie est obligatoire')
  }
  
  return errors
}

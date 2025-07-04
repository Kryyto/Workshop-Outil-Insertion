<template>
  <!-- Panneau d'administration pour la gestion des questions : ajout, modification, suppression, export. -->
  <div class="admin-container">
    <h1>Administration des Questions</h1>
    
    <!-- Statistiques -->
    <div class="stats">
      <div class="stat-card">
        <h3>{{ questions.length }}</h3>
        <p>Questions totales</p>
      </div>
      <div class="stat-card">
        <h3>{{ categories.length }}</h3>
        <p>Catégories</p>
      </div>
    </div>

    <!-- Actions principales -->
    <div class="actions">
      <button @click="showAddForm = true" class="btn btn-primary">
        ➕ Ajouter une question
      </button>
      <button @click="exportQuestions" class="btn btn-secondary">
        💾 Exporter JSON
      </button>
      <button @click="loadFromFile" class="btn btn-secondary">
        🔄 Recharger depuis le fichier
      </button>
    </div>

    <!-- Formulaire d'ajout/modification -->
    <div v-if="showAddForm || editingQuestion" class="form-overlay">
      <div class="form-container">
        <h2>{{ editingQuestion ? 'Modifier' : 'Ajouter' }} une question</h2>
        
        <form @submit.prevent="saveQuestion">
          <div class="form-group">
            <label>Type de question :</label>
            <select v-model="currentQuestion.type" @change="handleQuestionTypeChange" required>
              <option value="qcm">QCM (Choix multiples)</option>
              <option value="free_text">Texte à réponse libre</option>
            </select>
          </div>

          <div class="form-group">
            <label>Question :</label>
            <textarea v-model="currentQuestion.question" required></textarea>
          </div>
          
          <template v-if="currentQuestion.type === 'qcm'">
            <div class="form-group">
              <label>Options :</label>
              <div v-for="(option, index) in currentQuestion.options" :key="index" class="option-input">
                <input v-model="currentQuestion.options[index]" :placeholder="`Option ${index + 1}`" required>
                <button type="button" @click="removeOption(index)" v-if="currentQuestion.options.length > 2">❌</button>
              </div>
              <button type="button" @click="addOption" class="btn btn-small">+ Ajouter option</button>
            </div>
            
            <div class="form-group">
              <label>Réponse correcte :</label>
              <select v-model="currentQuestion.correctAnswer" required>
                <option v-for="(option, index) in currentQuestion.options" :key="index" :value="index">
                  {{ index + 1 }}. {{ option }}
                </option>
              </select>
            </div>
          </template>
          
          <div class="form-group">
            <label>Difficulté (1-5) :</label>
            <input type="number" v-model="currentQuestion.difficulty" min="1" max="5" required>
          </div>
          
          <div class="form-group">
            <label>Catégorie :</label>
            <select v-model="currentQuestion.category" required>
              <option value="">Sélectionner une catégorie</option>
              <option value="Anglais">Anglais</option>
              <option value="Français">Français</option>
              <option value="Informatique">Informatique</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary">
              {{ editingQuestion ? 'Modifier' : 'Ajouter' }}
            </button>
            <button type="button" @click="cancelForm" class="btn btn-secondary">
              Annuler
            </button>
          </div>
        </form>
        
        <div v-if="formErrors.length > 0" class="errors">
          <ul>
            <li v-for="error in formErrors" :key="error">{{ error }}</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Liste des questions -->
    <div class="questions-list">
      <div class="filters">
        <input v-model="searchTerm" placeholder="Rechercher..." class="search-input">
        <select v-model="filterCategory">
          <option value="">Toutes les catégories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <select v-model="filterDifficulty">
          <option value="">Toutes les difficultés</option>
          <option v-for="diff in [1,2,3,4,5]" :key="diff" :value="diff">Difficulté {{ diff }}</option>
        </select>
      </div>

      <div class="question-cards">
        <div v-for="question in filteredQuestions" :key="question.id" class="question-card">
          <div class="question-header">
            <span class="question-id">#{{ question.id }}</span>
            <span class="question-category">{{ question.category }}</span>
            <span class="question-difficulty">★{{ question.difficulty }}</span>
          </div>
          
          <div class="question-content">
            <h3>{{ question.question }}</h3>
            <div v-if="question.type === 'qcm'" class="options-list">
              <ul>
                <li v-for="(option, index) in question.options" :key="index" 
                    :class="{ correct: index === question.correctAnswer }">
                  {{ index + 1 }}. {{ option }}
                </li>
              </ul>
            </div>
            <div v-else class="free-text-indicator">
              <span class="badge">Réponse libre</span>
            </div>
          </div>
          
          <div class="question-actions">
            <button @click="editQuestion(question)" class="btn btn-small btn-edit">
              ✏️ Modifier
            </button>
            <button @click="deleteQuestionConfirm(question)" class="btn btn-small btn-delete">
              🗑️ Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  loadQuestionsFromFile, 
  loadQuestionsFromStorage, 
  saveQuestionsToStorage,
  saveQuestionsToFile,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  exportQuestionsAsJSON,
  validateQuestion
} from '~/utils/questionsManager'

type QuestionType = 'qcm' | 'free_text'

interface QuestionBase {
  id: number
  question: string
  type: QuestionType
  difficulty: number
  category: string
}

interface QCMQuestion extends QuestionBase {
  type: 'qcm'
  options: string[]
  correctAnswer: number
}

interface FreeTextQuestion extends QuestionBase {
  type: 'free_text'
}

type Question = QCMQuestion | FreeTextQuestion

// État réactif
const questions = ref<Question[]>([])
const showAddForm = ref(false)
const editingQuestion = ref<Question | null>(null)
const searchTerm = ref('')
const filterCategory = ref('')
const filterDifficulty = ref('')
const formErrors = ref<string[]>([])

// Question courante pour le formulaire
const currentQuestion = ref<Partial<Question>>({
  question: '',
  type: 'qcm',
  options: ['', ''],
  correctAnswer: 0,
  difficulty: 1,
  category: ''
})

// Computed
const categories = computed(() => {
  const cats = [...new Set(questions.value.map((q: Question) => q.category))]
  return cats.sort()
})

const filteredQuestions = computed(() => {
  return questions.value.filter((q: Question) => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         q.category.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = !filterCategory.value || q.category === filterCategory.value
    const matchesDifficulty = !filterDifficulty.value || q.difficulty === parseInt(filterDifficulty.value)
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })
})

// Méthodes
const loadQuestions = async () => {
  // Essaie de charger depuis le fichier JSON, sinon depuis localStorage
  let loadedQuestions = await loadQuestionsFromFile()
  if (loadedQuestions.length === 0) {
    loadedQuestions = loadQuestionsFromStorage()
  }
  questions.value = loadedQuestions
}

const loadFromFile = async () => {
  const loadedQuestions = await loadQuestionsFromFile()
  if (loadedQuestions.length > 0) {
    questions.value = loadedQuestions
    saveQuestionsToStorage(questions.value)
    alert('Questions rechargées depuis le fichier !')
  }
}

const saveQuestion = async () => {
  // Ensure the question has the correct type
  const questionToSave = { ...currentQuestion.value }
  
  // If it's a free text question, remove QCM-specific fields
  if (questionToSave.type === 'free_text') {
    delete questionToSave.options
    delete questionToSave.correctAnswer
  }
  
  formErrors.value = validateQuestion(questionToSave)
  
  if (formErrors.value.length > 0) {
    return
  }
  
  if (editingQuestion.value) {
    // Update existing question
    const updated = { 
      ...editingQuestion.value, 
      ...questionToSave,
      // Preserve the ID
      id: editingQuestion.value.id
    } as Question
    questions.value = updateQuestion(questions.value, updated)
  } else {
    // Add new question
    questions.value = addQuestion(questions.value, questionToSave as Omit<Question, 'id'>)
  }
  
  // Sauvegarder dans le fichier JSON
  const success = await saveQuestionsToFile(questions.value)
  if (success) {
    // Aussi sauvegarder dans localStorage comme backup
    saveQuestionsToStorage(questions.value)
    alert('Question sauvegardée avec succès !')
  } else {
    alert('Erreur lors de la sauvegarde. La question a été sauvegardée localement.')
    saveQuestionsToStorage(questions.value)
  }
  
  cancelForm()
}

const editQuestion = (question: Question) => {
  currentQuestion.value = JSON.parse(JSON.stringify(question)) // Deep clone
  editingQuestion.value = question
  showAddForm.value = true
}

const deleteQuestionConfirm = async (question: Question) => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer la question "${question.question}" ?`)) {
    questions.value = deleteQuestion(questions.value, question.id)
    
    // Sauvegarder dans le fichier JSON
    const success = await saveQuestionsToFile(questions.value)
    if (success) {
      saveQuestionsToStorage(questions.value)
      alert('Question supprimée avec succès !')
    } else {
      alert('Erreur lors de la sauvegarde. La question a été supprimée localement.')
      saveQuestionsToStorage(questions.value)
    }
  }
}

const handleQuestionTypeChange = () => {
  // Reset options when switching to free text
  if (currentQuestion.value.type === 'free_text') {
    delete currentQuestion.value.options
    delete currentQuestion.value.correctAnswer
  } else {
    // Ensure we have the required fields for QCM
    if (!currentQuestion.value.options) {
      currentQuestion.value.options = ['', '']
    }
    if (currentQuestion.value.correctAnswer === undefined) {
      currentQuestion.value.correctAnswer = 0
    }
  }
}

const cancelForm = () => {
  showAddForm.value = false
  editingQuestion.value = null
  currentQuestion.value = {
    question: '',
    type: 'qcm',
    options: ['', ''],
    correctAnswer: 0,
    difficulty: 1,
    category: ''
  }
  formErrors.value = []
}

const addOption = () => {
  currentQuestion.value.options?.push('')
}

const removeOption = (index: number) => {
  currentQuestion.value.options?.splice(index, 1)
  // Ajuster la réponse correcte si nécessaire
  if (currentQuestion.value.correctAnswer! >= currentQuestion.value.options!.length) {
    currentQuestion.value.correctAnswer = currentQuestion.value.options!.length - 1
  }
}

const exportQuestions = () => {
  const jsonData = exportQuestionsAsJSON(questions.value)
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'questions.json'
  a.click()
  URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  loadQuestions()
})
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  flex: 1;
}

.stat-card h3 {
  font-size: 2em;
  margin: 0;
  color: #007bff;
}

.actions {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-small {
  padding: 5px 10px;
  font-size: 12px;
}

.btn-edit {
  background: #28a745;
  color: white;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.form-container {
  background: white;
  padding: 30px;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.option-input {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.option-input input {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.errors {
  background: #f8d7da;
  color: #721c24;
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 200px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.question-cards {
  display: grid;
  gap: 20px;
}

.question-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.question-id {
  font-weight: bold;
  color: #666;
}

.question-category {
  background: #e9ecef;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.question-difficulty {
  color: #ffc107;
  font-weight: bold;
}

.question-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.options-list {
  list-style: none;
  padding: 0;
  margin: 10px 0;
}

.options-list li {
  padding: 8px;
  margin: 4px 0;
  background: #f5f5f5;
  border-radius: 4px;
}

.options-list li.correct {
  background: #e8f5e9;
  border-left: 3px solid #4caf50;
}

.free-text-indicator {
  margin: 10px 0;
}

.free-text-indicator .badge {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 12px;
  font-size: 0.8em;
  font-weight: 500;
}

.question-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

h1 {
  color: #333;
  margin-bottom: 30px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
}
</style>

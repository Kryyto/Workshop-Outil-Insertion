// Script de test pour valider l'intégration et la génération des statements xAPI.
// Permet de simuler des réponses et de vérifier le format produit.
//
// Usage : node test-xapi.js
//
// Chaque bloc ci-dessous correspond à un cas de test sur les fonctions xAPI.

import { defineStore } from 'pinia'
import { useXApiStore } from './stores/xapi.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import fs from 'fs'

// Création d'une instance de test du store xAPI
const xapiStore = useXApiStore(defineStore)

// Set a test user
xapiStore.setUser('Test User', 'test@example.com')

// Test QCM question
console.log('=== Testing QCM Question ===')
xapiStore.answeredQuestion(
  1,
  'What is the capital of France?',
  1, // Selected option index
  'Paris', // Selected option text
  1, // Correct option index
  'Paris', // Correct option text
  true, // isCorrect
  2 // Difficulty
)

// Test Free Text question
console.log('\n=== Testing Free Text Question ===')
xapiStore.answeredFreeTextQuestion(
  2,
  'Explain the concept of machine learning in your own words.',
  'Machine learning is a subset of AI that enables systems to learn from data.',
  true, // isCorrect
  3 // Difficulty
)

// Test completed assessment
console.log('\n=== Testing Completed Assessment ===')
xapiStore.completedAssessment(1500, 10, 8)

// Export and display the statements
const statements = xapiStore.exportStatements()
console.log('\n=== Generated xAPI Statements ===')
console.log(statements)

// Save to file for inspection
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
fs.writeFileSync('xapi-test-output.json', statements)
console.log('\nTest complete. Statements saved to xapi-test-output.json')

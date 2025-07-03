import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const questionsPath = path.join(process.cwd(), 'public', 'questions.json')
    const questionsData = fs.readFileSync(questionsPath, 'utf8')
    const questions = JSON.parse(questionsData)
    
    return {
      success: true,
      data: questions
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la lecture des questions'
    })
  }
})

import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const questions = body.questions
    
    if (!Array.isArray(questions)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Format de données invalide'
      })
    }
    
    const questionsPath = path.join(process.cwd(), 'public', 'questions.json')
    const questionsData = JSON.stringify(questions, null, 2)
    
    fs.writeFileSync(questionsPath, questionsData, 'utf8')
    
    return {
      success: true,
      message: 'Questions sauvegardées avec succès'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur lors de la sauvegarde des questions'
    })
  }
})

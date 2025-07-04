<template>
    <h1>Page de correction</h1>
    <UCard>
        <UForm :schema="schema" :state="state" class="space-y-4 border border-gray-200 p-4 rounded" @submit="correctText">
            <UFormField label="Texte">
                <span>Question : {{ question }}</span>
                <UInput v-model="state.text" placeholder="Entrer votre réponse" />
            </UFormField>

            <UButton type="submit" color="primary" size="lg" icon="i-heroicons-arrow-right">
                Submit
            </UButton>
        </UForm>
    </UCard>

    <UCard>
        <p class="text-lg">{{ correction }}</p>
    </UCard>
</template>

<script setup lang="ts">
import * as z from 'zod'
import OpenAI from "openai";
import { useRuntimeConfig } from '#app'

const config = useRuntimeConfig();
const client = new OpenAI({ 
  apiKey: config.public.openaiApiKey,
  dangerouslyAllowBrowser: true // Only if you're sure about client-side usage
});

const schema = z.object({
  text: z.string().min(1, 'Text is required'),
})

const state = reactive({
    text: ''
})

const question = ref("Quel est l'utilité de savoir utilisé un ordinateur ? Donne au moins 3 raisons");
const correction = ref('');

// Expose the correctText function
const correctText = async (questionText: string, answer: string): Promise<number> => {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4.1-nano",
            temperature: 0,
            messages: [
                {
                    role: "system",
                    content: `Tu es un correcteur qui note la validité de la réponse à la question suivante : ${questionText}. ` +
                            `Retourne uniquement un nombre entier entre 0 et 20, 0 signifiant que la réponse est incorrecte et 20 signifiant que la réponse est correcte, sans aucun autre texte. ` +
                            `Sois objectif et strict dans ta notation.`
                },
                {
                    role: "user",
                    content: answer
                }
            ]
        });
        
        const scoreText = response.choices[0]?.message?.content || '0';
        const score = parseInt(scoreText);
        return isNaN(score) ? 0 : score;
    } catch (error) {
        console.error('Erreur lors de la correction AI:', error);
        return 0; // En cas d'erreur, considérer comme incorrect
    }
};

// Expose the correctText function
const correctTextWrapper = async () => {
    if (!state.text.trim()) return;
    const score = await correctText(question.value, state.text);
    correction.value = score.toString();
};

defineExpose({
    correctText
});
</script>

<style scoped>
    
</style>

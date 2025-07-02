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

<script setup>
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

async function correctText() {
    const response = await client.chat.completions.create({
        model: "gpt-4.1-nano",
        temperature: 0,
        messages: [
            {
                role: "system",
                content: "Tu es un correcteur qui corrige la réponse à la question suivante : " + question.value + 
                ". Retourne uniquement une note de 0 à 20, formatage comme : 15. Soit objectif dans ta notation." +
                "La réponse donnée est : " + state.text

            },
            {
                role: "user",
                content: state.text
            }
        ]
    });
    correction.value = response.choices[0]?.message?.content || '';
}
</script>

<style scoped>
    
</style>

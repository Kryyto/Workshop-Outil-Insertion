<template>
    <UCard>
        <UForm :schema="schema" :state="state" class="space-y-4 border border-gray-200 p-4 rounded" @submit="onSubmit">
            <UFormField label="Email">
                <UInput placeholder="Enter your email" />
            </UFormField>

            <UButton type="submit">
                Submit
            </UButton>
        </UForm>
    </UCard>
</template>

<script setup>
const schema = {
    email: {
        type: 'string',
        required: true,
        format: 'email',
        message: 'Email is required'
    },
    password: {
        type: 'string',
        required: true,
        message: 'Password is required'
    }
}

const state = reactive({
    email: '',
    password: ''
})

const onSubmit = (state) => {
    console.log(state)
}
</script>

<style scoped>
    
</style>

    
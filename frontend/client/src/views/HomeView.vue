<template>
    <div class="container py-4">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card shadow-sm">
                    <div class="card-header bg-primary text-white">
                        <h3 class="mb-0">Text Review</h3>
                    </div>
                    <div class="card-body">
                        <p class="text-muted">Upload a file or paste text below to extract and review content.</p>

                        <form @submit.prevent="submitText">
                            <div class="mb-3">
                                <label class="form-label">Upload file</label>
                                <input class="form-control" type="file" @change="handleFileUpload" />
                                <div class="form-text">Supported: .txt, .pdf, .docx</div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Or paste text</label>
                                <textarea class="form-control" v-model="pastedText" rows="8" placeholder="Paste your text here"></textarea>
                            </div>

                            <div class="d-flex gap-2">
                                <button type="submit" class="btn btn-primary" :disabled="loading">
                                    <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Submit
                                </button>
                                <button type="button" class="btn btn-outline-secondary" @click="clearAll" :disabled="loading">Clear</button>
                            </div>
                        </form>

                        <div v-if="resultText" class="mt-4">
                            <h5>Result</h5>
                            <div class="card">
                                <div class="card-body pre-wrap">{{ resultText }}</div>
                            </div>
                        </div>

                        <div v-if="errorMsg" class="alert alert-danger mt-3">{{ errorMsg }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const pastedText = ref('')
const selectedFile = ref(null)
const resultText = ref('')
const loading = ref(false)
const errorMsg = ref('')

function handleFileUpload(event) {
    const file = event.target.files && event.target.files[0]
    selectedFile.value = file || null
    if (file) {
        // clear pasted text when file selected
        pastedText.value = ''
        resultText.value = `Selected file: ${file.name}`
    }
}

async function submitText() {
    errorMsg.value = ''
    resultText.value = ''
    loading.value = true
    try {
        if (selectedFile.value) {
            const form = new FormData()
            form.append('file', selectedFile.value)
            const resp = await axios.post('http://localhost:5000/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            resultText.value = resp.data?.text || 'No text returned from server.'
        } else if (pastedText.value.trim()) {
            // no server endpoint for pasted text in this repo; display locally
            resultText.value = pastedText.value
        } else {
            errorMsg.value = 'Please upload a file or paste some text before submitting.'
        }
    } catch (err) {
        console.error(err)
        errorMsg.value = err.response?.data?.error || err.message || 'Upload failed.'
    } finally {
        loading.value = false
    }
}

function clearAll() {
    pastedText.value = ''
    selectedFile.value = null
    resultText.value = ''
    errorMsg.value = ''
    // clear file input value
    const input = document.querySelector('input[type="file"]')
    if (input) input.value = ''
}
</script>

<style scoped>
.pre-wrap { white-space: pre-wrap; word-break: break-word; }
.card-header h3 { font-weight: 600; }
</style>
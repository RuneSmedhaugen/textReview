<template>
  <div class="container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Text Review</h3>
          </div>
          <div class="card-body">
            <p class="text-muted">Upload a file or paste text below to extract and summarize content.</p>

            <form @submit.prevent="submitText">
              <div class="mb-3">
                <label class="form-label">Upload file</label>
                <input class="form-control" type="file" @change="handleFileUpload" />
                <div class="form-text">Supported: .txt, .pdf, .docx, .doc</div>
              </div>

              <div class="mb-3">
                <label class="form-label">Or paste text</label>
                <textarea class="form-control" v-model="pastedText" rows="8" placeholder="Paste your text here"></textarea>
              </div>

              <!-- 👇 NEW: Document type selector -->
              <div class="mb-3">
                <label class="form-label">Select document type</label>
                <select class="form-select" v-model="selectedType">
                  <option disabled value="">Choose type...</option>
                  <option value="CV">CV / Resume</option>
                  <option value="essay">Essay</option>
                  <option value="report">Report</option>
                  <option value="article">Article</option>
                  <option value="business email">Business Email</option>
                  <option value="generic text">Generic Text</option>
                </select>
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
              <h5>Extracted Text</h5>
              <div class="card"><div class="card-body pre-wrap">{{ resultText }}</div></div>
            </div>

            <div v-if="summaryText" class="mt-3">
              <h5>Summary</h5>
              <div class="card"><div class="card-body pre-wrap">{{ summaryText }}</div></div>
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
const summaryText = ref('')
const selectedType = ref('') // 👈 user-selected document type
const loading = ref(false)
const errorMsg = ref('')

function handleFileUpload(event) {
  const file = event.target.files?.[0]
  selectedFile.value = file || null
  if (file) {
    pastedText.value = ''
    resultText.value = `Selected file: ${file.name}`
    summaryText.value = ''
  }
}

async function submitText() {
  errorMsg.value = ''
  resultText.value = ''
  summaryText.value = ''
  loading.value = true

  try {
    let textToAnalyze = ''

    if (selectedFile.value) {
      const form = new FormData()
      form.append('file', selectedFile.value)
      const resp = await axios.post('http://localhost:5000/upload', form)
      textToAnalyze = resp.data?.text || ''
      resultText.value = textToAnalyze
    } else if (pastedText.value.trim()) {
      textToAnalyze = pastedText.value
      resultText.value = textToAnalyze
    } else {
      errorMsg.value = 'Please upload a file or paste some text before submitting.'
      return
    }

    if (!selectedType.value) {
      errorMsg.value = 'Please select a document type.'
      return
    }

    const summaryResp = await axios.post('http://localhost:5000/analyze-text', {
      text: textToAnalyze,
      type: selectedType.value,
    })

    summaryText.value = summaryResp.data?.summary || 'No summary returned.'
  } catch (err) {
    console.error(err)
    errorMsg.value = err.response?.data?.error || err.message || 'Failed to process text.'
  } finally {
    loading.value = false
  }
}

function clearAll() {
  pastedText.value = ''
  selectedFile.value = null
  resultText.value = ''
  summaryText.value = ''
  selectedType.value = ''
  errorMsg.value = ''
  document.querySelector('input[type="file"]').value = ''
}
</script>


<style scoped>
.pre-wrap { white-space: pre-wrap; word-break: break-word; }
.card-header h3 { font-weight: 600; }
/* 🌙 DARK MODE THEME */
body, .container {
  background-color: #121212;
  color: #e0e0e0;
}

/* Card styling */
.card {
  background-color: #1e1e1e;
  border: 1px solid #333;
  color: #e0e0e0;
}

/* Header */
.card-header {
  background-color: #2a2a2a !important;
  border-bottom: 1px solid #333;
}

.card-header h3 {
  color: #ffffff;
}

/* Inputs and textarea */
.form-control {
  background-color: #2b2b2b;
  color: #ffffff;
  border: 1px solid #444;
}

.form-control:focus {
  background-color: #2b2b2b;
  border-color: #666;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,0.25);
  color: #fff;
}

/* Buttons */
.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-outline-secondary {
  color: #ccc;
  border-color: #555;
}

.btn-outline-secondary:hover {
  background-color: #444;
  border-color: #777;
}

/* Summary + text boxes */
.card-body.pre-wrap {
  background-color: #252323;
  border-radius: 6px;
}

/* Alerts */
.alert-danger {
  background-color: #3a0d0d;
  color: #ffb3b3;
  border: 1px solid #ff4d4d;
}

</style>

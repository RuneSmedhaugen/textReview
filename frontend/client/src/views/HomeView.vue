<template>
  <div class="review-wrapper container py-4">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <div class="review-card card shadow-sm">
          <div class="card-header bg-primary text-white d-flex align-items-center gap-2">
            <i class="bi bi-robot fs-4"></i>
            <h3 class="mb-0">Text Review</h3>
          </div>

          <div class="card-body">
            <p class="text-muted">
              <i class="bi bi-info-circle me-2"></i>
              Upload a file or paste text below to analyze and review its content.
            </p>

            <form @submit.prevent="submitText">
              <!-- Upload File -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="bi bi-upload me-1"></i> Upload File
                </label>
                <input class="form-control" type="file" @change="handleFileUpload" />
                <div class="form-text">
                  <i class="bi bi-file-earmark-text me-1"></i> Supported: .txt, .pdf, .docx, .doc
                </div>
              </div>

              <!-- Paste Text -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="bi bi-clipboard-check me-1"></i> Or Paste Text
                </label>
                <textarea
                  class="form-control"
                  v-model="pastedText"
                  rows="8"
                  placeholder="Paste your text here"
                ></textarea>
              </div>

              <!-- Document Type -->
              <div class="mb-3">
                <label class="form-label">
                  <i class="bi bi-tags me-1"></i> Select Document Type
                </label>
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

              <!-- Buttons -->
              <div class="d-flex gap-2">
                <button type="submit" class="btn btn-gradient" :disabled="loading">
                  <i
                    v-if="!loading"
                    class="bi bi-lightning-charge me-1"
                  ></i>
                  <i
                    v-if="loading"
                    class="spinner-border spinner-border-sm text-light me-2"
                    role="status"
                  ></i>
                  {{ loading ? 'Analyzing...' : 'Submit' }}
                </button>

                <button
                  type="button"
                  class="btn btn-outline-light"
                  @click="clearAll"
                  :disabled="loading"
                >
                  <i class="bi bi-trash3 me-1"></i> Clear
                </button>
              </div>
            </form>

            <!-- Summary -->
            <div v-if="summaryText" class="mt-4">
              <h5 class="d-flex align-items-center gap-2">
                <i class="bi bi-stars"></i> Review Result
              </h5>
              <div class="result-card card mt-2">
                <div class="card-body pre-wrap">{{ summaryText }}</div>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="errorMsg" class="alert alert-danger mt-3 d-flex align-items-center gap-2">
              <i class="bi bi-exclamation-triangle-fill"></i> {{ errorMsg }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref } from "vue";
import axios from "axios";

const pastedText = ref("");
const selectedFile = ref(null);
const summaryText = ref("");
const selectedType = ref("");
const loading = ref(false);
const errorMsg = ref("");

function handleFileUpload(event) {
  const file = event.target.files?.[0];
  selectedFile.value = file || null;
  if (file) {
    pastedText.value = "";
    summaryText.value = "";
  }
}

async function submitText() {
  errorMsg.value = "";
  summaryText.value = "";
  loading.value = true;

  try {
    const validTypes = ["CV", "essay", "report", "article", "business email", "generic text"];
    if (!selectedType.value || !validTypes.includes(selectedType.value)) {
      errorMsg.value = "Please select a valid document type.";
      return;
    }

    let summaryResp;
    if (selectedFile.value) {
      const form = new FormData();
      form.append("file", selectedFile.value);
      form.append("type", selectedType.value);
      summaryResp = await axios.post("http://localhost:5000/upload/upload-and-summarize", form);
    } else if (pastedText.value.trim()) {
      summaryResp = await axios.post("http://localhost:5000/analyze-text", {
        text: pastedText.value,
        type: selectedType.value,
      });
    } else {
      errorMsg.value = "Please upload a file or paste some text before submitting.";
      return;
    }

    summaryText.value = summaryResp.data?.summary || "No summary returned.";
  } catch (err) {
    console.error(err);
    errorMsg.value = err.response?.data?.error || err.message || "Failed to process text.";
  } finally {
    loading.value = false;
  }
}

function clearAll() {
  pastedText.value = "";
  selectedFile.value = null;
  summaryText.value = "";
  selectedType.value = "";
  errorMsg.value = "";
  document.querySelector("input[type='file']").value = "";
}
</script>

<style scoped>
/* Background & Global */
.review-wrapper {
  min-height: 100vh;
  background: radial-gradient(circle at top left, #1a1a1a, #0f0f0f);
  color: #e0e0e0;
  font-family: "Inter", system-ui, sans-serif;
}

/* Card */
.review-card {
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  overflow: hidden;
}

/* Header */
.card-header {
  background: linear-gradient(90deg, #007bff, #00c6ff);
  color: white;
  font-weight: 600;
  padding: 1rem 1.5rem;
}

.text-muted {
  color: #818181 !important;
}

.text-gradient {
  background: linear-gradient(90deg, #ffffff, #9ce0ff);
  -webkit-text-fill-color: transparent;
}

/* Labels & Help Text */
.form-label {
  color: #f2f2f2 !important;
  font-weight: 500;
}

.form-text {
  color: #c9c9c9 !important;
}

/* Inputs */
.form-control,
.form-select {
  background-color: #2a2a2a;
  border: 1px solid #555;
  color: #f5f5f5;
  border-radius: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-control::placeholder {
  color: #a0a0a0 !important;
  opacity: 1;
}

.form-control:focus,
.form-select:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.3);
}

/* Select dropdown text */
.form-select option {
  background-color: #1e1e1e;
  color: #f0f0f0;
}

/* Buttons */
.btn-gradient {
  background: linear-gradient(90deg, #00ff15, #000000);
  border: none;
  color: #fff;
  font-weight: 500;
  border-radius: 8px;
  padding: 0.5rem 1.2rem;
  transition: background 0.3s ease, transform 0.2s ease;
}

.btn-gradient:hover {
  transform: scale(1.03);
  background: linear-gradient(90deg, #000000, #00ff15);
}

.btn-outline-light {
  color: #505050;
  border-color: #5c5c5c;
  transition: background 0.3s ease, border-color 0.3s ease;
}

.btn-outline-light:hover {
  color: rgb(255, 0, 0);
  background-color: #000000;
  border-color: #ff0000;
  box-shadow: 0 0 0 0.2rem rgba(255, 0, 0, 0.3);

}

/* Results Card */
.result-card {
  background-color: #202020;
  border: 1px solid #333;
  border-radius: 10px;
  color: #f2f2f2;
}

.pre-wrap {
  white-space: pre-wrap;
  word-break: break-word;
}

/* Alerts */
.alert-danger {
  background-color: #3a0d0d;
  color: #ffb3b3;
  border: 1px solid #ff4d4d;
}

@import "bootstrap-icons/font/bootstrap-icons.css";

/* Adjust spinner size and spacing for better alignment */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  vertical-align: text-bottom;
}

/* Make labels and icons align nicely */
.form-label i {
  color: #00c6ff;
}

.btn i {
  vertical-align: middle;
}

</style>

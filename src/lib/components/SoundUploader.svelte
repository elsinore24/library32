<script lang="ts">
  import { uploadSound } from '$lib/supabaseStorage';
  import { onMount } from 'svelte';

  let file: File | null = null;
  let uploadStatus: string = '';
  let fileName: string = '';

  function handleFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
    file = input.files[0];
    fileName = file.name;
  }

  async function handleUpload() {
    if (!file) {
      uploadStatus = 'No file selected';
      return;
    }

    uploadStatus = 'Uploading...';
    try {
      const url = await uploadSound(file);
      if (url) {
        uploadStatus = `Upload successful! File available at: ${url}`;
      } else {
        uploadStatus = 'Upload failed.';
      }
    } catch (error) {
      uploadStatus = `Upload failed: ${error}`;
    }
  }
</script>

<div>
  <input type="file" id="fileInput" on:change={handleFileSelect} />
  <label for="fileInput">Choose a sound file</label>
  {#if fileName}
    <p>Selected file: {fileName}</p>
  {/if}
  <button on:click={handleUpload} disabled={!file}>Upload</button>
  {#if uploadStatus}
    <p>{uploadStatus}</p>
  {/if}
</div>

<style>
  div {
    margin-bottom: 20px;
  }

  input[type="file"] {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }

  label {
    display: inline-block;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
    border-radius: 5px;
  }

  button {
    background-color: #008CBA;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }

  button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  p {
    margin-top: 10px;
  }
</style>

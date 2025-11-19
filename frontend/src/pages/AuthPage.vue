<template>
  AUTH LAYOUT
  ЛОГИНЬСФ
  <button @click="redirectToAutentificationPage">AUTH</button>
</template>
<script setup lang="ts">
function redirectToAutentificationPage() {
  window.location.href = 'http://localhost:8080/auth/github';
}

</script>
<style scoped></style>

<template>
  <nav>
    <router-link to="/" >Home</router-link> |
    <router-link to="/auth/signin" >Sign In</router-link>
    <router-link to="/author" >Authors</router-link>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>

</style>

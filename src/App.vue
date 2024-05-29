<template>
  <nav class="navbar">
    <ul class="nav-links">
      <li>
        <router-link to="/" class="nav-item">{{
          $t('views.home.nav.home')
        }}</router-link>
      </li>
      <li>
        <router-link to="/auth/signin" class="nav-item">Sign In</router-link>
      </li>
      <li>
        <router-link to="/book" class="nav-item">{{
          $t('views.home.nav.books')
        }}</router-link>
      </li>
      <li>
        <router-link to="/author" class="nav-item">{{
          $t('views.home.nav.authors')
        }}</router-link>
      </li>
      <li>
        <router-link to="/subject" class="nav-item">{{
          $t('views.home.nav.subjects')
        }}</router-link>
      </li>
      <li>
        <router-link to="/book-copy" class="nav-item">{{
          $t('views.home.nav.bookCopy')
        }}</router-link>
      </li>
      <li>
        <router-link to="/loan" class="nav-item">{{
          $t('views.home.nav.loans')
        }}</router-link>
      </li>
      <li>
        <router-link to="/sanction" class="nav-item">{{
          $t('views.home.nav.sanctions')
        }}</router-link>
      </li>
      <li>
        <router-link to="/user" class="nav-item">{{
          $t('views.home.nav.users')
        }}</router-link>
      </li>
      <li>
        <router-link to="/reports" class="nav-item">{{
          $t('views.home.nav.reports')
        }}</router-link>
      </li>
    </ul>
    <div>
      <select v-model="$i18n.locale">
        <option
          v-for="(locale, index) in $i18n.availableLocales"
          :key="index"
          :value="locale"
        >
          {{ locale }}
        </option>
      </select>
    </div>
  </nav>
  <router-view />
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router';
import { useAuthStore } from './store/auth';

const store = useAuthStore();
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo {
  height: 50px; /* Ajusta según necesites */
  margin-right: 10px;
}

.title {
  color: white;
  font-size: 24px;
}

.nav-links {
  list-style-type: none;
  display: flex;
  gap: 20px;
  margin-bottom: 0;
}

.nav-item {
  color: #ffffff;
  text-decoration: none;
  padding: 5px;
  transition: color 0.3s ease, transform 0.3s ease;
}

.nav-item:hover {
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

.router-link-active {
  color: rgb(145, 243, 178);
  background-color: rgba(
    255,
    255,
    255,
    0.1
  ); /* Fondo blanco semitransparente */
  border-radius: 5px; /* Bordes redondeados para un aspecto más moderno */
  padding: 5px;
}
</style>

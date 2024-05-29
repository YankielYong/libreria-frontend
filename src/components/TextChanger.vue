<template>
  <div class="text-changer">
    <div class="text-box">
      <p>{{ currentText }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

let texts = [
  ref(t('views.home.textChanger.text1')),
  ref(t('views.home.textChanger.text2')),
  ref(t('views.home.textChanger.text3')),
  ref(t('views.home.textChanger.text4')),
];

watchEffect(() => {
  texts = [
    ref(t('views.home.textChanger.text1')),
    ref(t('views.home.textChanger.text2')),
    ref(t('views.home.textChanger.text3')),
    ref(t('views.home.textChanger.text4')),
  ];
});

const currentIndex = ref(0);
const currentText = ref(t('views.home.welcome'));

onMounted(() => {
  startTextChange();
});

const startTextChange = () => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % texts.length;
    currentText.value = texts[currentIndex.value].value;
  }, 3000); // Cambia el texto cada 3 segundos
};
</script>

<style scoped>
.text-changer {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 10vh;
}

.text-box {
  background-color: rgba(255, 255, 255, 0.5);
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 1.5em;
  color: #333;
}

p {
  margin-bottom: 0;
}
</style>

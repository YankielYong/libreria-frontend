<template>
    <div class="text-changer">
      <div class="text-box">
        <p>{{ currentText }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        texts: [
          'Préstamos ilimitados',
          'Explora un mundo de conocimiento',
          'Descubre nuevos libros cada día',
          'Sumérgete en aventuras literarias',
        ],
        currentIndex: 0,
        currentText: 'Bienvenido a la Biblioteca',
      };
    },
    mounted() {
      this.startTextChange();
    },
    methods: {
      startTextChange() {
        setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.texts.length;
          this.currentText = this.texts[this.currentIndex];
        }, 3000); // Cambia el texto cada 3 segundos
      },
    },
  };
  </script>
  
  <style scoped>
  .text-changer {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f0f0;
  }
  
  .text-box {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    text-align: center;
    font-family: 'Roboto', sans-serif;
    font-size: 1.5em;
    color: #333;
  }
  </style>
  
<template>
    <div class="home">
      <TextChanger />
      <header>
        <h1 class="header-title">Welcome to the library</h1>
        <p class="header-subtitle">"chapter by chapter"</p>
      </header>
    </div>
</template>
  
  
<script lang="ts" setup> 
</script>

<style scoped>
  .home {
  background-image: url('@/assets/image.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: white;
}

.navbar {
  position: absolute;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.7);
}

.navbar ul {
  list-style-type: none;
  display: flex;
  padding: 0;
}

.navbar ul li {
  margin: 0 15px;
}

.navbar ul li a {
  color: white;
  text-decoration: none;
  font-family: 'Roboto', sans-serif;
}

header {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
}

.header-title {
  font-family: 'Georgia', sans-serif;
  font-size: 3em;
  margin: 0;
}

.header-subtitle {
  font-family: 'Georgia', sans-serif;
  font-size: 2em;
  margin: 10px 0;
}

.explore-button {
  background-color: #ff6347;
  color: white;
  padding: 10px 20px;
  font-size: 1em;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.explore-button:hover {
  background-color: #ff4500;
}
</style>
  
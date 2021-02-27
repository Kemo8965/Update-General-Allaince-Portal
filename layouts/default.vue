<template>
  <div class="app-container">
    <header>
      <Navbar />
    </header>
    <!-- <div class=" is-flex-grow-1 has-background-light"> -->
    <main class="app-content">
      <Nuxt />
    </main>
    <!-- </div> -->
    <!-- <footer>
      Powered by
      <a href="https://hobbitontechnologies.com">Hobbiton Technologies</a>
    </footer> -->
  </div>
</template>

<script>
import Navbar from '~/components/layout/Navbar.vue'
export default {
  components: { Navbar },
}
</script>

<style>
html,
body {
  margin: 0;
  height: 100%;
  width: 100%;
  background-color: whitesmoke;
}

.app-container {
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
}

.app-content {
  flex-grow: 1;

  /* padding: 0 5rem; */
}

.full-height {
  height: 100vh;
}

.height-100 {
  height: 100%;
}
</style>

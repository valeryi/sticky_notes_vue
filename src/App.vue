<template>
  <div id="app">
    <div class="wrapper">
      <router-view />
    </div>

    <SnackBar />
  </div>
</template>

<style lang="scss">

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  @include user-select(none);

  ul {
    list-style: none;
  }
}

body, html {
  height: 100%;
  width: 100%;
}

#app {
  font-family: $primary-font;
  font-size: $font-size;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: $primary-color;
  min-height: 100vh;
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding-top: 70px;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: url(./assets/background-texture.png);
    opacity: .2;
    z-index: 2;
  }
}
</style>

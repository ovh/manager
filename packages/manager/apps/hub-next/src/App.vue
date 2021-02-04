<template>
  <div class="container-fluid hub-main-view_container">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/product-details">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<style lang="scss">
#nav {
  padding: 30px;
  text-align: left;
  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>

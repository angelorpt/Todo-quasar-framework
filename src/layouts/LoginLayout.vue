<template>
  <q-layout view="hHh lpR fFf">

    <q-header reveal elevated bordered>
      <q-toolbar>
        <q-avatar>
          <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">
        </q-avatar>

        <q-toolbar-title>To Do List</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-img class="absolute-center img-login" src="statics/mountains.jpg" style="height: 100%">
      <div class="absolute-center bg-transparent"></div>
    </q-img>

    <q-page-container class="center">
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  .img-login {
    z-index: -1;
    opacity: 0.3;
    filter: grayscale(50%)
  }
</style>

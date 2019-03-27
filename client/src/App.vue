<template>
  <v-app id="app" dark>
    <page-header/>
    <v-content class="margin-top-60">
      <v-container>
        <router-view/>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    font-size: 10pt;
    font-family: "Century Gothic";
  }

  .danger-alert {
    color: red;
  }

  .border {
    border: 1px red solid;
  }

  .margin-top-60 {
    margin-top: 60px;
  }

  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background-color: #eaeaea;
    border-left: 1px solid #ccc;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #ccc;
  }
  ::-webkit-scrollbar-thumb:hover {
    background-color: #aaa;
  }
</style>

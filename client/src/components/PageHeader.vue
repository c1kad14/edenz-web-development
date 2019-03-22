<template>
  <nav>
    <v-toolbar flat fixed dark class="yellow darken-2">
      <v-toolbar-side-icon @click="drawer = !drawer" class="grey--text"></v-toolbar-side-icon>
      <v-toolbar-title class="app-root" @click="navigateTo({name: 'root'})">
        <img id="logo" src="../../static/favicon.png" />
      </v-toolbar-title>

      <v-toolbar-items>
        <v-btn v-if="$store.state.isLoggedIn" flat @click="navigateTo('summary')">
          Summary
        </v-btn>

      </v-toolbar-items>
      <v-spacer/>

      <v-toolbar-items>
        <v-btn v-if="!$store.state.isLoggedIn" flat @click="navigateTo('login')">Sign In</v-btn>
        <v-btn v-if="!$store.state.isLoggedIn" flat @click="navigateTo('register')">Sign Up</v-btn>
        <v-btn v-if="$store.state.isLoggedIn" flat @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer app v-model="drawer" temporary>
      <v-layout column align-center>
        <v-flex class="mt-5">
          <p class="white--text subheading mt-1">Antimenu</p>
        </v-flex>
      </v-layout>
      <v-list>
        <v-list-tile v-for="link in links" :key="link.text" router :to="link.route">
          <v-list-tile-action>
            <v-icon class="white--text">{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title class="white--text">{{ link.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    links: [
      { icon: 'dashboard', text: 'Summary', route: '/summary' },
      { icon: 'table', text: 'Table', route: '/table' },
      { icon: 'person', text: 'Team', route: '/team' }
    ]
  }),
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    },
    logout () {
      this.$store.dispatch('setToken', null);
      this.$store.dispatch('setUser', null);
      this.$router.push({name: 'root'});
    }
  }
}
;
</script>

<style>
  #logo {
    width: 35px;
  }

  .app-root {
    cursor: pointer;
  }

  .app-root:hover {
    opacity: 0.8;
  }
</style>

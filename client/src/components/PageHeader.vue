<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <nav>
    <v-toolbar flat fixed dark class="yellow darken-2">
      <v-toolbar-side-icon @click="drawer = !drawer" class="grey--text"></v-toolbar-side-icon>
      <v-toolbar-title class="app-root" @click="navigateTo({name: 'root'})">
        <img id="logo" src="../../static/favicon.png"/>
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
        <v-list-group
          v-for="link in links"
          :key="link.text"
          v-model="link.active"
          :prepend-icon="link.action"
          no-action
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>{{ link.text }}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </template>

          <v-list-tile
            v-for="competition in link.competitions"
            :key="competition.text"
            router :to="competition.route"
          >
            <v-list-tile-content>
              <v-list-tile-title>{{ competition.text }}</v-list-tile-title>
            </v-list-tile-content>

            <v-list-tile-action>
              <v-icon>{{ competition.icon }}</v-icon>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
export default {
  data: () => ({
    drawer: false,
    links: [
      {
        icon: 'dashboard',
        text: 'England',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Premier League',
            route: '/competition/english-premier-league'
          },
          {
            icon: 'dashboard',
            text: 'Championship',
            route: '/competition/english-championship'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'France',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Ligue 1',
            route: '/competition/french-ligue-1'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Germany',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Bundesliga',
            route: '/competition/german-bundesliga'
          },
          {
            icon: 'dashboard',
            text: '2nd Bundesliga',
            route: '/competition/german-2nd-bundesliga'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Germany',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Bundesliga',
            route: '/competition/german-bundesliga'
          },
          {
            icon: 'dashboard',
            text: '2nd Bundesliga',
            route: '/competition/german-2nd-bundesliga'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Italy',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Seria A',
            route: '/competition/italian-seria-a'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Spain',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'LaLiga Santander',
            route: '/competition/spanish-laliga'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Portugal',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Primeira Liga',
            route: '/competition/portugese-primeira-liga'
          }
        ]
      },
      {
        icon: 'dashboard',
        text: 'Netherlands',
        active: true,
        competitions: [
          {
            icon: 'dashboard',
            text: 'Eredivisie',
            route: '/competition/dutch-eredivisie'
          }
        ]
      },
      // { icon: 'dashboard', text: 'Summary', route: '/summary' },
      // { icon: 'table', text: 'Table', route: '/table' },
      // { icon: 'person', text: 'Team', route: '/team' }
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

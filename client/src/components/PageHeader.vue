<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <nav>
    <v-toolbar flat fixed dark id="header-toolbar">
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
        <v-btn v-if="!$store.state.isLoggedIn" flat @click="navigateTo({name: 'Login'})">Sign In</v-btn>
        <v-btn v-if="!$store.state.isLoggedIn" flat @click="navigateTo({name: 'Register'})">Sign Up</v-btn>
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
                <v-list-tile-title><img class="flag" :src="getPngFromStatic(link.text)"/> {{ link.text }}</v-list-tile-title>
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
              <img class="competition-logo" :src="getPngFromStatic(competition.icon)"/>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>

export default {
  name: 'PageHeader',
  data: () => ({
    drawer: false,
    links: [
      {
        text: 'England',
        active: true,
        competitions: [
          {
            icon: 'premier-league',
            text: 'Premier League',
            route: '/competition/english-premier-league'
          },
          {
            icon: 'championship',
            text: 'Championship',
            route: '/competition/english-championship'
          }
        ]
      },
      {
        text: 'France',
        active: false,
        competitions: [
          {
            icon: 'ligue1',
            text: 'Ligue 1',
            route: '/competition/french-ligue-1'
          }
        ]
      },
      {
        text: 'Germany',
        active: false,
        competitions: [
          {
            icon: 'bundesliga',
            text: 'Bundesliga',
            route: '/competition/german-bundesliga'
          },
          {
            icon: 'bundesliga2',
            text: '2nd Bundesliga',
            route: '/competition/german-2nd-bundesliga'
          }
        ]
      },
      {
        text: 'Italy',
        active: false,
        competitions: [
          {
            icon: 'serie-a',
            text: 'Serie A',
            route: '/competition/italian-serie-a'
          }
        ]
      },
      {
        text: 'Spain',
        flag: 'es',
        active: false,
        competitions: [
          {
            icon: 'laliga',
            text: 'LaLiga Santander',
            route: '/competition/spanish-laliga'
          }
        ]
      },
      {
        text: 'Portugal',
        active: false,
        competitions: [
          {
            icon: 'primeira-liga',
            text: 'Primeira Liga',
            route: '/competition/portugese-primeira-liga'
          }
        ]
      },
      {
        text: 'Netherlands',
        active: false,
        competitions: [
          {
            icon: 'eredivisie',
            text: 'Eredivisie',
            route: '/competition/dutch-eredivisie'
          }
        ]
      }
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
    },
    getPngFromStatic (country) {
      return `/../../static/${country.toLowerCase()}.png`;
    }
  }
}
;
</script>

<style>
  #header-toolbar{
    background: #ffb80c;
  }
  #logo {
    width: 35px;
  }

  .app-root {
    cursor: pointer;
  }

  .app-root:hover {
    opacity: 0.8;
  }

  .flag{
    width: 23px;
    height: 23px;
    vertical-align: middle;
    margin-bottom: 5px;
  }

  .competition-logo {
    max-width: 35px;
    max-height: 30px;
    vertical-align: middle;
  }
</style>

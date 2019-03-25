<template>
  <v-container dark>

    <v-breadcrumbs :items="items">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.text"
        :disabled="item.disabled"
        @click="navigateTo(item.link)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-flex>
      <div v-if="loading" dark>
        <v-progress-circular
          indeterminate
          color="amber">
        </v-progress-circular>
      </div>

      <v-flex v-if="!loading" id="match-info" xs10 offset-xs1>
        <v-toolbar-title>
          {{ this.match.elapsed }} {{ this.match.home.name }} {{ this.match.ftScore }} {{ this.match.away.name }}
        </v-toolbar-title>

        <div :key="event.id" v-for="event in matchEvents">
          <v-layout v-if="shouldDisplay(event)" row>
            <v-flex xs5>
                  <span v-if="match.home.teamId === event.teamId">
                   {{getEventText(event)}}
                </span>
            </v-flex>
            <v-flex xs2>{{event.minute}}:{{event.second}}'</v-flex>
            <v-flex xs5>
                  <span v-if="match.away.teamId === event.teamId">
                    {{getEventText(event)}}
                </span></v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-flex>
  </v-container>
</template>

<script>
import api from '../services/api';
import * as eventTypes from '../constants/eventTypes';

export default {
  name: 'MatchScore',
  data () {
    return {
      loading: false,
      match: undefined,
      eventTypes: eventTypes,
      items: [
        {
          text: 'Back',
          disabled: false,
          link: `/competition/${this.$route.params.name}`
        },
        {
          text: 'Match Info',
          disabled: true,
          link: `/competition/${this.$route.params.name}`
        }
      ]
    };
  },
  computed: {
    matchEvents: function () {
      if (this.match !== undefined) {
        let matchEvents = this.match.home.incidentEvents.concat(this.match.away.incidentEvents);
        return matchEvents.sort(this.compare);
      }
      return undefined;
    }
  },
  created () {
    this.fetchData();
  },
  watch: {
    // call again the method if the route changes
    //  '$route': 'match'
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    },
    getTeamById (id) {
      return id === this.match.home.teamId ? this.match.home.name : this.match.away.name;
    },
    getPlayerById (id) {
      return this.match.playerIdNameDictionary[id];
    },
    getEventText (event) {
      switch (event.type.displayName) {
        case this.eventTypes.card:
          return this.match.playerIdNameDictionary[event.playerId] + ' ' + event.cardType.displayName + ' ' + event.type.displayName;
        case this.eventTypes.substitutionOff:
          return 'OUT: ' + this.match.playerIdNameDictionary[event.playerId] + ' IN: ' + this.match.playerIdNameDictionary[event.relatedPlayerId];
        case this.eventTypes.goal:
          const assist = event.relatedPlayerId !== undefined ? ` Assisted by: ${this.match.playerIdNameDictionary[event.relatedPlayerId]}` : '';
          return this.match.playerIdNameDictionary[event.playerId] + ' GOOOAL!!! ' + assist;
        default:
          return event.type.displayName;
      }
    },
    shouldDisplay (event) {
      switch (event.type.displayName) {
        case this.eventTypes.goal:
        case this.eventTypes.card:
        case this.eventTypes.substitutionOff:
          return true;
        default:
          return false;
      }
    },
    compare (a, b) {
      if (a.minute < b.minute) {
        return -1;
      }
      if (a.minute > b.minute) {
        return 1;
      }
      if (a.second < b.second) {
        return -1;
      }
      if (a.second > b.second) {
        return 1;
      }
      return 0;
    },
    async fetchData () {
      this.error = null;
      this.loading = true;

      const matchId = this.$route.params.id;
      try {
        const match = await api().get(`matches/${matchId}`);
        this.match = match.data;
      } catch (err) {
        this.error = err.toString();
      }

      this.loading = false;
    }
  }
};

</script>

<style scoped>
  ul li {
    list-style-type: none;
    padding-left: 0px;
  }

  #match-info {
    color: coral;
  }
</style>

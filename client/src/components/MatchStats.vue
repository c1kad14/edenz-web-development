<template>
  <v-container dark>
    <v-flex>
      <div v-if="loading" dark>
        <v-progress-circular
          indeterminate
          color="amber">
        </v-progress-circular>
      </div>

      <v-flex v-if="!loading" id="match-info" xs10 offset-xs1>
        <v-toolbar-title>
          {{ this.match.home.name }} - {{ this.match.away.name }}
        </v-toolbar-title>

        <div :key="event.id" v-for="event in matchEvents">
          <v-layout row>
            <v-flex>
              {{event.home}}
            </v-flex>
            <v-flex xs2>{{event.name}}</v-flex>
            <v-flex xs5>
              {{event.away}}
            </v-flex>
          </v-layout>
        </div>
      </v-flex>
    </v-flex>
  </v-container>
</template>

<script>
import api from '../services/api';
import * as events from '../constants/matchEvents';

export default {
  name: 'MatchStats',
  data () {
    return {
      loading: false,
      match: undefined,
      events: events
    };
  },
  computed: {
    matchEvents: function () {
      if (this.match !== undefined) {
        const homeStats = this.match.home.stats;
        const awayStats = this.match.away.stats;

        let matchEvents = [];
        for (let event in this.events) {
          let homeResult = 0;
          let awayResult = 0;

          for (let val in homeStats[event]) {
            homeResult += parseInt(homeStats[event][val]);
          }

          for (let val in awayStats[event]) {
            awayResult += parseInt(awayStats[event][val]);
          }

          if (event === 'possession') {
            const homeTmp = homeResult;
            const awayTmp = awayResult;

            homeResult = `${Math.round(homeTmp / (homeTmp + awayTmp) * 100)}%`;
            awayResult = `${Math.round(awayTmp / (homeTmp + awayTmp) * 100)}%`;
          } else if (event === 'passSuccess') {
            let homeTotal = matchEvents.filter(m => m.name === this.events.passesTotal)[0].home;
            let awayTotal = matchEvents.filter(m => m.name === this.events.passesTotal)[0].away;
            let homeAccurate = matchEvents.filter(m => m.name === this.events.passesAccurate)[0].home;
            let awayAccurate = matchEvents.filter(m => m.name === this.events.passesAccurate)[0].away;
            homeResult = `${Math.floor(homeAccurate / homeTotal * 100)}%`;
            awayResult = `${Math.floor(awayAccurate / awayTotal * 100)}%`;
          }

          matchEvents.push({
            home: homeResult,
            away: awayResult,
            name: event
          });
        }

        return matchEvents;
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
    getTeamById (id) {
      return id === this.match.home.teamId ? this.match.home.name : this.match.away.name;
    },
    getPlayerById (id) {
      return this.match.playerIdNameDictionary[id];
    },
    getEventTypeIcon (event) {
      switch (event.type.displayName) {
        case this.eventTypes.card:
          return `/../../static/${event.cardType.displayName.toLowerCase()}.png`;
        case this.eventTypes.goal:
          return ['/../../static/goal.png', '/../../static/assist.png'];
        case this.eventTypes.substitutionOff:
          return ['/../../static/sub-out.png', '/../../static/sub-in.png'];
        default:
          return undefined;
      }
    },
    getEventText (event) {
      switch (event.type.displayName) {
        case this.eventTypes.card:
          return this.match.playerIdNameDictionary[event.playerId];
        case this.eventTypes.substitutionOff:
          return [this.match.playerIdNameDictionary[event.playerId], this.match.playerIdNameDictionary[event.relatedPlayerId]];
        case this.eventTypes.goal:
          const assist = event.relatedPlayerId ? this.match.playerIdNameDictionary[event.relatedPlayerId] : undefined;
          return [this.match.playerIdNameDictionary[event.playerId], assist];
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
    color: #ffb80c;
  }

  .event-icon {
    width: 15px;
    height: 15px;
    margin-top: 5px;
  }
</style>

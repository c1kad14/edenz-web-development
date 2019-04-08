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
          {{ this.match.home.name }} {{ this.match.ftScore }} {{ this.match.away.name }}
        </v-toolbar-title>

        <div :key="event.id" v-for="event in matchEvents">
          <v-layout v-if="shouldDisplay(event)" row>
            <v-flex xs5>
                  <span v-if="match.home.teamId === event.teamId">
                    <span v-if="getEventText(event) instanceof Array">
                      <span class="event-text"> {{getEventText(event)[0]}} </span>
                      <img class="event-icon" :src="getEventTypeIcon(event)[0]"/>
                      <span class="event-text"> {{getEventText(event)[1]}} </span>
                      <img class="event-icon" v-if="getEventText(event)[1]" :src="getEventTypeIcon(event)[1]"/>
                    </span>
                    <span v-else>
                      <span class="event-text"> {{getEventText(event)}} </span>
                    <img class="event-icon" v-if="getEventTypeIcon(event) !== undefined"
                         :src="getEventTypeIcon(event)"/>
                    </span>
                </span>
            </v-flex>
            <v-flex xs2>{{event.minute}}'</v-flex>
            <v-flex xs5>
                  <span v-if="match.away.teamId === event.teamId">
                   <span v-if="getEventText(event) instanceof Array">
                      <span class="event-text"> {{getEventText(event)[0]}} </span>
                      <img class="event-icon" :src="getEventTypeIcon(event)[0]"/>
                     <span class="event-text"> {{getEventText(event)[1]}} </span>
                      <img class="event-icon" v-if="getEventText(event)[1]" :src="getEventTypeIcon(event)[1]"/>
                    </span>
                    <span v-else>
                      <span class="event-text"> {{getEventText(event)}} </span>
                    <img class="event-icon" v-if="getEventTypeIcon(event) !== undefined"
                         :src="getEventTypeIcon(event)"/>
                    </span>
                </span>
            </v-flex>
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
  name: 'MatchEvents',
  data () {
    return {
      loading: false,
      match: undefined,
      eventTypes: eventTypes
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

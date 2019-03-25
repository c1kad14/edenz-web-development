<template>
  <v-container dark>
    <v-content>
      <v-layout>
        <v-flex xs12 class="">
          <div v-if="loading" dark>
            <v-progress-circular
              indeterminate
              color="amber"
            ></v-progress-circular>
          </div>

          <v-data-table
            v-if="!loading"
            :headers="headers"
            :items="items"
            class="elevation-1"
            hide-actions
          >
            <template slot="items" slot-scope="items">
              <tr :teamId="items.item.name" class="score">
                <td class="text-xs-center">{{ items.item.position }}</td>
                <td class="text-xs-center">{{ items.item.team }}</td>
                <td class="text-xs-center">{{ items.item.games }}</td>
                <td class="text-xs-center">{{ items.item.points }}</td>
                <td class="text-xs-center">{{ items.item.wins }}</td>
                <td class="text-xs-center">{{ items.item.draws }}</td>
                <td class="text-xs-center">{{ items.item.losses }}</td>
                <td class="text-xs-center">{{ items.item.scored }}</td>
                <td class="text-xs-center">{{ items.item.missed }}</td>
                <td class="text-xs-center">{{ items.item.diff }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-content>
  </v-container>
</template>

<script>
import api from '../services/api';

export default {

  name: 'Summary',
  data () {
    return {
      loading: false,
      headers: [{text: '#', value: 'number', sortable: false, align: 'center'},
        {text: 'Team', value: 'team', sortable: false, align: 'center'},
        {text: 'G', value: 'games', sortable: false, align: 'center'},
        {text: 'PTS', value: 'pts', sortable: false, align: 'center'},
        {text: 'W', value: 'wins', sortable: false, align: 'center'},
        {text: 'D', value: 'draws', sortable: false, align: 'center'},
        {text: 'L', value: 'losses', sortable: false, align: 'center'},
        {text: 'GS', value: 'scored', sortable: false, align: 'center'},
        {text: 'GM', value: 'missed', sortable: false, align: 'center'},
        {text: 'GD', value: 'diff', sortable: false, align: 'center'}
      ],
      matches: undefined
    };
  },
  watch: {
    '$route.params.name': function () {
      this.fetchData();
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData();
  },
  computed: {
    items: function () {
      if (this.matches !== undefined) {
        let unique = {};
        let teams = [];
        this.matches.forEach(function (x) {
          if (!unique[x.home]) {
            teams.push(x.home);
            unique[x.home] = true;
          }
        });

        let teamStatistics = teams.map(team => {
          let teamStats = {
            position: 0,
            team: team,
            games: 0,
            points: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            scored: 0,
            missed: 0
          };

          this.matches.forEach(match => {
            if (match.home === team || match.away === team) {
              teamStats.games++;
              let goals = match['score'].split(':');
              let homeGoals = parseInt(goals[0]);
              let awayGoals = parseInt(goals[1]);
              let result = homeGoals > awayGoals ? 1 : homeGoals < awayGoals ? 2 : 0;

              switch (team) {
                case match.home:
                  teamStats.scored += homeGoals;
                  teamStats.missed += awayGoals;

                  switch (result) {
                    case 0:
                      teamStats.draws++;
                      teamStats.points++;
                      break;
                    case 1:
                      teamStats.wins++;
                      teamStats.points += 3;
                      break;
                    case 2:
                      teamStats.losses++;
                      break;
                  }

                  break;
                case match.away:
                  teamStats.scored += awayGoals;
                  teamStats.missed += homeGoals;

                  switch (result) {
                    case 0:
                      teamStats.draws++;
                      teamStats.points++;
                      break;
                    case 1:
                      teamStats.losses++;
                      break;
                    case 2:
                      teamStats.wins++;
                      teamStats.points += 3;
                      break;
                  }
                  break;
              }
            }
          });
          teamStats.diff = teamStats.scored - teamStats.missed;
          return teamStats;
        });

        teamStatistics = teamStatistics.sort(this.compare);
        teamStatistics.forEach((t, i) => {
          t.position = i + 1;
        });

        return teamStatistics;
      }
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    },
    async fetchData () {
      this.error = null;
      this.loading = true;

      const paramName = this.$route.params.name;
      let fields = [];
      switch (paramName) {
        case 'english-premier-league':
          fields.push({'key': 'competition', 'value': 'Premier League'}, {'key': 'country', 'value': 'England'});
          break;
        case 'english-championship':
          fields.push({'key': 'competition', 'value': 'Championship'},
            {'key': 'country', 'value': 'England'});
          break;
        case 'french-ligue-1':
          fields.push({'key': 'competition', 'value': 'Ligue 1'},
            {'key': 'country', 'value': 'France'});
          break;
        case 'german-bundesliga':
          fields.push({'key': 'competition', 'value': 'Bundesliga'},
            {'key': 'country', 'value': 'Germany'});
          break;
        case 'german-2nd-bundesliga':
          fields.push({'key': 'competition', 'value': '2nd Bundesliga'},
            {'key': 'country', 'value': 'Germany'});
          break;
        case 'italian-seria-a':
          fields.push({'key': 'competition', 'value': 'Seria A'},
            {'key': 'country', 'value': 'Italy'});
          break;
        case 'spanish-laliga':
          fields.push({'key': 'competition', 'value': 'LaLiga Santander'},
            {'key': 'country', 'value': 'Spain'});
          break;
        case 'portugese-primeira-liga':
          fields.push({'key': 'competition', 'value': 'Primeira Liga'},
            {'key': 'country', 'value': 'Portugal'});
          break;
        case 'dutch-eredivisie':
          fields.push({'key': 'competition', 'value': 'Eredivisie'},
            {'key': 'country', 'value': 'Netherlands'});
          break;
        default:
          throw Error('Unknown competition');
      }

      try {
        const matches = await api().post('filterMatches', {
          predicate: {
            fields: fields
          }
        });
        this.matches = matches.data;
      } catch (err) {
        this.error = err.toString();
      }

      this.loading = false;
    },
    compare (a, b) {
      if (a.points > b.points) {
        return -1;
      }
      if (a.points < b.points) {
        return 1;
      }
      if (a.diff > b.diff) {
        return -1;
      }
      if (a.diff < b.diff) {
        return 1;
      }
      return 0;
    }
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {
    cursor: pointer
  }
</style>

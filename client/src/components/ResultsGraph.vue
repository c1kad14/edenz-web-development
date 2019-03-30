<template>
  <v-container class="standings-graph-container border" dark>
    <line-chart v-if="chartData !== null" class="standings-graph-container"
                :chart-data="chartData" />
  </v-container>
</template>

<script>
import LineChart from './LineChart.vue';
import api from '../services/api';

export default {
  name: 'ResultsGraph',
  components: {LineChart},
  data: () => ({
    chartData: null,
    matches: []
  }),
  watch: {
    '$route.params.name': function () {
      this.fetchData();
    }
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
  async mounted () {
    try {
      await this.fetchData();

      let labels = this.items.map(i => i.team);
      let gData = this.items.map(i => i.points);

      this.chartData = {
        labels: labels,
        datasets: [{
          label: '# of Points',
          data: gData,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)', 'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1,
          fill: false,
          showLine: true,
          borderCapStyle: "square",
          borderColor: "#ffb80c",
          borderWidth: 1
        }]
      };
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async fetchData () {
      this.error = null;

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
        case 'italian-serie-a':
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

<style>
  .standings-graph-container #bar-chart {
    width: 100% !important;
    max-width: 500px;
    min-width: 300px;
    padding: 0px;
  }
</style>

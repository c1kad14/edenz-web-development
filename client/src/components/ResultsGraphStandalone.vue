<template>
  <v-container class="standings-graph-container border" dark>
    <v-breadcrumbs :items="navItems">
      <v-breadcrumbs-item
        v-for="item in navItems"
        :key="item.text"
        :disabled="item.disabled"
        @click="navigateTo(item.link)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-list-tile router :to="`/competition/${this.$route.params.name}/results-graph`">Results</v-list-tile>
    <line-chart v-if="chartData !== null" class="standings-graph-container"
                :chart-data="chartData"
                :options="options"/>
  </v-container>
</template>

<script>
import LineChart from './LineChart.vue';
import api from '../services/api';

export default {
  name: 'ResultsGraph',
  components: {LineChart},
  data: () => ({
    matches: [],
    chartData: null,
    options: {responsive: true, maintainAspectRatio: false}
  }),
  computed: {
    items () {
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
    },
    navItems () {
      if (!this.$route) {
        return;
      }
      return [
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
      ];
    }
  },
  watch: {
    '$route.params.name': function () {
      this.fetchData();
    }
  },
  async mounted () {
    try {
      await this.fetchData();
      this.getChartData();
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    },
    getChartData () {
      if (this.matches !== undefined) {
        let unique = {};
        let teams = [];
        this.matches.forEach(function (x) {
          if (!unique[x.home]) {
            teams.push(x.home);
            unique[x.home] = true;
          }
        });

        let teamsData = [];
        let maxMatchesNumber = 0;
        teams.forEach(team => {
          let teamMatches = this.matches.filter(match => match.home === team || match.away === team).sort(this.compare);
          let teamResult = [];
          let teamPoints = 0;
          maxMatchesNumber = maxMatchesNumber < teamMatches.length ? teamMatches.length : maxMatchesNumber;
          teamMatches.forEach(teamMatch => {
            let goals = teamMatch['score'].split(':');
            let homeGoals = parseInt(goals[0]);
            let awayGoals = parseInt(goals[1]);
            let result = homeGoals > awayGoals ? 1 : homeGoals < awayGoals ? 2 : 0;

            switch (team) {
              case teamMatch.home:
                switch (result) {
                  case 0:
                    teamPoints++;
                    break;
                  case 1:
                    teamPoints += 3;
                    break;
                  case 2:
                    break;
                }
                break;
              case teamMatch.away:
                switch (result) {
                  case 0:
                    teamPoints++;
                    break;
                  case 1:
                    break;
                  case 2:
                    teamPoints += 3;
                    break;
                }
                break;
            }

            teamResult.push(teamPoints);
          });
          teamsData.push(
            {
              label: team,
              data: teamResult,
              backgroundColor: [
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`
              ],
              borderColor: [
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`
              ],
              borderWidth: 1,
              fill: false
            }
          );
        });

        let labels = [];
        for (let i = 1; i <= maxMatchesNumber; i++) {
          labels.push(i);
        }

        this.chartData = {
          labels: labels,
          datasets: teamsData
        };
      }
    },
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
      if (new Date(a.startTime) < new Date(b.startTime)) {
        return -1;
      }
      if (new Date(a.startTime) > new Date(b.startTime)) {
        return 1;
      }

      return 0;
    }
  }
};
</script>

<style>
</style>

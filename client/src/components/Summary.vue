<template>
  <v-container dark>
    <v-layout justify-space-between>
      <v-flex>
        <div v-if="loading" dark>
          <v-progress-circular
            indeterminate
            color="amber"
          ></v-progress-circular>
        </div>
        <v-text-field
          flat
          label="Search team"
          prepend-inner-icon="search"
          solo-inverted
          dark
        ></v-text-field>
        <v-data-table
          v-if="!loading"
          :headers="headers"
          :items="items"
          class="elevation-1"
          hide-actions
        >
          <template slot="items" slot-scope="items">
            <tr :matchId="items.item._id" class="score  "
                @click="navigateTo(`${$route.params.name}/match/${items.item._id}`)">
              <td class="text-xs-center">{{ prettyDate(items.item.startTime) }}</td>
              <td class="text-xs-center">{{ items.item.home }}</td>
              <td class="text-xs-center">{{ items.item.ftScore }}
              </td>
              <td class="text-xs-center ">{{ items.item.away }}</td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex id="picker">
        <v-date-picker ref="picker" v-model="date" :picker-date.sync="pickerDate" :events="events"
        ></v-date-picker>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Summary',
  data () {
    return {
      loading: false,
      headers: [{text: 'Date', value: 'date', sortable: false, align: 'center'},
        {text: 'Home', value: 'home', sortable: false, align: 'center'},
        {text: 'Score', value: 'score', sortable: false, align: 'center'},
        {text: 'Away', value: 'away', sortable: false, align: 'center'}],
      items: [],
      pickerDate: null,
      date: null,
      events: null
    };
  },
  watch: {
    // call again the method if the route changes
    '$route.params.name': function () {
      this.fetchData();
    },
    async pickerDate () {
      await this.fetchData(false);
    },
    async date () {
      await this.fetchData(true);
    }
  },
  methods: {
    navigateTo (route) {
      console.log(route);
      this.$router.push(route);
    },
    prettyDate (date) {
      let prettyDate = new Date(`${date}Z`).toUTCString();
      return `${prettyDate.substr(5, 6)}, ${prettyDate.substr(17, 5)}`;
    },
    async fetchData (day) {
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

      this.error = null;
      this.loading = true;

      if (this.pickerDate === null) {
        return;
      }

      try {
        const matches = await api().post('filterMatches', {
          predicate: {
            fields: fields,
            regExp: {
              'key': 'startTime',
              'value': `^${day ? this.date : this.pickerDate}`
            }
          }
        });
        this.items = matches.data.sort(this.compare);
      } catch (err) {
        this.error = err.toString();
      }

      if (!day) {
        this.events = this.items.map(match => new Date(`${match.startTime}Z`).toISOString().substr(0, 10));
      }

      this.loading = false;
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {
    cursor: pointer
  }

  #picker {
    margin-left: 10px;
  }
</style>

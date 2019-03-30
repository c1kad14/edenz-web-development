<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-container id="summary-container" dark class="border">
    <v-layout>
      <v-flex id="summary-list">
        <div v-if="loading">
          <v-progress-circular
            indeterminate
            color="amber"
          ></v-progress-circular>
        </div>
        <table class="table-section">
          <thead>
          <tr>
            <th class="summary-header">
              <v-menu v-model="menu2" :close-on-content-click="false">
                <template v-slot:activator="{ on }">
                  <v-text-field
                    class="date-text-field"
                    v-model="textDate"
                    label="Date"
                    readonly
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-if="events !== undefined" ref="picker" v-model="date" :picker-date.sync="pickerDate"
                               :events="events" :allowed-dates="allowedDates" no-title @input="menu2 = false"/>
              </v-menu>
            </th>
            <th :key="headers[0].text" class="summary-header">{{headers[0].text}}</th>
            <th :key="headers[1].text" style="width: 15%">{{headers[1].text}}</th>
            <th :key="headers[2].text" class="summary-header">{{headers[2].text}}</th>
          </tr>
          </thead>
          <tbody>
          <tr :key="item._id" class="score" @click="navigateTo(`${$route.params.name}/match/${item._id}`)"
              v-for="item in items">
            <td>{{ prettyDate(item.startTime) }}</td>
            <td>{{ item.home }}</td>
            <td style="width:15%">{{ item.ftScore }}
            </td>
            <td>{{ item.away }}</td>
          </tr>
          </tbody>
        </table>
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
      headers: [
        {text: 'Home', value: 'home', sortable: false, align: 'center'},
        {text: 'Score', value: 'score', sortable: false, align: 'center'},
        {text: 'Away', value: 'away', sortable: false, align: 'center'}],
      items: [],
      pickerDate: null,
      date: null,
      events: null,
      menu2: false,
      byDay: false
    };
  },
  computed: {
    textDate: function () {
      return this.byDay ? this.date : this.pickerDate;
    }
  },
  watch: {
    // call again the method if the route changes
    '$route.params.name': function () {
      this.byDay = false;
      this.fetchData();
    },
    async pickerDate () {
      this.byDay = false;
      await this.fetchData();
    },
    async date () {
      this.byDay = true;
      await this.fetchData();
    }
  },
  methods: {
    navigateTo (route) {
      console.log(route);
      this.$router.push(route);
    },
    allowedDates (val) {
      if (this.events !== null) {
        return this.events.indexOf(val) > -1;
      }
      return true;
    },
    prettyDate (date) {
      let prettyDate = new Date(`${date}Z`).toUTCString();
      return `${prettyDate.substr(5, 6)}, ${prettyDate.substr(17, 5)}`;
    },
    async fetchData () {
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

      try {
        const matches = await api().post('filterMatches', {
          predicate: {
            fields: fields,
            regExp: {
              'key': 'startTime',
              'value': `^${this.byDay ? this.date : this.pickerDate}`
            }
          }
        });
        this.items = matches.data.sort(this.compare);
      } catch (err) {
        this.error = err.toString();
      }

      if (!this.byDay) {
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

  #summary-container {
    max-width: 500px;
    min-width: 360px;
    width: 100%;
    text-align: center;
  }

  table.table-section {
    display: table;
    width: 100%;
  }

  table.table-section thead, table.table-section tbody {
    float: left;
    width: 100%;
  }

  table.table-section thead tr {
    padding-right: 15px;
    border-bottom: 3px #ffb80c solid;
    margin-bottom: 2px;
  }

  table.table-section tbody {
    overflow: auto;
    height: 380px;
  }

  table.table-section tbody tr {
    border-bottom: 1px #ffb80c solid;
    margin-bottom: 5px;
    height: 40px;
    padding-right: 5px;
  }

  table.table-section tbody tr:hover {
    opacity: 0.7;
  }

  table.table-section tr {
    width: 100%;
    display: table;
    font-size: 10pt;
  }

  table.table-section tr td {
    width: 25%;
    text-align: center;
  }

  .summary-header {
    width: 25%;
    text-align: center;
  }

  .date-text-field {
    font-size: 10pt;
  }
</style>

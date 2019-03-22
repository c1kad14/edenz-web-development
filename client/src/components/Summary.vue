<template>
  <v-container dark>
    <v-content>
      <v-layout class="">
        <v-flex xs10 class="">
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
              <tr :matchId="items.item._id" class="score  " @click="navigateTo(`match/${items.item._id}`)">
                <td class="text-xs-center">{{ prettyDate(items.item.startTime) }}</td>
                <td class="text-xs-center">{{ items.item.home }}</td>
                <td class="text-xs-center">{{ items.item.ftScore }}
                </td>
                <td class="text-xs-center ">{{ items.item.away }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>

        <v-flex class="" offset-xs1>
          <v-date-picker ref="picker" v-model="date" :picker-date.sync="pickerDate" :events="events"
          ></v-date-picker>
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
  // created () {
  //   // fetch the data when the view is created and the data is
  //   // already being observed
  //   this.fetchData();
  // },
  watch: {
    // call again the method if the route changes
    // '$route': 'summary',
    async pickerDate () {
      await this.fetchData(false);
    },
    async date () {
      await this.fetchData(true);
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    },
    prettyDate (date) {
      let prettyDate = new Date(`${date}Z`).toUTCString();
      return `${prettyDate.substr(5, 6)}, ${prettyDate.substr(17, 5)}`;
    },
    async fetchData (day) {
      this.error = null;
      this.loading = true;

      if (this.pickerDate === null) {
        return;
      }

      try {
        const matches = await api().post('filterMatches', {
          predicate: {
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
</style>

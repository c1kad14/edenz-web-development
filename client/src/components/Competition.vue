<template>
  <v-content>
    <v-layout id="competition-container" wrap dark>
      <v-flex class="competition-item">
        <Table/>
      </v-flex>
      <v-flex class="competition-item">
        <Summary/>
      </v-flex>
      <v-flex class="competition-item">
        <StandingsGraph/>
      </v-flex>
      <v-flex class="competition-item">
        <ResultsGraph/>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import Summary from './Summary.vue';
import Table from './Table.vue';
import StandingsGraph from './StandingsGraph.vue';
import ResultsGraph from './ResultsGraph.vue';

export default {
  name: 'Competition',
  components: {Summary, Table, StandingsGraph, ResultsGraph},
  data () {
    return {
      tab: null,
      components: {
        Summary,
        Table,
        StandingsGraph,
        ResultsGraph
      }
    };
  },
  watch: {},
  methods: {},
  create () {
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {
    cursor: pointer
  }

  #competition-container {
    width: 100%;
  }

  #competition-container .competition-item {
    display: table;
    margin: 0 auto;
    margin-bottom: 1%;
  }
</style>

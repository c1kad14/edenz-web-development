<template>
  <v-container dark>
    <v-content>
      <v-tabs
        dark
        centered
        slider-color="yellow"
        grow
      >
        <v-tab ripple>
          Summary
        </v-tab>
        <v-tab ripple>
          Table
        </v-tab>
        <v-tab-item>
          <v-card flat>
            <Summary />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
           <Table />
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-content>
  </v-container>
</template>

<script>
import Summary from './Summary.vue';
import Table from './Table.vue';

export default {

  name: 'Competition',
  components: {Summary, Table},
  data () {
    return {
      tab: null,
      components: {
        Summary,
        Table
      }
    };
  },
  watch: {},
  methods: {},
  create () {
    console.log(this.$router);
    console.log('this.$router');
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .score {
    cursor: pointer
  }
</style>

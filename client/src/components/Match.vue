<template>
  <v-container dark>
    <v-breadcrumbs :items="items">
      <v-breadcrumbs-item
        v-for="item in items"
        :key="item.text"
        :disabled="item.disabled"
        @click="navigateTo(item.link)">
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>

    <v-tabs
      dark
      centered
      slider-color="yellow"
      grow
    >
      <v-tab ripple>
        MatchEvents
      </v-tab>
      <v-tab ripple>
        MatchStats
      </v-tab>
      <v-tab-item>
        <v-card flat>
          <MatchEvents/>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <v-card flat>
          <MatchStats/>
        </v-card>
      </v-tab-item>
    </v-tabs>
  </v-container>
</template>

<script>
import MatchEvents from './MatchEvents.vue';
import MatchStats from './MatchStats.vue';

export default {
  name: 'Match',
  components: {MatchEvents, MatchStats},
  data () {
    return {
      tab: null,
      components: {
        MatchEvents,
        MatchStats
      },
      items: [
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
      ]
    };
  },
  watch: {},
  methods: {
    navigateTo (route) {
      this.$router.push(route);
    }
  },
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

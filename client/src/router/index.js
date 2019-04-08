import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Register from '@/components/Register';
import Login from '@/components/Login';
import Match from '@/components/Match';
import Competition from '@/components/Competition';
import ResultsGraphStandalone from '@/components/ResultsGraphStandalone';
import StandingsGraphStandalone from '@/components/StandingsGraphStandalone';

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/competition/:name/match/:id',
      name: 'Match',
      component: Match
    },
    {
      path: '/competition/:name',
      name: 'Competition',
      component: Competition
    },
    {
      path: '/competition/:name/standings-graph',
      name: 'Standings',
      component: StandingsGraphStandalone
    },
    {
      path: '/competition/:name/results-graph',
      name: 'Results',
      component: ResultsGraphStandalone
    }
  ],
  hashbang: false,
  mode: 'history'
});

export default router;

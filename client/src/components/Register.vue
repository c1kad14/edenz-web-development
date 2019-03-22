<template>
  <v-content>
    <v-flex xs6 offset-xs3>
      <v-toolbar flat dense class="grey darken-3">
        <v-toolbar-title>Register</v-toolbar-title>
      </v-toolbar>

      <div class="pl-4 pr-4 pt-2 pb-2">
        <v-text-field label="email" v-model="email"/>
        <br>
        <v-text-field label="password" type="password" v-model="password"/>
        <br/>
        <div class="danger-alert" v-html="error"></div>
        <br>
        <v-btn class="green darken-1 white-font" @click="register">Register</v-btn>
      </div>
    </v-flex>
  </v-content>
</template>

<script>

import auth from '../services/auth';

export default {
  name: 'Register',
  data () {
    return {
      email: '',
      password: '',
      error: null
    };
  },
  watch: {
    email (value) {
      console.log(`email has changed: ${value}`);
    }
  },
  methods: {
    async register () {
      try {
        await auth.register({email: this.email, password: this.password});
      } catch (err) {
        this.error = err.response.data.error;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

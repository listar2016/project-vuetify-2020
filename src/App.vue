<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />
        <h1> Project</h1>
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <project-details 
        :project-id="projectId"
        :start-date="startDate"
        :end-date="endDate"
      >
      </project-details>  
    </v-content>
  </v-app>
</template>

<script>
import ProjectDetails from './components/ProjectDetails'

export default {
  name: 'App',
  components: {
    ProjectDetails
  },

  data: () => ({
    projectId: 1,
    startDate: '2020-01-01',
    endDate: '2020-06-01'
  }),
  
};
</script>

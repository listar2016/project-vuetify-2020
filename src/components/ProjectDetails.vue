<template>
  <div>
    <v-progress-linear
      v-if="isProgress"
      indeterminate
      color="blue darken-2"
    ></v-progress-linear>
    <v-container fluid>
      <v-row class="text-center">
        <v-col>
          <h1 class="display-2 font-weight-bold mb-3">
            Project Dependencies
          </h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="auto" class="ml-auto">
        </v-col>
      </v-row>
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th>Employee*</th>
              <th>Role*</th>
              <th>Start Date*</th>
              <th>End Date*</th>
              <th>Rate per Hour*</th>
              <th>Overtime Rate per Hour</th>
              <th>Set hours per Month</th>
              <th>Percentage allocation*</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="(item, index) in dependencyList" 
              :key="index" 
              :class="{'inactive': item.end_date < curDate}"
            >
              <td>
                {{getEmployee(item.employee)}}
              </td>
              <td>
                {{getRole(item.role)}}
              </td>
              <td>
                {{item.start_date}}
              </td>
              <td>
                {{item.end_date}}
              </td>
              <td>
                {{item.rate}}
              </td>
              <td>
                {{item.overtime_rate}}
              </td>
              <td>
                {{item.set_hours_per_month}}
              </td>
              <td>
                {{item.percentage_allocation}}
              </td>
              <td>
                <v-btn icon color="red" @click="deleteDependency(item.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
                <v-btn icon color="green" @click="editDependency(item)">
                  <v-icon>edit</v-icon>
                </v-btn>
              </td>
            </tr>

          </tbody>
        </template>
      </v-simple-table>
      <v-row>
        <v-col>
          <v-btn 
            small
            tile
            color="success" 
            @click="addDependency"
          >
            <v-icon left>add</v-icon>
          Add Row
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            text
          >
            Back
          </v-btn>
          <v-btn
            text
          >
            Back to Billing
          </v-btn>
        </v-col>
      </v-row>
      <v-dialog 
        v-model="showDialog" 
        persistent
        max-width="600px"
      >
        <v-form
          v-model="validData"
        >
          <v-card>
            <v-card-title
              class="headline grey lighten-2"
              primary-title
            >
              {{curDependency.id ? 'Edit Dependency' : 'New Dependency'}}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col>
                  <v-autocomplete
                    v-model="curDependency.employee"
                    :items="employeeList"
                    :key="curDependency.employee"
                    item-text="full_name"
                    item-value="id"
                    label="Employee*"
                    :rules="[rules.required]"
                    hide-details="auto"
                  ></v-autocomplete>
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="curDependency.role"
                    :items="roleList"
                    :key="curDependency.role"
                    item-text="level"
                    item-value="id"
                    label="Role*"
                    :rules="[rules.required]"
                    hide-details="auto"
                  ></v-autocomplete>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-menu
                    ref="menuStartDate"
                    v-model="menuStartDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="curDependency.start_date"
                        label="Start Date*"
                        append-icon="event"
                        readonly
                        v-on="on"
                        @click:append="menuStartDate=!menuStartDate"
                        :rules="[rules.required]"
                        hide-details="auto"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="curDependency.start_date"
                      @input="menuStartDate = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
                <v-col>
                  <v-menu
                    ref="menuEndDate"
                    v-model="menuEndDate"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="curDependency.end_date"
                        label="End Date*"
                        append-icon="event"
                        readonly
                        v-on="on"
                        @click:append="menuEndDate=!menuEndDate"
                        :rules="[rules.required]"
                        hide-details="auto"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="curDependency.end_date"
                      :min="curDependency.start_date"
                      @input="menuEndDate = false"
                    >
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="curDependency.rate"
                    :rules="[rules.required, rules.minValue]"
                    hide-details="auto"
                    label="Rate per Hour*"
                    type="number"
                    min="0"
                    max="99999"
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="curDependency.overtime_rate"
                    :rules="[rules.minValue]"
                    hide-details="auto"
                    label="Overtime Rate per Hour"
                    type="number"
                    min="0"
                    max="99999"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-text-field
                    v-model="curDependency.set_hours_per_month"
                    :rules="[rules.minValue]"
                    hide-details="auto"
                    label="Set hours per Month"
                    type="number"
                    min="0"
                    max="99999"
                  >
                  </v-text-field>
                </v-col>
                <v-col>
                  <v-text-field
                    v-model="curDependency.percentage_allocation"
                    :rules="[rules.required, rules.percentage]"
                    hide-details="auto"
                    label="Percentage allocation*"
                    type="number"
                    min="1"
                    max="100"
                  >
                  </v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text
                @click="showDialog = false"
              >
                Cancel
              </v-btn>  
              <v-btn
                color="primary"
                :disabled="!validData"
                @click="saveDependency"
              >
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-container>
    <v-snackbar
      v-model="snackbar"
    >
      {{ message }}
      <v-btn
        color="pink"
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>  
  </div>
</template>
<script>

import axios from 'axios'
export default {
  name: 'ProjectDetails',
  props: [
    'projectId',
    'startDate',
    'endDate'
  ],
  data: () => ({
    dependencyList:[],
    employeeList:[],
    roleList: [],
    menuStartDate: false,
    menuEndDate: false,
    validData: false,
    rules: {
      required: value => !!value || 'Required.',
      minValue: value => value >= 0 || 'Invalid Number',
      percentage: value => (value >= 1 && value <= 100) || 'Invalid Percent'
    },
    showDialog: false,
    emptyDependency: {
      id: null,
      employee: 0,
      role: 0,
      start_date: null,
      end_date: null,
      rate: null,
      overtime_rate: null,
      set_hours_per_month: null,
      percentage_allocation: 100
    },
    curDependency: {},
    isProgress: false,
    snackbar: false,
    message: ''
  }),
  computed: { 
    curDate() {
      return new Date().toJSON().slice(0,10);
    }
  },
  created() {
    this.getBasicData()
    this.getDependencies()
  },
  methods: {
    async getBasicData() {
      let vm = this
      vm.employeeList = []
      await axios({url: `/employee`, method: 'GET'})
        .then(resp => {
          if (resp.status === 200) {
            resp.data.forEach(element => {
              vm.employeeList.push({
                id: element.user.id,
                full_name: element.full_name
              })
            });
          }
        })
      vm.roleList = [] 
      await axios({url: `/position`, method: 'GET'})
        .then(resp => {
          if (resp.status === 200) {
            vm.roleList = resp.data
          }
        })
    },
    async getDependencies() {
      let vm = this
      vm.departmentList = []
      await axios({url: `/projectdependency?project=${this.projectId}`, method: 'GET'})
        .then(resp => {
          if (resp.status === 200) {
            vm.dependencyList = resp.data
            vm.dependencyList.sort((a, b) => (a.end_date > b.end_date) ? 1 : -1)
          }
        })
    },
    addDependency() {
      this.curDependency = {...this.emptyDependency}
      this.curDependency.start_date = this.startDate
      this.curDependency.end_date = this.endDate
      this.showDialog = true
    },
    editDependency(item) {
      this.curDependency = {...item}
      this.showDialog = true
    },
    deleteDependency(id) {
      let vm = this
      vm.isProgress = true
      axios({url: `/projectdependency/${id}/`, method: 'DELETE'})
        .then(() => {
          let curIndex = vm.dependencyList.findIndex(item => item.id === id)
          vm.dependencyList.splice(curIndex, 1)
          vm.message = "Dependency was deleted successfully!"
          vm.snackbar = true
          vm.isProgress = false
        })
        .catch(err => {
          vm.isProgress = false
          vm.message = err
          vm.snackbar = true
          
        })
    },
    saveDependency() {
      let vm = this
      let param = {
        project: vm.projectId,
        id: vm.curDependency.id,
        employee: vm.curDependency.employee,
        role: vm.curDependency.role,
        start_date: vm.curDependency.start_date,
        end_date: vm.curDependency.end_date,
        rate: vm.curDependency.rate,
        overtime_rate: vm.curDependency.overtime_rate ? vm.curDependency.overtime_rate : vm.curDependency.rate,
        set_hours_per_month: vm.curDependency.set_hours_per_month,
        percentage_allocation: vm.curDependency.percentage_allocation ? vm.curDependency.percentage_allocation : 100
      }
      vm.isProgress = true
      if (vm.curDependency.id) {
        axios({url: `/projectdependency/${vm.curDependency.id}/`, data: param, method: 'PATCH'})
          .then(resp => {
            let curIndex = vm.dependencyList.findIndex(item => item.id === vm.curDependency.id)
            vm.dependencyList.splice(curIndex, 1, resp.data)
            vm.dependencyList.sort((a, b) => (a.end_date > b.end_date) ? 1 : -1)
            vm.message = "Dependency was updated successfully!"
            vm.snackbar = true
            vm.isProgress = false
          }).catch(err => {
            vm.message = err
            vm.snackbar = true
            vm.isProgress = false
          })

      } else {
        axios({url: `/projectdependency/`, data: param, method: 'POST'})
          .then(resp => {
            vm.dependencyList.push(resp.data)
            vm.dependencyList.sort((a, b) => (a.end_date > b.end_date) ? 1 : -1)
            vm.message = "Dependency was added successfully!"
            vm.snackbar = true
            vm.isProgress = false
          }).catch(err => {
            vm.message = err
            vm.snackbar = true
            vm.isProgress = false
          })
      }
      vm.showDialog = false
    },
    getEmployee(id) {
      let data = this.employeeList.find(item => item.id === id)
      if (data) {
        return data.full_name
      } else {
        return null
      }
    },
    getRole(id) {
      let data = this.roleList.find(item => item.id === id)
      if (data) {
        return data.level
      } else {
        return null
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .inactive {
    background-color: lightyellow
  }
</style>
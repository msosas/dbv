<template>
  <q-page class="flex justify-center" >
      <div style="width: 80%;">
        <h3 style="text-align: center;">Commit & Push</h3>
        <q-list>
          <q-list-header>Mensaje</q-list-header>
          <q-item>
            <q-item-main>
              <q-input
                v-model="message"
                clearable
                type="text"
              />
            </q-item-main>
          </q-item>
          <q-item>
            <q-item-main style="text-align: center;">
              <q-btn icon="check" label="Aplicar" color="positive" @click="commit()"/>
              <q-btn icon="settings_backup_restore" label="Rollback" @click="rollback()" color="deep-purple" />
              <q-btn icon="cloud_upload" label="Push" color="warning" @click="push()"/>
            </q-item-main>
          </q-item>
        </q-list>
    </div>
  </q-page>
</template>

<script type="text/javascript">
var baseUrl = 'http://localhost:4001'
import axios from 'axios'
import { Loading, Notify, QSpinnerPuff } from 'quasar'
export default {
  data () {
    return {
      message: '',
      branch: '',
      branches: []
    }
  },
  methods: {
    commit () {
      if (this.message === '') {
        Notify.create({
          message: 'Escriba un mensaje para su commit',
          color: 'negative'
        })
      } else {
        Loading.show({ delay: 0 })
        axios.post(baseUrl + '/commit', 'message=' + this.message)
          .then(({ data }) => {
            console.log(data)
            if (data === 'OK') {
              Notify.create({
                message: data,
                color: 'positive'
              })
              Loading.hide()
            } else {
              Notify.create({
                message: data,
                color: 'warning'
              })
              Loading.hide()
            }
          })
          .catch(error => {
            Notify.create('Ocurrió un error, no se puede hacer commit')
            console.log(error)
            Loading.hide()
          })
      }
    },
    rollback () {
      Loading.show({ delay: 0 })
      axios.post(baseUrl + '/rollback')
        .then(({ data }) => {
          if (data === 'OK') {
            Notify.create({
              message: data,
              color: 'positive'
            })
            Loading.hide()
          }
        })
        .catch(error => {
          Notify.create('Ocurrió un error, no se puede hacer rollback')
          console.log(error)
        })
    },
    // PUSH
    push () {
      Loading.show({
        spinner: QSpinnerPuff,
        spinnerSize: 250,
        delay: 0,
        message: 'Haciendo push...'
      })
      console.log('test')
      axios.post(baseUrl + '/push', 'localBranch=' + this.branch)
        .then(({ data }) => {
          Notify.create({
            message: 'OK',
            color: 'positive'
          })
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Ocurrió un error, no se puede hacer push')
          console.log(error)
          Loading.hide()
        })
    },
    getBranches () {
      axios.get(baseUrl + '/get_branches')
        .then(({ data }) => {
          this.branches = data
          for (var i = 0; i < this.branches.length; i++) {
            if (this.branches[i][0] === '*') {
              this.branch = this.branches[i].slice(2)
            }
          }
        })
        .catch(error => {
          Notify.create('Ocurrió un error, no se pueden obtener los branches')
          console.log(error)
          Loading.hide()
        })
    },
    selectBranch (branch) {
      if (branch[0] === '*') {
        branch = branch.slice(2)
      }
      this.branch = branch
    }
  },
  created () {
    this.getBranches()
  }
}
</script>

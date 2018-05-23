<template>
    <q-page class="flex justify-center" >
        <div style="width: 60%;">
            <h3 style="text-align: center;">
              Archivos Cambiados
              <q-btn icon="autorenew" round @click="refresh()"/>
            </h3>
            <span style="float: right;"><q-btn icon="clear_all" color="deep-purple" label="Descartar" @click="checkout()"/></span>
            <span style="float: right;"><q-btn icon="done" color="positive" label="Commit" @click="goToCommit()"/></span>
            <q-list>
              <q-list-header>
                <span>Total: {{ files.length }}</span>
              </q-list-header>
              <q-item
                :class="{ 'bg-warning': 'M' === file.type, 'bg-negative': 'D' === file.type, 'bg-positive': '?' === file.type  }"
                v-for="file in files"
                :key="file.change"
              >
                <q-item-main :label="file.change" />
                <q-item-side right>
                  <q-btn round size="sm" icon="visibility" @click="showDifferences(file.change)"/>
                </q-item-side>
              </q-item>
            </q-list>
            <q-modal v-model="diffOpened">
              <h4 style="text-align: center;">Diferencias</h4>
              <p
                style="padding-left: 2%;"
                v-for="change in changes"
                :key="change"
                :class="{ 'new-line': change[0] === '+', 'removed-line': change[0] === '-' }"
                v-html="change"
              >
              {{ change }}
              </p>
              <div style="text-align: center;">
                <q-btn
                  color="blue-grey-8"
                  @click="diffOpened = false"
                  label="Close"
                />
              </div>
            </q-modal>
        </div>
    </q-page>
</template>
<style type="text/css">
  .new-line {
    color: green;
  }
  .removed-line {
    color: red;
  }
</style>
<script>
import axios from 'axios'
import { Notify, Loading } from 'quasar'
export default {
  data () {
    return {
      files: [],
      changes: '',
      diffOpened: false
    }
  },
  methods: {
    goToCommit () {
      this.$router.push('/commit')
    },
    gitStatus () {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/status_raw')
        .then(({data}) => {
          this.files = data
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    },
    showDifferences (file) {
      Loading.show({ delay: 0 })
      this.diffOpened = true
      axios.get('http://localhost:4001/differences?file=' + file)
        .then(({data}) => {
          console.log(data)
          if (data[0] !== '') {
            this.changes = data
          } else {
            this.changes = ''
          }
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    },
    generateFiles () {
      // Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/generate_files')
        .then(({ data }) => {
          Loading.hide()
          console.log(data)
        })
        .catch(error => {
          Notify.create(error)
          console.log(error)
          // Loading.hide()
        })
    },
    refresh () {
      Loading.show({ delay: 0 })
      var that = this
      this.$nextTick(function () {
        setTimeout(function () {
          that.generateFiles()
          that.gitStatus()
          Loading.hide()
        }, 1000)
      })
    },
    checkout () {
      axios.get('http://localhost:4001/checkout')
        .then(({ data }) => {
          Notify.create({
            message: 'Cambios Descartados',
            color: 'positive'
          })
          this.refresh()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    }
  },
  created () {
    this.generateFiles()
    this.gitStatus()
  }
}
</script>

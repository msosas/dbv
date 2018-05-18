<template>
    <q-page class="flex justify-center" >
        <div style="width: 60%;">
            <h3 style="text-align: center;">Archivos Cambiados</h3>
            <q-list>
              <q-list-header>Total: {{ files.length }}</q-list-header>
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
            <q-modal v-model="diffOpened" style="text-align: center;" >
              <h4>Diferencias</h4>
              <p
                v-for="change in changes"
                :key="change"
                :class="{ 'new-line': change[0] === '+', 'removed-line': change[0] === '-' }"
              >
              {{ change }}
              </p>
              <q-btn
                color="blue-grey-8"
                @click="diffOpened = false"
                label="Close"
              />
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
    }
  },
  created () {
    this.gitStatus()
  }
}
</script>

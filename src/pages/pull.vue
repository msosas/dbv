<template>
  <q-page class="flex justify-center" >
      <div style="width: 60%;">
        <h3 style="text-align: center;">Actualizar Repositorio Local</h3>
        <q-list>
          <q-list-header>Desde Upstream: </q-list-header>
          <q-item>
            <q-item-side right>
              <q-btn icon="arrow_downward" @click="pull('development')" />
            </q-item-side>
            <q-item-main label="Development" />
          </q-item>
          <q-item>
            <q-item-side right>
              <q-btn icon="arrow_downward" @click="pull('master')" />
            </q-item-side>
            <q-item-main label="Master" />
          </q-item>
        </q-list>
      </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Loading, Notify } from 'quasar'
export default {
  data () {
    return {
      test: ''
    }
  },
  methods: {
    pull (branch) {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/pull?branch=' + branch)
        .then(({ data }) => {
          if (data !== '') {
            Notify.create({
              message: data,
              color: 'warning'
            })
          }
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    }
  }
}
</script>

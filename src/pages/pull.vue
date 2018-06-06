<template>
  <q-page class="flex justify-center" >
      <div style="width: 80%;">
        <h3 style="text-align: center;">Actualizar Repositorio Local</h3>
        <q-list>
          <div style="text-align: center;">
            <q-list-header>Desde Upstream: </q-list-header>
            <q-item>
              <q-btn
                icon="arrow_downward"
                @click="pull('development')"
                label="Development"
                color="positive"
                push
                size="md"
                style="margin: auto;"
              />
            </q-item>
            <q-item>
              <q-btn
                icon="arrow_downward"
                @click="pull('master')"
                label="Master"
                color="positive"
                push
                size="md"
                style="margin: auto;"
              />
            </q-item>
          </div>
        </q-list>
      </div>
  </q-page>
</template>

<script>
var baseUrl = 'http://localhost:4001'
import axios from 'axios'
import { Loading, Notify, QSpinnerPuff } from 'quasar'
export default {
  data () {
    return {
      test: ''
    }
  },
  methods: {
    updateSchema () {
      Loading.show({
        spinner: QSpinnerPuff,
        spinnerSize: 250,
        delay: 0,
        message: 'Aplicando archivos...'
      })
      axios.get(baseUrl + '/update_schema')
        .then(({ data }) => {
          Notify.create({
            message: 'Schema Local actualizado',
            color: 'positive'
          })
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Ocurrió un error, no se puede actualizar el schema')
          console.log(error)
          Loading.hide()
        })
    },
    pull (branch) {
      Loading.show({
        spinner: QSpinnerPuff,
        spinnerSize: 250,
        delay: 0,
        message: 'Haciendo pull...'
      })
      axios.get(baseUrl + '/pull?branch=' + branch)
        .then(({ data }) => {
          Notify.create({
            message: data,
            color: 'positive'
          })
          this.updateSchema()
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Ocurrió un error, no se puede hacer PULL')
          console.log(error)
          Loading.hide()
        })
    }
  }
}
</script>

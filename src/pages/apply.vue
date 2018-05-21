<template>
  <q-page class="flex justify-center">
    <div style="width: 60%;">
      <h3 style="text-align: center;">Impactar en el schema</h3>
      <q-list>
        <q-list-header>Seleccionar</q-list-header>
        <q-item>
          <q-item-side>
            <q-toggle v-model="spChecked" label="Stored Procedures" />
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-side>
            <q-toggle v-model="tablesChecked" label="Tablas" disabled />
          </q-item-side>
        </q-item>
        <q-item>
          <q-item-main style="text-align: center;">
            <q-btn icon="check" label="Aplicar" color="positive" @click="updateSchema()"/>
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script >
import {
  Loading,
  Notify
} from 'quasar'
import axios from 'axios'
export default {
  data () {
    return {
      spChecked: false,
      tablesChecked: false
    }
  },
  methods: {
    updateSchema () {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/update_schema')
        .then(({ data }) => {
          Notify.create({
            message: 'Schema Local actualizado',
            color: 'positive'
          })
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
          Loading.hide()
        })
    }
  }
}
</script>

<template>
  <q-page class="flex justify-center" >
    <div>
        <h3>Estado de la Conexión</h3>
        <q-list highlight>
          <q-list-header>Servidor</q-list-header>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="business" />
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="connectionInfo.server" />
          </q-item>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="bubble_chart" />
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="connectionInfo.port" />
          </q-item>
          <q-item-separator />
          <q-list-header>Base de Datos</q-list-header>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="pie_chart" />
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="connectionInfo.db.name" />
          </q-item>
          <q-item-separator />
          <q-list-header>Repositorio</q-list-header>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="pie_chart" />
              </q-item-tile>
            </q-item-side>
            <q-item-main :label="connectionInfo.repoPath" />
          </q-item>
        </q-list>
    </div>
  </q-page>
</template>

<script>
import axios from 'axios'
import { Notify, Loading } from 'quasar'
export default {
  name: 'PageIndex',
  data () {
    return {
      connectionInfo: {
        server: '',
        port: '',
        db: '',
        repoPath: ''
      }
    }
  },
  methods: {
    connectionStatus () {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/server_info')
        .then(({ data }) => {
          console.log(data)
          this.connectionInfo.repoPath = data[0]
          this.connectionInfo.server = data[1]
          this.connectionInfo.port = data[2]
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
      axios.get('http://localhost:4001/get_db')
        .then(({ data }) => {
          if (data === 'mysql') {
            this.connected = false
          } else {
            this.connected = true
            this.connectionInfo.db = data
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
    this.connectionStatus()
  }
}
</script>

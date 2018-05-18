<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="blue-grey-8"
        :inverted="$q.theme === 'ios'"
        v-if="connected"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          Conectado a {{ dbName | capitalize }}
          <div slot="subtitle">Running on Quasar v{{ $q.version }}</div>
        </q-toolbar-title>
        <q-btn flat round dense icon="home" @click="homeClick()" />
        <q-btn flat round dense icon="storage" @click="selectDb()" />
        <q-btn flat round dense icon="settings" />
      </q-toolbar>
      <q-toolbar
        color="red-8"
        v-if="!connected"
      >
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
        >
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          Sin Conexión
        </q-toolbar-title>
        <q-btn
          flat round dense icon="settings_power"
          @click="selectDb()"
        />
      </q-toolbar>
    </q-layout-header>

    <q-layout-drawer
      v-model="leftDrawerOpen"
      :content-class="$q.theme === 'mat' ? 'bg-grey-2' : null"
    >
      <q-list
        no-border
        link
        inset-delimiter
      >
        <q-list-header>Menu</q-list-header>
        <q-item to="/git_status">
          <q-item-side icon="cached" />
          <q-item-main label="Git Status" />
        </q-item>
        <q-item to="/pull">
          <q-item-side icon="arrow_downward" />
          <q-item-main label="Pull Code" />
        </q-item>
        <q-item to="/commit">
          <q-item-side icon="done_all" />
          <q-item-main label="Commit" />
        </q-item>
        <q-item to="/404">
          <q-item-side icon="arrow_upward" />
          <q-item-main label="Push Code" />
        </q-item>
        <q-item to="/404">
          <q-item-side icon="call_merge" />
          <q-item-main label="Aplicar Archivos" />
        </q-item>
        <q-item to="/404">
          <q-item-side icon="note_add" />
          <q-item-main label="Generar Archivos" />
        </q-item>
        <q-item to="/404">
          <q-item-side icon="create" />
          <q-item-main label="Revisiones" />
        </q-item>
        <q-item to="/404">
          <q-item-side icon="compare_arrows" />
          <q-item-main label="Comparar" />
        </q-item>
      </q-list>
    </q-layout-drawer>

    <q-page-container v-if="connected">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { Notify, Dialog, Loading } from 'quasar'
import axios from 'axios'

export default {
  name: 'LayoutDefault',
  data () {
    return {
      connected: false,
      dbName: '',
      dbList: [],
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    homeClick () {
      this.$router.push('/')
    },
    checkAPI () {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/check')
        .then(({ data }) => {
          console.log(data)
          this.getDb()
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    },
    getDb () {
      Loading.show({ delay: 1 })
      axios.get('http://localhost:4001/show_schemas')
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].label = data[i].label.toUpperCase()
          }
          this.dbList = data
          Loading.hide()
        })
        .catch(error => {
          Notify.create('Error:' + error)
          console.log(error)
        })
    },
    selectDb () {
      Dialog.create({
        title: 'Seleccionar DB',
        options: {
          type: 'radio',
          model: 'opt2',
          items: this.dbList
        },
        cancel: true,
        preventClose: true
      })
        .then((data) => {
          this.connected = true
          console.log(data)
          this.dbName = data
          axios.post('http://localhost:4001/set_db', 'db=' + this.dbName)
            .then(({ data }) => {
              console.log(data)
            })
        })
        .catch(() => {
          console.log('Canceled')
        })
    },
    isConnected () {
      axios.get('http://localhost:4001/get_db')
        .then(({ data }) => {
          if (data === 'mysql') {
            this.connected = false
          } else {
            this.connected = true
            this.dbName = data
          }
        })
    }
  },
  created () {
    this.checkAPI()
    this.isConnected()
  }
}
</script>

<style>
</style>

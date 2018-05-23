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
        <q-btn-dropdown :label="currentBranch">                        <!-- dropdown content -->
          <q-list link>
            <q-item v-for="branch in branches" :key="branch" close-overlay @click.native="changeBranch(branch)">
              <q-item-main>
                <q-item-tile label>{{ branch }}</q-item-tile>
              </q-item-main>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn flat round dense icon="storage" @click="selectDb()" />
        <q-btn flat round dense icon="settings" @click="setupClick()"/>

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
          <q-item-side icon="arrow_upward" />
          <q-item-main label="Push Code" />
        </q-item>
        <q-item to="/apply">
          <q-item-side icon="call_merge" />
          <q-item-main label="Aplicar Archivos" />
        </q-item>
        <q-item to="/404" v-if="false">
          <q-item-side icon="create" />
          <q-item-main label="Revisiones" />
        </q-item>
        <q-item to="/404" v-if="false">
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
      currentBranch: '',
      branches: [],
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
    setupClick () {
      this.$router.push('/setup')
    },
    checkAPI () {
      axios.get('http://localhost:4001/check')
        .then(({ data }) => {
          console.log(data)
        })
        .catch(error => {
          Notify.create(error.toString())
          console.log(error)
          Loading.hide()
        })
    },
    showSchemas () {
      Loading.show({ delay: 0 })
      axios.get('http://localhost:4001/show_schemas')
        .then(({ data }) => {
          for (var i = 0; i < data.length; i++) {
            data[i].label = data[i].label.toUpperCase()
          }
          this.dbList = data
          Loading.hide()
        })
        .catch(error => {
          Notify.create()
          console.log(error)
          Loading.hide()
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
    getBranch () {
      axios.get('http://localhost:4001/get_branches')
        .then(({ data }) => {
          console.log(data)
          for (var i = 0; i < data.length; i++) {
            if (data[i][0] === '*') {
              this.currentBranch = data[i].slice(2)
            }
          }
          this.branches = data
        })
    },
    changeBranch (branch) {
      Loading.show({ delay: 0 })
      axios.post('http://localhost:4001/change_branch', 'branch=' + branch)
        .then(({ data }) => {
          this.currentBranch = branch
          this.getBranch()
          Notify.create({
            message: 'Ahora en ' + branch,
            color: 'positive'
          })
          Loading.hide()
        })
        .catch(error => {
          Notify.create(error)
          console.log(error)
        })
    }
  },
  beforeCreate () {
    axios.get('http://localhost:4001/get_db')
      .then(({ data }) => {
        if (data.name === 'mysql') {
          this.connected = false
        } else {
          this.connected = true
          this.dbName = data.name
        }
      })
  },
  mounted () {
    this.showSchemas()
    this.getBranch()
    var that = this
    setInterval(function () {
      that.checkAPI()
      axios.get('http://localhost:4001/get_db')
        .then(({ data }) => {
          if (data.name === 'mysql') {
            that.connected = false
          }
        })
    }, 3000)
  }
}
</script>

<style>
</style>

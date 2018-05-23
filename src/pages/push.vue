<!-- ESTA VISTA NO SE USA!!  -->
<template>
  <q-page class="flex justify-center" >
      <div style="width: 60%;">
        <h3 style="text-align: center;">Actualizar Repositorio Remoto</h3>
        <q-list>
          <q-list-header>Desde el local: </q-list-header>
          <q-item>
            <q-item-side>
              <q-input type="text" v-model="branch" />
            </q-item-side>
            <q-item-main>
              <q-btn-dropdown label="Branch">
                <!-- dropdown content -->
                <q-list link>
                  <q-item v-for="branch in branchs" :key="branch" close-overlay @click.native="selectBranch(branch)">
                    <q-item-main>
                      <q-item-tile label>{{ branch }}</q-item-tile>
                    </q-item-main>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </q-item-main>
            <q-field>
            </q-field>
          </q-item>
          <q-item style="text-align: center">
            <q-item-main>
              <q-btn icon="check" label="Push" color="positive" @click="push(branch)"/>
            </q-item-main>
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
      branch: '',
      branchs: []
    }
  },
  methods: {
    push (branch) {
      Loading.show({ delay: 0 })
      axios.post('http://localhost:4001/push', 'localBranch=' + branch)
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
          Loading.hide()
        })
    },
    getBranchs () {
      axios.get('http://localhost:4001/get_branches')
        .then(({ data }) => {
          this.branchs = data
          if (this.branchs.length === 1) {
            this.branch = data[0].slice(2)
          }
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
    this.getBranchs()
  }
}
</script>

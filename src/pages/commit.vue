<template>
  <q-page class="flex justify-center" >
      <div style="width: 60%;">
        <h3 style="text-align: center;">Commit</h3>
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
            <q-item-main>
              <q-btn icon="check" label="Aplicar" color="positive" @click="commit()"/>
            </q-item-main>
          </q-item>
        </q-list>
    </div>
  </q-page>
</template>

<script type="text/javascript">
import axios from 'axios'
import { Loading, Notify } from 'quasar'
export default {
  data () {
    return {
      message: ''
    }
  },
  methods: {
    commit () {
      Loading.show({ delay: 0 })
      axios.post('http://localhost:4001/commit', 'message=' + this.message)
        .then(({ data }) => {
          console.log(data)
          Notify.create({
            message: data,
            color: 'warning'
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

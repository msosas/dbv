<template>
  <q-page class="flex justify-center" >
      <div style="width: 60%;">
        <h3 style="text-align: center">Setup</h3>
        <q-list>
          <q-list-header>Ubicación del Repositorio</q-list-header>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="folder" size="200%"/>
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-field>
                <q-input id="path" type="file" value palceholder="test" directory webkitdirectory single />
              </q-field>
            </q-item-main>
          </q-item>
        </q-list>
      </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      repoPath: ''
    }
  }
}
</script>

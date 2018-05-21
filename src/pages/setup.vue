<template>
  <q-page class="flex justify-center" >
      <div style="width: 60%;">
        <h3 style="text-align: center">Setup</h3>
        <q-list>
          <q-list-header>Ubicación del Repositorio</q-list-header>
          <q-item>
            <q-item-side>
              <q-item-tile icon>
                <q-icon name="folder" />
              </q-item-tile>
            </q-item-side>
            <q-item-main>
              <q-field>
                <q-input type="file" value palceholder="test" multiple directory webkitdirectory mozdirectory/>
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

<template>
  <q-page class="bg-grey-3 column">
    <q-list class="bg-white" separator bordered>

      <q-item
        v-ripple
        v-for="(task) in tasks"
        :key="task.index"
        @click="task.done = !task.done"
        :class="{ 'done bg-blue-1' : task.done }"
        clickable >

        <q-item-section avatar>
          <q-checkbox v-model="task.done" color="primary" class="no-pointer-events"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ task.title }}</q-item-label>
        </q-item-section>

      </q-item>

    </q-list>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      tasks: [
        {
          title: 'Get bananas',
          done: false
        },
        {
          title: 'Eat bananas',
          done: false
        },
        {
          title: 'Poo bananas',
          done: false
        }
      ]
    }
  }
}
</script>

<style lang="scss">
  .done {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }
</style>

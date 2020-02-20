<template>
  <q-page class="bg-grey-3 column">

    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask"
        @keyup.enter="addTask"
        class="col"
        square
        filled
        bg-color="white"
        placeholder="Adicionar Tarefa"
        dense
      >
      <template v-slot:append>
        <q-btn round dense flat icon="add" @click="addTask"/>
      </template>
      </q-input>
    </div>

    <q-list class="bg-white" separator bordered>

      <q-item
        v-ripple
        v-for="(task, index) in tasks"
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

        <q-item-section v-if="task.done" side>
           <q-btn flat round dense color="primary" icon="delete" @click.stop="deleteTask(index)"/>
        </q-item-section>

      </q-item>

    </q-list>

    <div class="no-tasks absolute-center" v-if="!tasks.length">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary text-center">
        Sem Tarefas
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      newTask: '',
      tasks: []
    }
  },
  methods: {
    addTask () {
      if (this.newTask === '') {
        this.$q.notify('Informe a tarefa')
        return null
      }
      this.tasks.push({
        title: this.newTask,
        done: false
      })
      this.newTask = ''
    },
    deleteTask (index) {
      this.$q.dialog({
        title: 'Excluir',
        message: 'Deseja excluir esta tarefa?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.tasks.splice(index, 1)
        this.$q.notify('Tarefa deletada')
      })
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
  .no-tasks {
    opacity: 0.5;
  }
</style>

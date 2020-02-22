<template>
  <q-page class="bg-grey-3 column">

    <div class="row q-pa-sm bg-primary">
      <q-input
        v-model="newTask.titulo"
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
        v-for="(task) in tasks"
        :key="task.index"
        @click="task.realizado = !task.realizado"
        :class="{ 'done bg-blue-1' : task.realizado }"
        clickable >

        <q-item-section avatar>
          <q-checkbox v-model="task.realizado" color="primary" class="no-pointer-events"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ task.titulo }}</q-item-label>
        </q-item-section>

        <q-item-section v-if="task.realizado" side>
           <q-btn flat round dense color="primary" icon="delete" @click.stop="deleteTask(task)"/>
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
      newTask: {
        titulo: '',
        descricao: null,
        data_vencimento: null,
        data_realizado: null,
        realizado: false
      },
      tasks: []
    }
  },
  mounted () {
    this.getTasks()
  },
  methods: {
    getTasks () {
      this.$axios.get('https://sistemas.offboard.com.br/api/tasks')
        .then(response => {
          // console.log(response)
          this.tasks = response.data
        })
    },
    addTask () {
      if (this.newTask.titulo === '') {
        this.$q.notify('Informe a tarefa')
        return null
      }

      this.$axios.post('https://sistemas.offboard.com.br/api/tasks', this.newTask)
        .then(response => {
          // console.log(response)
          this.newTask = this.emptyTask()
          this.getTasks()
        })
    },
    deleteTask (task) {
      this.$q.dialog({
        titulo: 'Excluir',
        message: 'Deseja excluir esta tarefa?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.$axios.delete('https://sistemas.offboard.com.br/api/tasks/' + task.id)
          .then(response => {
            this.$q.notify('Tarefa deletada')
            this.getTasks()
          })
      })
    },
    emptyTask () {
      return {
        titulo: '',
        descricao: null,
        data_vencimento: null,
        data_realizado: null,
        realizado: false
      }
    }
    // addTask () {
    //   if (this.newTask === '') {
    //     this.$q.notify('Informe a tarefa')
    //     return null
    //   }
    //   this.tasks.push({
    //     titulo: this.newTask,
    //     done: false
    //   })
    //   this.newTask = ''
    // },
    // deleteTask (index) {
    //   this.$q.dialog({
    //     titulo: 'Excluir',
    //     message: 'Deseja excluir esta tarefa?',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(() => {
    //     this.tasks.splice(index, 1)
    //     this.$q.notify('Tarefa deletada')
    //   })
    // }
  }
}
</script>

<style lang="scss">
  .realizado {
    .q-item__label {
      text-decoration: line-through;
      color: #bbb;
    }
  }
  .no-tasks {
    opacity: 0.5;
  }
</style>

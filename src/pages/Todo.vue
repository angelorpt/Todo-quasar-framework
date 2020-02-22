<template>
  <q-page class="bg-grey-3 column">

    <!-- <q-page-sticky position="top-right" :offset="[18, 0]" >
      <q-btn fab icon="add" color="primary" @click="prompt = true"/>
    </q-page-sticky> -->

    <q-list class="bg-white" separator bordered>

      <q-item>
        <q-item-section flat fab dense class="secondary">
          <q-btn color="primary" icon-right="add" label="Nova Tarefa" @click="prompt = true" />
        </q-item-section>
      </q-item>

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

    <!-- sem tarefas -->
    <div class="no-tasks absolute-center" v-if="!tasks.length">
      <q-icon name="check" size="100px" color="primary"/>
      <div class="text-h5 text-primary text-center">
        Sem Tarefas
      </div>
    </div>

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">

        <!-- header -->
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="assignment" round class="text-primary"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Nova Tarefa</q-item-label>
            <q-item-label caption>
              Cadastre sua nova tarefa
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Campos de cadastro -->
        <q-card-section class="q-pt-none">
          <q-input label="Título" v-model="task.titulo"/>
          <q-input label="Descrição" type="textarea" v-model="task.descricao"/>
          <q-input placeholder="Vencimento" v-model="task.data_vencimento" mask="date" >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="task.data_vencimento" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-card-section>

        <!-- Botões confirmação -->
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" v-close-popup @click="addTask"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
export default {
  data () {
    return {
      task: {
        titulo: '',
        descricao: null,
        data_vencimento: null,
        data_realizado: null,
        realizado: false
      },
      prompt: null,
      address: '',
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
      if (this.task.titulo === '') {
        this.$q.notify('Informe a tarefa')
        return null
      }

      this.$axios.post('https://sistemas.offboard.com.br/api/tasks', this.task)
        .then(response => {
          // console.log(response)
          this.task = this.emptyTask()
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
    //   if (this.task === '') {
    //     this.$q.notify('Informe a tarefa')
    //     return null
    //   }
    //   this.tasks.push({
    //     titulo: this.task,
    //     done: false
    //   })
    //   this.task = ''
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

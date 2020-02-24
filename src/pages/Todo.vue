<template>
  <q-page class="bg-grey-3 column">

    <!-- <q-page-sticky position="top-right" :offset="[18, 0]" >
      <q-btn fab icon="add" color="primary" @click="prompt = true"/>
    </q-page-sticky> -->

    <q-list class="bg-white" separator bordered>

      <q-item>
        <q-item-section flat fab dense class="secondary">
          <q-btn color="primary" icon-right="add" label="Nova" @click="prompt = true" />
        </q-item-section>
        <q-item-section flat fab dense side class="secondary">
          <q-btn color="primary" label="Consultar" @click="dlg_consultar = true" />
        </q-item-section>
        <q-item-section flat round fab dense side >
          <q-btn color="primary" icon="refresh" @click="refreshTask"/>
        </q-item-section>
      </q-item>

      <q-item
        v-ripple
        v-for="(task) in tasks"
        :key="task.index"
        @click="updateTask(task)"
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

    <q-dialog v-model="dlg_consultar" persistent>
      <q-card style="min-width: 350px">

        <!-- header -->
        <q-item>
          <q-item-section avatar>
            <q-avatar>
              <q-icon name="assignment" round class="text-primary"/>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>Consultar</q-item-label>
            <q-item-label caption>
              Selecione a data de vencimento
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <!-- Campos de cadastro -->
        <q-card-section class="q-pt-none">
          <q-date
            v-model="dataSel"
            filled
            round
            dense
            :events="eventsFn"
            event-color="orange"
          />
        </q-card-section>

        <!-- Botões confirmação -->
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Todos" v-close-popup @click="consultarTodos"/>
          <q-btn flat label="Consultar" v-close-popup @click="consultarTasks"/>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
export default {
  data () {
    return {
      splitterModel: '',
      task: {
        titulo: '',
        descricao: null,
        data_vencimento: null,
        data_realizado: null,
        realizado: false
      },
      prompt: null,
      dlg_consultar: null,
      address: '',
      tasks: [],
      allTasks: [],
      dataSel: '',
      events: []
    }
  },
  mounted () {
    this.refreshTask()
  },
  watch: {
    allTasks () {
      var vm = this
      const unique = this._.uniqBy(this.allTasks, 'data_vencimento')
      this.events = vm._.map(unique, (element) => {
        if (element.data_vencimento != null) {
          return this.moment(element.data_vencimento).format('YYYY/MM/DD')
        }
      })
    }
  },
  methods: {
    consultarTasks () {
      if (this.dataSel === '') {
        this.tasks = this.allTasks
      } else {
        const lstTasks = this._.filter(this.allTasks, { data_vencimento: this.dataSel })
        if (lstTasks !== undefined) {
          if (this._.isArray(lstTasks)) {
            this.tasks = lstTasks
          } else {
            this.tasks = [lstTasks]
          }
        } else {
          this.tasks = []
        }
      }
    },
    refreshTask () {
      this.getTasks()
      this.consultarTasks()
    },
    consultarTodos () {
      this.dataSel = ''
      this.tasks = this.allTasks
    },
    eventsFn (date) {
      if (this._.indexOf(this.events, this.moment(date).format('YYYY/MM/DD')) > -1) {
        return true
      } else {
        return false
      }
    },
    getTasks () {
      this.$axios.get('https://sistemas.offboard.com.br/api/tasks')
        .then(response => {
          this.allTasks = this._.map(response.data, (element) => {
            element.data_vencimento = this.moment(element.data_vencimento).format('YYYY/MM/DD')
            element.realizado = (parseInt(element.realizado) === 1)
            return element
          })
          this.consultarTasks()
        })
    },
    addTask () {
      if (this.task.titulo === '') {
        this.$q.notify('Informe a tarefa')
        return null
      }

      this.$axios.post('https://sistemas.offboard.com.br/api/tasks', this.task)
        .then(response => {
          this.task = this.emptyTask()
          this.dataSel = ''
          this.getTasks()
        })
    },
    updateTask (task) {
      task.realizado = !task.realizado
      this.$axios.put('https://sistemas.offboard.com.br/api/tasks/' + task.id, task)
        .then(response => {
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

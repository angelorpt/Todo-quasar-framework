<template>
  <q-page padding>
    <q-item>
      <q-item-section>
        <q-input round v-model="user.email" type="email" label="E-mail" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-input round v-model="user.password" type="password" label="Senha" />
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn color="primary" text-color="white" label="Login" @click.stop="login"/>
      </q-item-section>
    </q-item>
    <q-item>
      <q-item-section>
        <q-btn color="primary" text-color="white" label="Cadastrar" />
      </q-item-section>
    </q-item>
  </q-page>
</template>

<script>
import { Loading } from 'quasar'
export default {
  data () {
    return {
      user: {
        email: 'offboard@offboard.com.br',
        password: 'Api!2020'
      }
    }
  },
  methods: {
    login () {
      Loading.show()
      const url = 'https://sistemas.offboard.com.br/api/auth/login'
      this.$axios.post(url, this.user)
        .then((response) => {
          // console.log(response)
          if (response.status === 200) {
            // console.log(response.data.access_token)
            this.$store.dispatch('token/updateToken', response.data.access_token)
          }
          if (response.status === 401) {
            this.$q.notify('Acesso Negado. Verifique usuário e senha.')
          }
          Loading.hide()
          this.$router.push('/todo')
        })
        .catch((error) => {
          // console.log(error.response)
          if (error.response.status === 401) {
            this.$q.notify('Verifique Usuário e Senha')
          } else {
            this.$q.notify('Falha na Autenticação')
          }
          Loading.hide()
        })
    }
  }
}
</script>

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
export default {
  data () {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login () {
      const url = 'https://sistemas.offboard.com.br/api/auth/login'
      this.$axios.post(url, this.user)
        .then(response => {
          if (response.status === 200) {
            console.log(response.data.access_token)
          }
        })
    }
  }
}
</script>

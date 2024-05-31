<template>
  <div id="app">
    <div class="loginBox">
      <div class="inner">
        <div class="signIn" v-if="signIn">
          <div class="top">
            <img class="logo"
              src="https://res.cloudinary.com/dc3c8nrut/image/upload/v1685298768/logo-placeholder_l3yodl.png" />
            <div class="title">Sign in</div>
            <div class="subtitle">
              Don't have an account?
              <span class="subtitle-action" @click="signIn = !signIn">
                Create Account
              </span>
            </div>
          </div>
          <form>
            <div class="form">
              <input required aria-required="true" aria-invalid="false" aria-label="Username" type="text"
                pattern="^[A-Za-z][A-Za-z0-9_]{7,29}$" class="w100" ref="username" placeholder="Username" autofocus
                v-model="username.value" />

              <input required aria-required="true" type="password" class="w100" placeholder="Password"
                v-model="password.value" />
            </div>

            <input type="submit" value="Submit" class="action" @click="login" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NotificationTemplate from "./Notifications/NotificationTemplate.vue";
import { BaseAlert } from "../components";
import { APIFactory } from "../services/APIFactory";
const AuthService = APIFactory.get('auth');

export default {
  components: {
    BaseAlert,
  },
  data() {
    return {
      type: ["", "info", "success", "warning", "danger"],
      usernameRegex: /^[A-Za-z][A-Za-z0-9_]{5,29}$/,
      passwordRegex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/,

      password: {
        value: "",
        error: false
      },

      username: {
        value: "",
        error: false
      },

      signIn: true
    };
  },

  methods: {
    login(event) {
      event.preventDefault();
      AuthService.auth({ Username: this.username.value, Password: this.password.value })
        .then(response => {
          // this.$toast.open(`Welcome ${this.username.value}`)
          localStorage.setItem('userId', response.data.data.id)
          localStorage.setItem('token', response.data.data.token)

          this.$router.push({ name: 'dashboard', query: { redirect: '/dashboard' } });
          this.notifyVue('top', 'right', `Welcome ${this.username.value}`)
        })
        .catch(error =>
          this.notifyVue('top', 'right', `${error.response.data.Message}`)
        );
    },
    notifyVue(verticalAlign, horizontalAlign, message) {
      const color = Math.floor(Math.random() * 4 + 1);
      this.$notify({
        component: NotificationTemplate,
        icon: "tim-icons icon-bell-55",
        horizontalAlign: horizontalAlign,
        verticalAlign: verticalAlign,
        type: this.type[color],
        timeout: 1000,
        message: message
      });
    },
  },

  mounted() {
  },

  computed: {
  }
};
</script>
<!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
<style lang="scss">
@mixin box {
  box-shadow: 1px 1px 2px 1px #ccc;
}

@mixin field {
  border: 1px solid #aaa;
  height: 40px;
  padding: 10px;
  margin-top: 20px;
  border-radius: 5px;
  box-sizing: border-box;
}

input[type="text"] {
  @include field;
}

input[type="email"] {
  @include field;
}

input[type="password"] {
  @include field;
}

.invalid {
  border: 2px solid red !important;

  &::placeholder {
    color: red;
  }
}

.errorMessage {
  color: red;
  margin: 10px;
  top: 5px;
}

.w100 {
  width: 100%;
}

.logo {
  width: 300px;
  margin-bottom: 10px;
}

.action {
  height: 40px;
  text-transform: uppercase;
  border-radius: 25px;
  width: 100%;
  border: none;
  cursor: pointer;
  background: green;
  margin-top: 20px;
  color: #fff;
  font-size: 1.2rem;
  @include box;
}

.action-disabled {
  color: #eee;
  background: #aaa;
  cursor: auto;
}

.top {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
}

.title {
  width: 100%;
  font-size: 1.8rem;
  margin-bottom: 10px;
  text-align: center;
}

.subtitle {
  .subtitle-action {
    color: green;
    font-weight: bold;
    cursor: pointer;
  }
}

.loginBox {
  background: #fff;
  border-radius: 15px;
  max-width: 400px;
  padding: 25px 55px;
  animation: slideInTop 1s;
}

@keyframes slideInTop {
  from {
    opacity: 0;
    transform: translateY(-30%);
  }

  to {
    opacity: 100;
    transform: translateY(0%);
  }
}

@media screen and (min-width: 440px) {
  .loginBox {
    @include box;
  }
}

@media screen and (max-width: 440px) {
  html {
    background: #fff;
    align-items: start;
    justify-content: start;
  }

  .loginBox {
    padding: 25px 25px;
    max-width: 100vw;
  }
}
</style>
<template>
  <header class="header">
    <div class="container">
      <nav class="header__nav">
        <ul class="header__list">
          <li
            v-for="(item, index) in navList"
            :key="index"
            class="header__list-item"
          >
            <nuxt-link
              class="header__list-link"
              :to="item.link"
            >
              {{ item.title }}
            </nuxt-link>
          </li>
          <li
            v-if="Object.keys(getUser).length"
            class="header__list-item header__list-user"
          >
            <nuxt-link
              class="header__list-link"
              to="/account"
            >
              {{ getUser.username }}
            </nuxt-link>
            <span class="header__list-user-level">{{ getLevel ? getLevel : getUser.level }}</span>
          </li>
          <li
            v-if="Object.keys(getUser).length"
            class="header__list-item header__list-signout"
          >
            <nuxt-link
              class="header__list-link"
              to="/logout"
            >
              Выйти
            </nuxt-link>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script>
  export default {
    name: "HeaderComponent",
    data: () => ({
      navList: [
        {
          link: "/",
          title: "Тестирование",
        },
        {
          link: "/favorites",
          title: "Избранное",
        },
        {
          link: "/create",
          title: "Создание текста",
        },
        {
          link: "/settings",
          title: "Настройки",
        }
      ],
    }),
    computed: {
      getLevel() {
        return this.$store.getters["profile/getLevel"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"] || {};
      },
    },
  };
</script>
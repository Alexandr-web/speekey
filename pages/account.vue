<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div
          v-if="Object.keys(getUser || {}).length"
          class="account"
        >
          <div class="account__info">
            <div class="account__info-block account__user">
              <header class="account__user-header">
                <vProfileIcon :classes="['account__user-icon']" />
                <h2
                  class="account__user-username"
                  :title="getUser.username"
                >
                  {{ getUser.username }}
                </h2>
              </header>
              <main class="account__user-main">
                <div class="account__user-level">
                  Уровень <span class="account__user-level-value">{{ getLevel ? getLevel : getUser.level }}</span>
                </div>
              </main>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Создано текстов
              </h4>
              <h2 class="account__info-title">
                {{ getUser.lengthCreatedTexts }}
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Выполнено текстов
              </h4>
              <h2 class="account__info-title">
                {{ getUser.completedTexts.length }}
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Точность
              </h4>
              <h2 class="account__info-title">
                {{ getUser.accuracy }}%
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Скорость (с/м)
              </h4>
              <h2 class="account__info-title">
                {{ getUser.speed }}
              </h2>
            </div>
          </div>
          <div class="account__texts">
            <table
              v-if="(getUser.completedTexts || []).length"
              class="table account__texts-table"
            >
              <thead class="table__header account__texts-table-header">
                <tr class="table__header-row account__texts-table-header-row">
                  <th class="table__header-title account__texts-table-content account__texts-table-header-title">
                    Скорость (с/м)
                  </th>
                  <th class="table__header-title account__texts-table-content account__texts-table-header-title">
                    Кол-во символов
                  </th>
                  <th class="table__header-title account__texts-table-content account__texts-table-header-title">
                    Кол-во ошибок
                  </th>
                  <th class="table__header-title account__texts-table-content account__texts-table-header-title">
                    Точность
                  </th>
                  <th class="table__header-title account__texts-table-content account__texts-table-header-title">
                    Дата
                  </th>
                </tr>
              </thead>
              <tbody class="table__body account__texts-table-body">
                <tr
                  v-for="(txt, index) in getUser.completedTexts"
                  :key="index"
                  class="table__body-row account__texts-table-body-row"
                >
                  <td class="table__body-content account__texts-table-content">
                    {{ txt.speed }}
                  </td>
                  <td class="table__body-content account__texts-table-content">
                    {{ txt.length }}
                  </td>
                  <td class="table__body-content account__texts-table-content">
                    {{ txt.errors }}
                  </td>
                  <td class="table__body-content account__texts-table-content">
                    {{ txt.accuracy }}%
                  </td>
                  <td class="table__body-content account__texts-table-content">
                    {{ new Date(txt.updatedAt).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
            <vNothing
              v-else
              text="Нет выполненных текстов"
            />
          </div>
        </div>
      </div>
    </div>r
  </div>
</template>

<script>
  import vProfileIcon from "@/components/icons/vProfileIcon";
  import vNothing from "@/components/vNothing";

  export default {
    name: "AccountPage",
    components: {
      vProfileIcon,
      vNothing,
    },
    layout: "default",
    head: { title: "Аккаунт", },
    computed: {
      getLevel() {
        return this.$store.getters["profile/getLevel"];
      },
      getExperience() {
        return this.$store.getters["profile/getExperience"];
      },
      getUser() {
        return this.$store.getters["profile/getUser"] || {};
      },
    },
    mounted() {
      const compiltedTextsCopy = [...this.getUser.completedTexts];
      const completedTexts = compiltedTextsCopy.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

      this.$store.commit("profile/setUser", {
        ...this.getUser,
        completedTexts,
      });
    },
  };
</script>
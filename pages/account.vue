<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div
          v-if="Object.keys(user || {}).length"
          class="account"
        >
          <div class="account__info">
            <div class="account__info-block account__user">
              <header class="account__user-header">
                <vProfileIcon :classes="['account__user-icon']" />
                <h2
                  class="account__user-username"
                  :title="user.username"
                >
                  {{ user.username }}
                </h2>
              </header>
              <main class="account__user-main">
                <div class="account__user-level">
                  Уровень <span class="account__user-level-value">{{ user.level }}</span>
                </div>
              </main>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Создано текстов
              </h4>
              <h2 class="account__info-title">
                {{ user.createdTexts }}
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Выполнено текстов
              </h4>
              <h2 class="account__info-title">
                {{ user.completedTexts }}
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Точность
              </h4>
              <h2 class="account__info-title">
                {{ user.accuracy }}%
              </h2>
            </div>
            <div class="account__info-block account__params">
              <h4 class="account__info-subtitle">
                Скорость (с/м)
              </h4>
              <h2 class="account__info-title">
                {{ user.speed }}
              </h2>
            </div>
          </div>
          <div
            v-if="(completedTexts || []).length"
            class="account__texts"
          >
            <table class="table account__texts-table">
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
                  v-for="(txt, index) in completedTexts"
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
                  <td class="account__texts-table-content">
                    {{ new Date(txt.updatedAt).toLocaleString() }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vProfileIcon from "@/components/icons/vProfileIcon";

  export default {
    name: "AccountPage",
    components: { vProfileIcon, },
    layout: "default",
    asyncData({ store, }) {
      const res1 = store.dispatch("profile/getCurrent");
      const token = store.getters["auth/getToken"];
      
      return res1
        .then((user) => {
          const res2 = store.dispatch("profile/getCompletedTexts", { token, id: user.id, });

          return Promise.all([res2, user]);
        }).then(([{ ok, completedTexts, }, user]) => {
          return {
            user,
            completedTexts: ok ? completedTexts : [],
          };
        }).catch((err) => {
          throw err;
        });
    },
    head: { title: "Аккаунт", },
  };
</script>
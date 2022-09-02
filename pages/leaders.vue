<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div class="leaders">
          <table
            v-if="(leaders || []).length"
            class="table leaders__table"
          >
            <thead class="table__header leaders__table-header">
              <tr class="table__header-row leaders__table-header-row">
                <th class="table__header-title leaders__table-header-title">
                  Имя
                </th>
                <th class="table__header-title leaders__table-header-title">
                  Скорость (с/м)
                </th>
                <th class="table__header-title leaders__table-header-title">
                  Точность
                </th>
                <th class="table__header-title leaders__table-header-title">
                  Дата
                </th>
              </tr>
            </thead>
            <tbody class="table__body leaders__table-body">
              <tr
                v-for="(leader, index) in leaders"
                :key="index"
                class="table__body-row leaders__table-body-row"
              >
                <td class="table__body-content leaders__table-body-content">
                  {{ leader.username }}
                </td>
                <td class="table__body-content leaders__table-body-content">
                  {{ leader.speed }}
                </td>
                <td class="table__body-content leaders__table-body-content">
                  {{ leader.accuracy }}%
                </td>
                <td class="table__body-content leaders__table-body-content">
                  {{ new Date(leader.createdAt).toLocaleString() }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "LeadersPage",
    layout: "default",
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok, leaders, } = await store.dispatch("leaders/getAll", token);
        
        return { leaders: ok ? leaders : [], };
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Лидеры", },
  };
</script>
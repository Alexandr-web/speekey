<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div class="notifications">
          <vNotification
            v-if="notificationData.show"
            :data="notificationData"
            @hideNotification="hideNotification"
          />
        </div>
        <div class="favorites">
          <table
            v-if="(texts || []).length"
            class="table"
          >
            <thead class="table__header">
              <tr class="table__header-row">
                <th class="table__header-title">
                  <div class="table__header-controls">
                    <div class="table__header-controls-block">
                      <label
                        class="table__checkbox-label"
                        for="select-all-texts"
                      >
                        <input
                          id="select-all-texts"
                          v-model="selectAllTexts"
                          type="checkbox"
                          class="form__checkbox table__checkbox"
                        >
                        <span class="table__checkbox-style">
                          <vCheckmarkIcon :classes="['table__checkbox-icon']" />
                        </span>
                      </label>
                    </div>
                    <div class="table__header-controls-block">
                      <button
                        class="table__header-controls-btn table__header-controls-btn--remove"
                        :disabled="pendingRemove || !getRemovedTexts.length"
                        @click="removeFavoriteText"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                </th>
                <th class="table__header-title">
                  Текст
                </th>
                <th class="table__header-title">
                  Кол-во символов
                </th>
              </tr>
            </thead>
            <tbody class="table__body">
              <tr
                v-for="(txt, index) in texts"
                :key="index"
                class="table__body-row"
              >
                <td class="table__body-content">
                  <label
                    class="table__checkbox-label"
                    :for="`checkbox-text-${txt.id}`"
                  >
                    <input
                      :id="`checkbox-text-${txt.id}`"
                      v-model="txt.readyToRemove"
                      class="form__checkbox table__checkbox"
                      type="checkbox"
                      @change="selectToRemove"
                    >
                    <span class="table__checkbox-style">
                      <vCheckmarkIcon :classes="['table__checkbox-icon']" />
                    </span>
                  </label>
                </td>
                <td class="table__body-content">
                  <nuxt-link
                    class="favorites__table-link favorites__table-limited-content"
                    :to="`/?text=${txt.id}`"
                    :title="txt.body"
                  >
                    {{ txt.body }}
                  </nuxt-link>
                </td>
                <td class="table__body-content">
                  {{ txt.body.split("").length }}
                </td>
              </tr>
            </tbody>
          </table>
          <vNothing v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vCheckmarkIcon from "@/components/icons/vCheckmarkIcon";
  import vNotification from "@/components/vNotification";
  import vNothing from "@/components/vNothing";
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: "FavoritesPage",
    components: {
      vCheckmarkIcon,
      vNotification,
      vNothing,
    },
    mixins: [notificationMixin],
    layout: "default",
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const currentUserId = await store.dispatch("profile/getIdByToken", token);
        const { ok, texts, } = await store.dispatch("profile/getFavoritesTexts", { token, id: currentUserId, });
        const updateTexts = texts.map((text) => {
          text.readyToRemove = false;

          return text;
        });

        return { texts: ok ? updateTexts : [], };
      } catch (err) {
        throw err;
      }
    },
    data: () => ({
      pendingRemove: false,
      selectAllTexts: false,
    }),
    head: { title: "Избранное", },
    computed: {
      getRemovedTexts() {
        return this.texts.filter(({ readyToRemove, }) => readyToRemove);
      },
    },
    watch: {
      selectAllTexts(val) {
        if (val) {
          this.texts = this.texts.map((text) => {
            text.readyToRemove = true;

            return text;
          });
        }
      },
    },
    methods: {
      selectToRemove() {
        this.selectAllTexts = this.texts.every(({ readyToRemove, }) => readyToRemove);
      },
      removeFavoriteText() {
        const token = this.$store.getters["auth/getToken"];
        const fd = { removeTextsId: this.getRemovedTexts.map(({ id, }) => id), };
        const res = this.$store.dispatch("profile/getIdByToken", token);
        
        this.pendingRemove = true;

        res
          .then((userId) => {
            return this.$store.dispatch("profile/removeFavorites", { id: userId, token, fd, });
          }).then(({ ok, message, type, }) => {
            this.pendingRemove = false;

            this.callNotification({
              desc: message,
              type,
              show: true,
            });

            if (ok) {
              this.$router.go(0);
            }
          }).catch((err) => {
            this.callNotification({
              title: "Ошибка",
              desc: `Произошла ошибка: ${err}`,
              type: "error",
              show: true,
            });

            throw err;
          });
      },
    },
  };
</script>
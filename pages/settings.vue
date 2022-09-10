<template>
  <div class="page">
    <div class="container">
      <div class="notifications">
        <vNotification
          v-if="notificationData.show"
          :data="notificationData"
          @hideNotification="hideNotification"
        />
      </div>
      <div class="page__inner">
        <div class="settings">
          <div
            v-if="Object.keys(user || {}).length"
            class="settings__rows"
          >
            <div
              v-for="(item, index) in settings"
              :key="index"
              class="settings__row"
            >
              <header
                class="settings__row-header"
                @click="setStateTab(index)"
              >
                <h2
                  class="settings__row-title"
                  :class="{
                    'settings__row-title--active': item.show
                  }"
                >
                  {{ item.title }}
                </h2>
                <vMoreIcon
                  :classes="
                    ['settings__row-icon', item.show ? 'settings__row-icon--rotate' : '']
                  "
                />
              </header>
              <main
                v-show="item.show"
                class="settings__row-main"
              >
                <vSettingsAccount
                  v-if="item.isAccount"
                  :user="user"
                  @callNotification="callNotification"
                />
                <vSettingsTheme
                  v-if="item.isTheme"
                  @callNotification="callNotification"
                />
                <vSettingsCaret
                  v-if="item.isCaret"
                  @callNotification="callNotification"
                />
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import vMoreIcon from "@/components/icons/vMoreIcon";
  import vSettingsAccount from "@/components/vSettingsAccount";
  import vSettingsTheme from "@/components/vSettingsTheme";
  import vSettingsCaret from "@/components/vSettingsCaret";
  import vNotification from "@/components/vNotification";
  import notificationMixin from "@/mixins/notificationMixin";

  export default {
    name: "SettingsPage",
    components: {
      vMoreIcon,
      vSettingsAccount,
      vSettingsTheme,
      vNotification,
      vSettingsCaret,
    },
    mixins: [notificationMixin],
    layout: "default",
    async asyncData({ store, }) {
      try {
        const user = await store.dispatch("profile/getCurrent");

        return { user, };
      } catch (err) {
        throw err;
      }
    },
    data: () => ({
      settings: [
        {
          show: false,
          title: "Аккаунт",
          isAccount: true,
        },
        {
          show: false,
          title: "Тема",
          isTheme: true,
        },
        {
          show: false,
          title: "Знак вставки",
          isCaret: true,
        }
      ],
    }),
    head: { title: "Настройки", },
    methods: {
      setStateTab(index) {
        this.settings = this.settings.map((item, i) => {
          if (i === index) {
            item.show = !item.show;
          }

          return item;
        });
      },
    },
  };
</script>
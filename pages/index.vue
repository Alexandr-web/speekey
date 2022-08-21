<template>
  <div class="page">
    <div class="container">
      <div class="page__inner">
        <div class="testing">
          <div class="testing__inner">
            <p
              v-if="text && text.length"
              class="testing__text"
            >
              <span
                v-for="(lData, index) in text"
                :key="index"
                class="testing__letter"
                :class="{
                  'testing__letter--complete': lData.complete,
                  'testing__letter--failure': lData.failure,
                }"
              >{{ lData.letter }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "IndexPage",
    layout: "default",
    async asyncData({ store, }) {
      try {
        const token = store.getters["auth/getToken"];
        const { ok, text: textData, } = await store.dispatch("text/getRandom", token);
        const text = ok ? textData.body.split("").map((l, i) => ({ letter: l, active: i === 0, complete: false, failure: false, })) : [];

        return { text: ok ? text : "", };
      } catch (err) {
        throw err;
      }
    },
    head: { title: "Тестирование", },
  };
</script>

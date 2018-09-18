<template>
  <article>
    <header class="flex pl-4 pr-4">
      <h3 class="flex-1 mt-1 mb-1 font-bold leading-tight">
        {{ place.name }}
      </h3>
    </header>

    <article
      v-for="(count, type) in place.bike_types"
      :key="type"
      class="flex rounded hover:bg-grey-lighter"
    >
      <div class="flex self-center pt-2 pb-2 pr-2 pl-4">
        <i class="fas fa-bicycle fa-fw fa-2x" :class="{'text-green': count > 0, 'text-red': count === 0}"></i>
      </div>
      <div class="flex-1 self-center pl-2 pt-2 pb-2 pr-2">
        <h4 class="font-semibold">
          <span v-if="type == 4">CLASSICbike</span>
          <span v-else-if="type == 5">e-CLASSICbike</span>
          <span v-else-if="type == 'undefined'">ECObike</span>
        </h4>
        <p class="text-grey-dark text-sm">
          {{ count }} verfügbar
        </p>
      </div>
      <div class="flex self-center pr-4">
        <button class="rounded pt-2 pb-2 pl-3 pr-3 text-white font-bold" :class="{'bg-green': count > 0, 'bg-grey': count === 0}">
          Fahren
        </button>
      </div>
    </article>
  </article>
</template>

<script>
export default {
  props: {
    place: {
      type: Object,
      required: true,
    }
  }
}
</script>

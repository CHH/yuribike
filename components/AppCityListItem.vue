<template>
  <article class="relative flex hover:bg-grey-lighter rounded">
    <div class="flex pt-2 pb-2 pr-2 pl-4 self-center">
      <i class="fas fa-2x fa-fw" :class="{[icon]: true, [iconColor]: true}" aria-hidden="true"></i>
    </div>
    <div class="flex-1 pl-2 pt-2 pb-2 pr-2 self-center">
      <h3 class="mt-0 mb-1">
        {{ city.name }}
      </h3>
      <p class="text-grey-dark mb-0 text-sm">
        {{ city.available_bikes }} verfügbar
      </p>
      <button class="absolute pin-r pin-t w-full h-full pr-4 text-right" @click="$emit('click', city)">
        <i class="fas fa-chevron-circle-right text-yellow-dark"></i>
      </button>
    </div>
  </article>
</template>

<script>
export default {
  props: {
    city: {
      type: Object,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: 'fa-map-pin',
    },
    iconColor: {
      type: String,
      required: false,
      default: 'text-yellow-dark',
    }
  },
}
</script>

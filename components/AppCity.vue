<template>
  <section class="city">
    <h2 class="font-black text-yellow-dark pl-4 pr-4">{{ city.name }}</h2>

    <form class="pl-4 pr-4 pt-3 pb-2" v-if="city.places.length > 1" action="">
      <select
        class="w-full"
        name="place"
        id="place"
        @change="selectPlace($event.target.value)"
      >
        <option v-for="place in city.places" :key="place.uid" :value="place.uid">
          {{ place.name }}
        </option>
      </select>
    </form>

    <app-place
      class="pt-2"
      :place="place"
      @zoom="selectPlace($event.uid)"
    />
  </section>
</template>

<script>
import AppPlace from '~/components/AppPlace'

export default {
  components: {
    AppPlace,
  },
  props: {
    city: {
      type: Object,
      required: true,
    }
  },
  data () {
    return {
      place: this.city.places[0] || null
    }
  },
  methods: {
    selectPlace (uid) {
      this.place = this.city.places.filter(place => place.uid == uid)[0]
      this.$emit('change-place', this.place)
    },
  }
}
</script>

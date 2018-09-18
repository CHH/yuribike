<template>
  <section class="city">
    <div class="flex">
      <h2 class="flex-1 font-black text-yellow-dark pl-4 pr-4">{{ city.name }}</h2>
      <div class="mr-4 self-center" v-if="favorites">
        <button @click="toggleLike">
          <i class="fas fa-heart fa-fw text-grey" :class="{'text-red': favorites.indexOf(`${city.uid}`) !== -1}"></i>
        </button>
      </div>
    </div>

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
    />
  </section>
</template>

<script>
import AppPlace from '~/components/AppPlace'
import axios from 'axios'
import { mapState } from 'vuex'

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

  computed: {
    ...mapState(['favorites'])
  },

  methods: {
    selectPlace (uid) {
      this.place = this.city.places.filter(place => place.uid == uid)[0]

      this.$emit('change-place', this.place)
    },

    async toggleLike () {
      await this.$store.dispatch('favorite', { uid: '' + this.city.uid })
    }
  }
}
</script>

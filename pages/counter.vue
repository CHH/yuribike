<template>
  <div class="container mx-auto p-16 text-center bg-grey-lighter h-screen">
    <h1>Counter!</h1>

    <h1 class="text-5xl bg-white shadow p-8 rounded-lg mt-4 max-w-sm mx-auto">
      {{ counter }}
    </h1>

    <button @click="increment" class="bg-blue text-white rounded-full py-3 px-6 mt-4 text-2xl font-semibold">
      Count something!
    </button>
    <button @click="reset" class="bg-red text-white rounded-full py-3 px-6 mt-4 text-2xl font-semibold ml-2">
      Reset
    </button>
  </div>
</template>

<script>
export default {
  asyncData () {
    return {
      counter: 0
    }
  },

  methods: {
    increment () {
      this.counter++
    },

    reset () {
      this.counter = 0
    }
  }
}
</script>

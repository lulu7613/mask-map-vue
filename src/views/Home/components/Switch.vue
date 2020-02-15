<template>
    <div class="switch__container" @click="action">
      {{ title }}
    </div>
</template>

<script>
export default {
  name: 'AppSwitch',

  props: {
    title: {
      type: String,
      default: '',
    },
    switch: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    action() {
      this.$emit('actSwitch', this.switch);
    },
  },
};
</script>

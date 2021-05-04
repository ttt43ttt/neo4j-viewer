<template>
  <span v-html="svg" />
</template>

<script>
export default {
  name: 'svg-inline',
  props: ['svg']
  // render() {
  //   console.log(this.$attrs)
  //   const { svg } = this
  //   return svg
  // }
}
</script>

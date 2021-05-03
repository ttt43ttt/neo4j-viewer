<template>
  <div class="index">
    <Neo4jViewer />
  </div>
</template>
<script>
import Neo4jViewer from '@/libs/neo4j-viewer'
export default {
  name: 'kg-browser',
  components: {
    Neo4jViewer
  },
  data() {
    return {}
  },
  methods: {},
  mounted() {}
}
</script>

<style scoped>
body,
html,
.index {
  height: 100%;
  overflow: hidden;
}

.neo4jd3 {
  height: 98%;
  overflow: hidden;
}
</style>

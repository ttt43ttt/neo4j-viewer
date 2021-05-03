<script>
import ExplorerComponent from './components/Explorer'

export default {
  name: 'neo4j-viewer',
  components: { ExplorerComponent },
  render() {
    return <ExplorerComponent nodes={[]} relationships={[]} />
  }
}
</script>

<style scoped>
</style>

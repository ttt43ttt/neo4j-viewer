<script>
import ExplorerComponent from './components/Explorer'
import { getData } from '@/api/kg-browser'

export default {
  name: 'neo4j-viewer',
  components: { ExplorerComponent },
  data() {
    return {
      maxNeighbours: 100,
      initialNodeDisplay: 300,
      hasTruncatedFields: false,
      graphStyleData: {},
      nodes: [],
      relationships: [],
      fullscreen: false,
      frameHeight: 500
    }
  },
  methods: {
    updateStyle() {},
    getNeighbours() {},
    assignVisElement() {},
    setGraph() {}
  },
  async mounted() {
    const response = await getData()
    const { nodes, relationships } = response.results[0].data[0].graph
    this.nodes = nodes
    this.relationships = relationships
  },
  render() {
    return (
      <ExplorerComponent
        maxNeighbours={this.maxNeighbours}
        hasTruncatedFields={this.hasTruncatedFields}
        initialNodeDisplay={this.initialNodeDisplay}
        graphStyleData={this.graphStyleData}
        updateStyle={this.updateStyle}
        getNeighbours={this.getNeighbours.bind(this)}
        nodes={this.nodes}
        relationships={this.relationships}
        fullscreen={this.fullscreen}
        frameHeight={this.frameHeight}
        assignVisElement={this.assignVisElement}
        getAutoCompleteCallback={callback => {
          this.autoCompleteCallback = callback
        }}
        setGraph={this.setGraph.bind(this)}
      />
    )
  }
}
</script>

<style scoped>
</style>

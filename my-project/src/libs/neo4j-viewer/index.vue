<script>
import ExplorerComponent from './components/Explorer'

export default {
  name: 'neo4j-viewer',
  components: { ExplorerComponent },
  data() {
    return {
      maxNeighbours: 100,
      hasTruncatedFields: false,
      initialNodeDisplay: 100,
      graphStyleData: [],
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

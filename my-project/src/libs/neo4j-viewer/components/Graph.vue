<script>
export default {
  name: 'graph-component',
  methods: {
    graphInit(el) {
      this.svgElement = el
    },
    zoomInClicked(el) {
      const limits = this.graphView.zoomIn(el)
      this.zoomInLimitReached = limits.zoomInLimit
      this.zoomOutLimitReached = limits.zoomOutLimit
    },
    zoomOutClicked(el) {
      const limits = this.graphView.zoomOut(el)
      this.zoomInLimitReached = limits.zoomInLimit
      this.zoomOutLimitReached = limits.zoomOutLimit
    },
    getVisualAreaHeight() {
      return this.frameHeight && this.fullscreen
        ? this.frameHeight - (dim.frameStatusbarHeight + dim.frameTitlebarHeight * 2)
        : this.frameHeight - dim.frameStatusbarHeight ||
            this.svgElement.parentNode.offsetHeight
    },
    initGraphView() {
      if (!this.graphView) {
        const NeoConstructor = graphView

        const measureSize = () => {
          return {
            width: this.svgElement.offsetWidth,
            height: this.getVisualAreaHeight()
          }
        }

        this.graph = createGraph(this.nodes, this.relationships)
        this.graphView = new NeoConstructor(
          this.svgElement,
          measureSize,
          this.graph,
          this.graphStyle
        )
        this.graphEH = new GraphEventHandler(
          this.graph,
          this.graphView,
          this.getNodeNeighbours,
          this.onItemMouseOver,
          this.onItemSelect,
          this.onGraphModelChange
        )
        this.graphEH.bindEventHandlers()
        this.onGraphModelChange(getGraphStats(this.graph))
        this.graphView.resize()
        this.graphView.update()
      }
    },
    zoomButtons() {
      return (
        <StyledZoomHolder>
          <StyledZoomButton
            class={this.zoomInLimitReached ? 'faded zoom-in' : 'zoom-in'}
            onClick={this.zoomInClicked.bind(this)}
          >
            <ZoomInIcon regulateSize={this.fullscreen ? 2 : 1} />
          </StyledZoomButton>
          <StyledZoomButton
            class={this.zoomOutLimitReached ? 'faded zoom-out' : 'zoom-out'}
            onClick={this.zoomOutClicked.bind(this)}
          >
            <ZoomOutIcon regulateSize={this.fullscreen ? 2 : 1} />
          </StyledZoomButton>
        </StyledZoomHolder>
      )
    }
  },
  mounted() {
    this.graphInit.bind(this)(this.$refs.vueref0)
    if (this.svgElement != null) {
      this.initGraphView()
      this.graph && this.setGraph && this.setGraph(this.graph)
      this.getAutoCompleteCallback &&
        this.getAutoCompleteCallback(this.addInternalRelationships)
      this.assignVisElement && this.assignVisElement(this.svgElement, this.graphView)
    }
  },
  updated() {
    this.graphInit.bind(this)(this.$refs.vueref0)
    if (prevProps.styleVersion !== this.styleVersion) {
      this.graphView.update()
    }

    if (
      this.fullscreen !== prevProps.fullscreen ||
      this.frameHeight !== prevProps.frameHeight
    ) {
      this.graphView.resize()
    }
  },
  render() {
    return (
      <styled-svg-wrapper>
        <svg class="neod3viz" ref="vueref0" />
        {this.zoomButtons()}
      </styled-svg-wrapper>
    )
  }
}
</script>

<style>
</style>
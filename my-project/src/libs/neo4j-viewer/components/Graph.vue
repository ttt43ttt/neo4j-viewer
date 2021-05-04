<script>
import { createGraph, mapRelationships, getGraphStats } from '../mapper'
import { GraphEventHandler } from '../GraphEventHandler'
import '../lib/visualization/index'
import { dim } from '../constants'
import { StyledZoomHolder, StyledSvgWrapper, StyledZoomButton } from './styled'
import { ZoomInIcon, ZoomOutIcon } from '../icons/Icons'
import graphView from '../lib/visualization/components/graphView'

export default {
  name: 'graph-component',
  props: [
    'fullscreen',
    'frameHeight',
    'relationships',
    'nodes',
    'getNodeNeighbours',
    'handleItemMouseOver',
    'handleItemSelect',
    'graphStyle',
    'styleVersion',
    'handleGraphModelChange',
    'assignVisElement',
    'getAutoCompleteCallback',
    'setGraph'
  ],
  components: { StyledSvgWrapper },
  methods: {
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
            this.$refs.svgElement.parentNode.offsetHeight
    },
    initGraphView() {
      if (!this.graphView) {
        const NeoConstructor = graphView

        const measureSize = () => {
          return {
            width: this.$refs.svgElement.offsetWidth,
            height: this.getVisualAreaHeight()
          }
        }

        this.graph = createGraph(this.nodes, this.relationships)
        this.graphView = new NeoConstructor(
          this.$refs.svgElement,
          measureSize,
          this.graph,
          this.graphStyle
        )
        this.graphEH = new GraphEventHandler(
          this.graph,
          this.graphView,
          this.getNodeNeighbours,
          this.handleItemMouseOver,
          this.handleItemSelect,
          this.handleGraphModelChange
        )
        this.graphEH.bindEventHandlers()
        this.handleGraphModelChange(getGraphStats(this.graph))
        this.graphView.resize()
        this.graphView.update()
      }
    },
    addInternalRelationships(internalRelationships) {
      if (this.graph) {
        this.graph.addInternalRelationships(
          mapRelationships(internalRelationships, this.graph)
        )
        this.onGraphModelChange(getGraphStats(this.graph))
        this.graphView.update()
        this.graphEH.onItemMouseOut()
      }
    },
    zoomButtons() {
      return (
        <StyledZoomHolder>
          <StyledZoomButton
            class={this.zoomInLimitReached ? 'faded zoom-in' : 'zoom-in'}
            handleClick={this.zoomInClicked.bind(this)}
          >
            <ZoomInIcon regulateSize={this.fullscreen ? 2 : 1} />
          </StyledZoomButton>
          <StyledZoomButton
            class={this.zoomOutLimitReached ? 'faded zoom-out' : 'zoom-out'}
            handleClick={this.zoomOutClicked.bind(this)}
          >
            <ZoomOutIcon regulateSize={this.fullscreen ? 2 : 1} />
          </StyledZoomButton>
        </StyledZoomHolder>
      )
    }
  },
  mounted() {
    if (this.$refs.svgElement != null) {
      this.initGraphView()
      this.graph && this.setGraph && this.setGraph(this.graph)
      this.getAutoCompleteCallback &&
        this.getAutoCompleteCallback(this.addInternalRelationships)
      this.assignVisElement &&
        this.assignVisElement(this.$refs.svgElement, this.graphView)
    }
  },
  updated() {},
  watch: {
    styleVersion: function (styleVersion, prevStyleVersion) {
      if (prevStyleVersion !== styleVersion) {
        this.graphView.update()
      }
    },
    fullscreen: function (fullscreen, prevFullscreen) {
      if (fullscreen !== prevFullscreen) {
        this.graphView.resize()
      }
    },
    frameHeight: function (frameHeight, prevFrameHeight) {
      if (frameHeight !== prevFrameHeight) {
        this.graphView.resize()
      }
    }
  },
  render() {
    return (
      <styled-svg-wrapper>
        <svg class="neod3viz" ref="svgElement" />
        {this.zoomButtons()}
      </styled-svg-wrapper>
    )
  }
}
</script>

<style>
</style>

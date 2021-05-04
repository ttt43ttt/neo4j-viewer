<script>
import deepmerge from 'deepmerge'
import { deepEquals } from '../services/utils'
import GraphComponent from './Graph'
import neoGraphStyle from '../graphStyle'
import InspectorComponent from './Inspector'
import LegendComponent from './Legend'
import { StyledFullSizeContainer } from './styled'

const deduplicateNodes = nodes => {
  return nodes.reduce(
    (all, curr) => {
      if (all.taken.indexOf(curr.id) > -1) {
        return all
      } else {
        all.nodes.push(curr)
        all.taken.push(curr.id)
        return all
      }
    },
    { nodes: [], taken: [] }
  ).nodes
}

export default {
  name: 'explorer-component',
  props: [
    'maxNeighbours',
    'hasTruncatedFields',
    'initialNodeDisplay',
    'graphStyleData',
    'updateStyle',
    'getNeighbours',
    'nodes',
    'relationships',
    'fullscreen',
    'frameHeight',
    'assignVisElement',
    'getAutoCompleteCallback',
    'setGraph'
  ],
  components: {
    GraphComponent,
    InspectorComponent,
    LegendComponent,
    StyledFullSizeContainer
  },
  data() {
    const graphStyle = neoGraphStyle()
    this.defaultStyle = graphStyle.toSheet()
    let relationships = this.relationships
    let nodes = deduplicateNodes(this.nodes)
    let selectedItem = ''

    if (nodes.length > parseInt(this.initialNodeDisplay)) {
      nodes = nodes.slice(0, this.initialNodeDisplay)
      relationships = this.relationships.filter(item => {
        return nodes.filter(node => node.id === item.startNodeId) > 0
      })
      selectedItem = {
        type: 'status-item',
        item: `Not all return nodes are being displayed due to Initial Node Display setting. Only ${this.initialNodeDisplay} of ${nodes.length} nodes are being displayed`
      }
    }

    if (this.graphStyleData) {
      const rebasedStyle = deepmerge(this.defaultStyle, this.graphStyleData)
      graphStyle.loadRules(rebasedStyle)
    }

    return {
      stats: { labels: {}, relTypes: {} },
      graphStyle: graphStyle,
      styleVersion: 0,
      nodesData: nodes,
      relationshipsData: relationships,
      selectedItem: selectedItem,
      labels: {},
      relTypes: {},
      freezeLegend: false
    }
  },
  methods: {
    getNodeNeighbours(node, currentNeighbours, callback) {
      if (currentNeighbours.length > this.maxNeighbours) {
        callback(null, {
          nodes: [],
          relationships: []
        })
      }

      this.getNeighbours(node.id, currentNeighbours).then(
        result => {
          const nodes = result.nodes

          if (result.count > this.maxNeighbours - currentNeighbours.length) {
            this.selectedItem = {
              type: 'status-item',
              item: `Rendering was limited to ${this.maxNeighbours} of the node's total ${
                result.count + currentNeighbours.length
              } neighbours due to browser config maxNeighbours.`
            }
          }

          callback(null, {
            nodes: nodes,
            relationships: result.relationships
          })
        },
        () => {
          callback(null, {
            nodes: [],
            relationships: []
          })
        }
      )
    },
    handleItemMouseOver(item) {
      this.hoveredItem = item
    },
    handleItemSelect(item) {
      this.selectedItem = item
    },
    handleGraphModelChange(stats) {
      this.stats = stats
      this.updateStyle(this.graphStyle.toSheet())
    },
    handleSelectedLabel(label, propertyKeys) {
      this.selectedItem = {
        type: 'legend-item',
        item: {
          selectedLabel: {
            label: label,
            propertyKeys: propertyKeys
          },
          selectedRelType: null
        }
      }
    },
    handleSelectedRelType(relType, propertyKeys) {
      this.selectedItem = {
        type: 'legend-item',
        item: {
          selectedLabel: null,
          selectedRelType: {
            relType: relType,
            propertyKeys: propertyKeys
          }
        }
      }
    },
    handleInspectorExpandToggled(contracted, inspectorHeight) {
      this.inspectorContracted = contracted
      this.forcePaddingBottom = inspectorHeight
    }
  },
  watch: {
    graphStyleData: function (graphStyleData, prevGraphStyleData) {
      if (!deepEquals(graphStyleData, prevGraphStyleData)) {
        if (this.graphStyleData) {
          const rebasedStyle = deepmerge(this.defaultStyle, this.graphStyleData)
          this.graphStyle.loadRules(rebasedStyle)
          this.graphStyle = this.graphStyle
          this.styleVersion = this.styleVersion + 1
        } else {
          this.graphStyle.resetToDefault()
          this.graphStyle = this.graphStyle
          this.freezeLegend = true
          this.$nextTick(() => {
            this.freezeLegend = false
            this.updateStyle(this.graphStyle.toSheet())
          })
        }
      }
    }
  },
  render() {
    // This is a workaround to make the style reset to the same colors as when starting the browser with an empty style
    // If the legend component has the style it will ask the neoGraphStyle object for styling before the graph component,
    // and also doing this in a different order from the graph. This leads to different default colors being assigned to different labels.
    let legend

    if (this.freezeLegend) {
      legend = (
        <legend-component
          stats={this.stats}
          graphStyle={neoGraphStyle()}
          handleSelectedLabel={this.handleSelectedLabel.bind(this)}
          handleSelectedRelType={this.handleSelectedRelType.bind(this)}
        />
      )
    } else {
      legend = (
        <legend-component
          stats={this.stats}
          graphStyle={this.graphStyle}
          handleSelectedLabel={this.handleSelectedLabel.bind(this)}
          handleSelectedRelType={this.handleSelectedRelType.bind(this)}
        />
      )
    }

    const inspectingItemType =
      !this.inspectorContracted &&
      ((this.hoveredItem && this.hoveredItem.type !== 'canvas') ||
        (this.selectedItem && this.selectedItem.type !== 'canvas'))
    return (
      <styled-full-size-container
        id="svg-vis"
        class={Object.keys(this.stats.relTypes).length ? '' : 'one-legend-row'}
        forcePaddingBottom={inspectingItemType ? this.forcePaddingBottom : null}
      >
        {legend}
        <graph-component
          fullscreen={this.fullscreen}
          frameHeight={this.frameHeight}
          relationships={this.relationshipsData}
          nodes={this.nodesData}
          getNodeNeighbours={this.getNodeNeighbours.bind(this)}
          handleItemMouseOver={this.handleItemMouseOver.bind(this)}
          handleItemSelect={this.handleItemSelect.bind(this)}
          graphStyle={this.graphStyle}
          styleVersion={this.styleVersion} // cheap way for child to check style updates
          handleGraphModelChange={this.handleGraphModelChange.bind(this)}
          assignVisElement={this.assignVisElement}
          getAutoCompleteCallback={this.getAutoCompleteCallback}
          setGraph={this.setGraph}
        />
        <inspector-component
          hasTruncatedFields={this.hasTruncatedFields}
          fullscreen={this.fullscreen}
          hoveredItem={this.hoveredItem}
          selectedItem={this.selectedItem}
          graphStyle={this.graphStyle}
          handleExpandToggled={this.handleInspectorExpandToggled.bind(this)}
        />
      </styled-full-size-container>
    )
  }
}
</script>

<style>
</style>

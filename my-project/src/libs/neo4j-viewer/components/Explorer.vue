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
  components: {
    GraphComponent,
    InspectorComponent,
    LegendComponent,
    StyledFullSizeContainer
  },
  data() {
    return {
      stats: { labels: {}, relTypes: {} },
      graphStyle: {},
      styleVersion: 0,
      nodes: [],
      relationships: [],
      selectedItem: '',
      labels: {},
      relTypes: {}
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
    onItemMouseOver(item) {
      this.hoveredItem = item
    },
    onItemSelect(item) {
      this.selectedItem = item
    },
    onGraphModelChange(stats) {
      this.stats = stats
      this.updateStyle(this.graphStyle.toSheet())
    },
    onSelectedLabel(label, propertyKeys) {
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
    onSelectedRelType(relType, propertyKeys) {
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
    onInspectorExpandToggled(contracted, inspectorHeight) {
      this.inspectorContracted = contracted
      this.forcePaddingBottom = inspectorHeight
    }
  },
  created() {
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

    // set state
    const data = this.data
    data.graphStyle = graphStyle
    data.nodes = nodes
    data.relationships = relationships
    data.selectedItem = selectedItem
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
            this.setState({
              freezeLegend: false
            })
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
          onSelectedLabel={this.onSelectedLabel.bind(this)}
          onSelectedRelType={this.onSelectedRelType.bind(this)}
        />
      )
    } else {
      legend = (
        <legend-component
          stats={this.stats}
          graphStyle={this.graphStyle}
          onSelectedLabel={this.onSelectedLabel.bind(this)}
          onSelectedRelType={this.onSelectedRelType.bind(this)}
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
          relationships={this.relationships}
          nodes={this.nodes}
          getNodeNeighbours={this.getNodeNeighbours.bind(this)}
          onItemMouseOver={this.onItemMouseOver.bind(this)}
          onItemSelect={this.onItemSelect.bind(this)}
          graphStyle={this.graphStyle}
          styleVersion={this.styleVersion} // cheap way for child to check style updates
          onGraphModelChange={this.onGraphModelChange.bind(this)}
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
          onExpandToggled={this.onInspectorExpandToggled.bind(this)}
        />
      </styled-full-size-container>
    )
  }
}
</script>

<style>
</style>

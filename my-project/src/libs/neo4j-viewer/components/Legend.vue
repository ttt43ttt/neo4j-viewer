<script>
import {
  legendRowHeight,
  StyledLegendRow,
  StyledTokenRelationshipType,
  StyledLegendInlineListItem,
  StyledLegend,
  StyledLegendContents,
  StyledLabelToken,
  StyledTokenCount,
  StyledLegendInlineList
} from './styled'
import RowExpandToggleComponent from './RowExpandToggle'
import numberToUSLocale from '../utils/number-to-US-locale'

export default {
  name: 'legend-component',
  props: ['stats', 'graphStyle', 'handleSelectedLabel', 'handleSelectedRelType'],
  components: {
    StyledLegendRow,
    StyledTokenRelationshipType,
    StyledLegendInlineListItem,
    StyledLegend,
    StyledLegendContents,
    StyledLabelToken,
    StyledTokenCount,
    StyledLegendInlineList,
    RowExpandToggleComponent
  },
  data() {
    return { typeRowContracted: true, labelRowContracted: true }
  },
  methods: {
    setTypeRowELem(elem) {
      if (elem) {
        this.typeRowElem = elem
      }
    },
    setLabelRowELem(elem) {
      if (elem) {
        this.labelRowELem = elem
      }
    }
  },
  created() {
    this.typeRowElem = null
    this.labelRowELem = null
  },
  mounted() {
    this.setTypeRowELem.bind(this)(this.$refs.vueref3)
    this.setLabelRowELem.bind(this)(this.$refs.vueref2)
  },
  updated() {
    this.setTypeRowELem.bind(this)(this.$refs.vueref3)
    this.setLabelRowELem.bind(this)(this.$refs.vueref2)
  },
  render() {
    const mapLabels = labels => {
      const labelList = Object.keys(labels).map((legendItemKey, i) => {
        const styleForItem = this.graphStyle.forNode({
          labels: [legendItemKey]
        })

        const handleClick = () => {
          this.handleSelectedLabel(
            legendItemKey,
            Object.keys(labels[legendItemKey].properties)
          )
        }

        const style = {
          backgroundColor: styleForItem.get('color'),
          color: styleForItem.get('text-color-internal')
        }
        return (
          <styled-legend-inline-list-item key={i} data-testid="viz-legend-labels">
            <styled-legend-contents class="contents">
              <styled-label-token
                handleClick={handleClick}
                style={style}
                class="token token-label"
              >
                {legendItemKey}
                <styled-token-count class="count">{`(${numberToUSLocale(
                  labels[legendItemKey].count
                )})`}</styled-token-count>
              </styled-label-token>
            </styled-legend-contents>
          </styled-legend-inline-list-item>
        )
      })
      return (
        <styled-legend-row class={this.labelRowContracted ? 'contracted' : ''}>
          <styled-legend-inline-list class="list-inline" ref="vueref2">
            <row-expand-toggle-component
              contracted={this.labelRowContracted}
              rowElem={this.labelRowELem}
              containerHeight={legendRowHeight}
              handleClick={() => {
                this.setState({
                  labelRowContracted: !this.labelRowContracted
                })
              }}
            />
            {labelList}
          </styled-legend-inline-list>
        </styled-legend-row>
      )
    }

    const mapRelTypes = legendItems => {
      if (!legendItems || !Object.keys(legendItems).length) {
        return null
      }

      const relTypeList = Object.keys(legendItems).map((legendItemKey, i) => {
        const styleForItem = this.graphStyle.forRelationship({
          type: legendItemKey
        })

        const handleClick = () => {
          this.handleSelectedRelType(
            legendItemKey,
            Object.keys(legendItems[legendItemKey].properties)
          )
        }

        const style = {
          backgroundColor: styleForItem.get('color'),
          color: styleForItem.get('text-color-internal')
        }
        return (
          <styled-legend-inline-list-item key={i} data-testid="viz-legend-reltypes">
            <styled-legend-contents class="contents">
              <styled-token-relationship-type
                handleClick={handleClick}
                style={style}
                class="token token-relationship-type"
              >
                {legendItemKey}
                <styled-token-count class="count">
                  {`(${numberToUSLocale(legendItems[legendItemKey].count)})`}
                </styled-token-count>
              </styled-token-relationship-type>
            </styled-legend-contents>
          </styled-legend-inline-list-item>
        )
      })
      return (
        <styled-legend-row class={this.typeRowContracted ? 'contracted' : ''}>
          <styled-legend-inline-list class="list-inline" ref="vueref3">
            <row-expand-toggle-component
              contracted={this.typeRowContracted}
              rowElem={this.typeRowElem}
              containerHeight={legendRowHeight}
              handleClick={() => {
                this.setState({
                  typeRowContracted: !this.typeRowContracted
                })
              }}
            />
            {relTypeList}
          </styled-legend-inline-list>
        </styled-legend-row>
      )
    }

    const relTypes = mapRelTypes(this.stats.relTypes)
    return (
      <styled-legend class={relTypes ? '' : 'one-row'}>
        {mapLabels(this.stats.labels)}
        {relTypes}
      </styled-legend>
    )
  }
}
</script>

<style>
</style>

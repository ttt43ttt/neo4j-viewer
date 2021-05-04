<script>
import { deepEquals, optionalToString } from '../services/utils'
import SVGInline from '../SVGInline'
import {
  inspectorFooterContractedHeight,
  StyledInspectorFooterStatusMessage,
  StyledTokenContextMenuKey,
  StyledTokenRelationshipType,
  StyledLabelToken,
  StyledStatusBar,
  StyledStatus,
  StyledInspectorFooter,
  StyledInspectorFooterRow,
  StyledInspectorFooterRowListPair,
  StyledInspectorFooterRowListKey,
  StyledInspectorFooterRowListValue,
  StyledInlineList
} from './styled'
import GrassEditor from './GrassEditor'
import RowExpandToggleComponent from './RowExpandToggle'
import ClickableUrls from '../ClickableUrls'
import numberToUSLocale from '../utils/number-to-US-locale'

const mapItemProperties = itemProperties =>
  itemProperties
    .sort(({ key: keyA }, { key: keyB }) => (keyA < keyB ? -1 : keyA === keyB ? 0 : 1))
    .map((prop, i) => (
      <StyledInspectorFooterRowListPair class="pair" key={'prop' + i}>
        <StyledInspectorFooterRowListKey class="key">
          {prop.key + ': '}
        </StyledInspectorFooterRowListKey>
        <StyledInspectorFooterRowListValue class="value">
          <ClickableUrls text={optionalToString(prop.value)} />
        </StyledInspectorFooterRowListValue>
      </StyledInspectorFooterRowListPair>
    ))

const mapLabels = (graphStyle, itemLabels) => {
  return itemLabels.map((label, i) => {
    const graphStyleForLabel = graphStyle.forNode({ labels: [label] })
    const style = {
      backgroundColor: graphStyleForLabel.get('color'),
      color: graphStyleForLabel.get('text-color-internal')
    }
    return (
      <StyledLabelToken
        key={'label' + i}
        style={style}
        class={'token' + ' ' + 'token-label'}
      >
        {label}
      </StyledLabelToken>
    )
  })
}

export default {
  name: 'inspector-component',
  components: {
    StyledInspectorFooterStatusMessage,
    StyledTokenContextMenuKey,
    StyledTokenRelationshipType,
    StyledLabelToken,
    StyledStatusBar,
    StyledStatus,
    StyledInspectorFooter,
    StyledInspectorFooterRow,
    StyledInspectorFooterRowListPair,
    StyledInspectorFooterRowListKey,
    StyledInspectorFooterRowListValue,
    StyledInlineList,
    RowExpandToggleComponent,
    GrassEditor
  },
  data() {
    return { contracted: true, graphStyle: this.graphStyle }
  },
  methods: {
    setFooterRowELem(elem) {
      if (elem) {
        this.footerRowElem = elem
      }
    },
    toggleExpand() {
      this.contracted = !this.contracted
      this.$nextTick(() => {
        const inspectorHeight = this.footerRowElem.clientHeight
        this.handleExpandToggled &&
          this.handleExpandToggled(this.contracted, this.contracted ? 0 : inspectorHeight)
      })
    }
  },
  mounted() {
    this.setFooterRowELem.bind(this)(this.$refs.vueref1)
  },
  watch: {
    selectedItem: function (selectedItem, prevSelectedItem) {
      if (!deepEquals(selectedItem, prevSelectedItem)) {
        this.contracted = true
        this.handleExpandToggled && this.handleExpandToggled(true, 0)
      }
    }
  },
  render() {
    let item
    let type
    let inspectorContent

    if (this.hoveredItem && this.hoveredItem.type !== 'canvas') {
      item = this.hoveredItem.item
      type = this.hoveredItem.type
    } else if (this.selectedItem) {
      item = this.selectedItem.item
      type = this.selectedItem.type
    } else if (this.hoveredItem) {
      // Canvas
      item = this.hoveredItem.item
      type = this.hoveredItem.type
    }

    if (item && type) {
      if (type === 'legend-item') {
        inspectorContent = (
          <grass-editor
            selectedLabel={item.selectedLabel}
            selectedRelType={item.selectedRelType}
          />
        )
      }

      if (type === 'status-item') {
        inspectorContent = (
          <styled-inspector-footer-status-message class="value">
            {item}
          </styled-inspector-footer-status-message>
        )
      }

      if (type === 'context-menu-item') {
        inspectorContent = (
          <styled-inline-list class="list-inline">
            <styled-token-context-menu-key
              key="token"
              class={'token' + ' ' + 'token-context-menu-key' + ' ' + 'token-label'}
            >
              <SVGInline svg={item.label} width="12px" />
            </styled-token-context-menu-key>
            <styled-inspector-footer-row-list-pair key="pair" class="pair">
              <styled-inspector-footer-row-list-value class="value">
                {item.content}
              </styled-inspector-footer-row-list-value>
            </styled-inspector-footer-row-list-pair>
          </styled-inline-list>
        )
      } else if (type === 'canvas') {
        const description = `Displaying ${numberToUSLocale(
          item.nodeCount
        )} nodes, ${numberToUSLocale(item.relationshipCount)} relationships.`
        inspectorContent = (
          <styled-inline-list class="list-inline">
            <styled-inspector-footer-row-list-pair class="pair" key="pair">
              <styled-inspector-footer-row-list-value class="value">
                {this.hasTruncatedFields && (
                  <span style="color: orange">
                    Warning: Record fields have been truncated.&nbsp;
                  </span>
                )}
                {description}
              </styled-inspector-footer-row-list-value>
            </styled-inspector-footer-row-list-pair>
          </styled-inline-list>
        )
      } else if (type === 'node') {
        inspectorContent = (
          <styled-inline-list class="list-inline">
            {mapLabels(this.graphStyle, item.labels)}
            <styled-inspector-footer-row-list-pair key="pair" class="pair">
              <styled-inspector-footer-row-list-key class="key">
                {'<id>:'}
              </styled-inspector-footer-row-list-key>
              <styled-inspector-footer-row-list-value class="value">
                {item.id}
              </styled-inspector-footer-row-list-value>
            </styled-inspector-footer-row-list-pair>
            {mapItemProperties(item.properties)}
          </styled-inline-list>
        )
      } else if (type === 'relationship') {
        const style = {
          backgroundColor: this.graphStyle.forRelationship(item).get('color'),
          color: this.graphStyle.forRelationship(item).get('text-color-internal')
        }
        inspectorContent = (
          <styled-inline-list class="list-inline">
            <styled-token-relationship-type
              key="token"
              style={style}
              class={'token' + ' ' + 'token-relationship-type'}
            >
              {item.type}
            </styled-token-relationship-type>
            <styled-inspector-footer-row-list-pair key="pair" class="pair">
              <styled-inspector-footer-row-list-key class="key">
                {'<id>:'}
              </styled-inspector-footer-row-list-key>
              <styled-inspector-footer-row-list-value class="value">
                {item.id}
              </styled-inspector-footer-row-list-value>
            </styled-inspector-footer-row-list-pair>
            {mapItemProperties(item.properties)}
          </styled-inline-list>
        )
      }
    }

    return (
      <styled-status-bar fullscreen={this.fullscreen} class="status-bar">
        <styled-status class="status">
          <styled-inspector-footer
            class={this.contracted ? 'contracted inspector-footer' : 'inspector-footer'}
          >
            <styled-inspector-footer-row
              data-testid="vizInspector"
              class="inspector-footer-row"
              ref="vueref1"
            >
              {type === 'canvas' ? null : (
                <row-expand-toggle-component
                  contracted={this.contracted}
                  rowElem={this.footerRowElem}
                  containerHeight={inspectorFooterContractedHeight}
                  handleClick={this.toggleExpand.bind(this)}
                />
              )}
              {inspectorContent}
            </styled-inspector-footer-row>
          </styled-inspector-footer>
        </styled-status>
      </styled-status-bar>
    )
  }
}
</script>

<style>
</style>

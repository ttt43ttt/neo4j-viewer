<script>
import { StyledRowToggle, StyledCaret } from './styled'

const getHeightFromElem = rowElem => rowElem && (rowElem ? rowElem.clientHeight : 0)

export default {
  name: 'row-expand-toggle-component',
  props: ['contracted', 'rowElem', 'containerHeight', 'handleClick'],
  components: {
    StyledRowToggle,
    StyledCaret
  },
  methods: {
    updateDimensions() {
      this.rowHeight = getHeightFromElem(this.rowElem)
    }
  },
  mounted() {
    this.updateDimensions()
    window.addEventListener('resize', this.updateDimensions)
  },
  destroyed() {
    window.removeEventListener('resize', this.updateDimensions)
  },
  updated() {
    const rowHeight = getHeightFromElem(this.rowElem)

    if (this.rowHeight !== rowHeight) {
      this.updateDimensions()
    }
  },
  render() {
    if (this.containerHeight * 1.1 < this.rowHeight) {
      return (
        <styled-row-toggle onClick={this.handleClick}>
          <styled-caret
            class={this.contracted ? 'fa fa-caret-left' : 'fa fa-caret-down'}
          />
        </styled-row-toggle>
      )
    } else {
      return null
    }
  }
}
</script>

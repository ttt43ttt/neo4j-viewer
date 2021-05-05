import IconContainer from './IconContainer'

const inactive = `
  color: #797979;
  fill: #797979;
`

export const ZoomInIcon = {
  name: 'zoom-in-icon',
  render() {
    const { regulateSize } = this.$attrs
    return (
      <IconContainer
        text="放大"
        activeStyle={inactive}
        inactiveStyle={inactive}
        regulateSize={regulateSize}
        class="sl-zoom-in"
      />
    )
  }
}

export const ZoomOutIcon = {
  name: 'zoom-out-icon',
  render() {
    const { regulateSize } = this.$attrs
    return (
      <IconContainer
        text="缩小"
        activeStyle={inactive}
        inactiveStyle={inactive}
        regulateSize={regulateSize}
        class="sl-zoom-out"
      />
    )
  }
}

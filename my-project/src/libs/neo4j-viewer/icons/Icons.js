import IconContainer from './IconContainer'

export const ZoomInIcon = {
  name: 'zoom-in-icon',
  render() {
    const { inactive, regulateSize } = this.$attrs
    return (
      <IconContainer
        activeStyle={inactive}
        inactiveStyle={inactive}
        regulateSize={regulateSize}
        className="sl-zoom-in"
      />
    )
  }
}

export const ZoomOutIcon = {
  name: 'zoom-out-icon',
  render() {
    const { inactive, regulateSize } = this.$attrs
    return (
      <IconContainer
        activeStyle={inactive}
        inactiveStyle={inactive}
        regulateSize={regulateSize}
        className="sl-zoom-out"
      />
    )
  }
}

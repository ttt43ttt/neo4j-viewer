<script>
export default {
  name: 'icon-container',
  render() {
    const { text, regulateSize, icon, width, title, ...rest } = this.$props
    const regulateSizeStyle = regulateSize ? { fontSize: regulateSize + 'em' } : undefined
    const currentIcon = icon ? (
      <styled-icon-wrapper {...rest}>
        <SVGInline
          cleanup={['title']}
          svg={icon}
          accessibilityLabel={title}
          width={width + 'px'}
        />
      </styled-icon-wrapper>
    ) : (
      <styled-icon-wrapper {...rest} style={regulateSizeStyle} />
    )
    return text ? (
      <span>
        {currentIcon}
        <styled-text>{text}</styled-text>
      </span>
    ) : (
      currentIcon
    )
  }
}
</script>

<style>
</style>

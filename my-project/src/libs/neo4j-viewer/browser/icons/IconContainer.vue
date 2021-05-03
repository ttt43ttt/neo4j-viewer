<script>
import styled, { CSSProperties, FlattenSimpleInterpolation } from 'vue-styled-components'
import SVGInline from '../../SVGInline'

const StyledIconWrapper = ({ activeStyle, inactiveStyle, isOpen, children, ...rest }) => {
  const I = styled.i`
    ${isOpen ? activeStyle : inactiveStyle};
    &:hover {
      ${activeStyle};
    }
  `
  return <I {...rest}>{children}</I>
}

const StyledText = styled.div`
  font-size: 9px;
  line-height: 10px;
  margin-top: 4px;
  padding: 0;
`

export default {
  name: 'icon-container',
  components: { StyledIconWrapper },
  render() {
    const { text, regulateSize, icon, width, title, ...rest } = this.$attrs
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

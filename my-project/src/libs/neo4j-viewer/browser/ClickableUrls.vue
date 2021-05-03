<script>
// credits to https://www.regextester.com/96504, modified though
const URL_REGEX = /(?:https?|s?ftp|bolt):\/\/(?:(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))?\))+(?:\((?:[^\s()<>]+|(?:\(?:[^\s()<>]+\)))?\)|[^\s`!()[\]{};:'".,<>?«»“”‘’]))?/gi

export default {
  name: 'clickable-urls',
  render() {
    const { text, WrappingTag = 'span' } = this.$props
    const definedText = text || ''
    const urls = definedText.match(URL_REGEX) || []
    return (
      <wrapping-tag>
        {definedText.split(URL_REGEX).map((text, index) => {
          /* since we never move these components this key should be fine */
          return (
            <React.Fragment key={index}>
              {text}
              {urls[index] && (
                <a href={urls[index]} target="_blank" rel="noreferrer">
                  {urls[index]}
                </a>
              )}
            </React.Fragment>
          )
        })}
      </wrapping-tag>
    )
  }
}
</script>

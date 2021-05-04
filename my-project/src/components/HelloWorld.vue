<script>
const ChildComponent = {
  name: 'ChildComponent',
  render() {
    return <div onClick={this.$listeners.click}>Child Component</div>
  }
}

// lower-case started function needs the "h" parameter
const functionReturnJsx2 = (h, a1, a2, a3) => {
  return (
    <div>
      functionReturnJsx2: {a1} {a2} {a3}
    </div>
  )
}

// Upper-case started function is compiled to VUE functional component
const JsxComponent = ({ props }) => {
  return <div>JSX component: {props.prop1}</div>
}

export default {
  name: 'HelloWorld',
  components: { ChildComponent },
  data() {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  methods: {
    doSomething() {
      console.log(`HelloWorld is clicked`)
    }
  },
  render(h) {
    // function inside the render does not need the "h" parameter
    const functionReturnJsx1 = (a1, a2, a3) => {
      return (
        <div>
          functionReturnJsx1: {a1} {a2} {a3}
        </div>
      )
    }
    return (
      <div>
        hello world
        <ChildComponent onClick={this.doSomething} />
        <JsxComponent prop1="abc" />
        {functionReturnJsx1('a', 'b', 'c')}
        {functionReturnJsx2(h, 'a', 'b', 'c')}
      </div>
    )
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

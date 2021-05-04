<script>
const ChildComponent = {
  name: 'ChildComponent',
  render() {
    return <div onClick={this.$listeners.click}>Child Component</div>
  }
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
  render() {
    return (
      <div>
        hello world
        <ChildComponent onClick={this.doSomething} />
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

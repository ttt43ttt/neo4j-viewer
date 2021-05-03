<template>
  <div class="index">
    <Card>
      <Form ref="req" :model="req" :label-width="120" inline>
        <FormItem label="快速查询" prop="relationship">
          <Select
            v-model="req.relationship"
            placeholder=""
            clearable
            style="width: 200px"
          >
            <Option
              v-for="item in relationshipList"
              :value="item.value"
              :key="item.key"
              >{{ item.value }}</Option
            >
          </Select>
          <Button type="primary" @click="searchHandle()">查询</Button>
        </FormItem>
        <FormItem> </FormItem>
        <br />
        <FormItem label="按节点查询" prop="relationship">
          <AutoComplete
            v-model="keywords"
            :data="remoteOptions"
            @on-search="autocompleteSearch"
            placeholder="请输入导演名称"
            style="width: 200px"
          ></AutoComplete>
          <Button type="primary" @click="searchNodeHandle()">查询</Button>
        </FormItem>
      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
    <Modal
      :width="50"
      v-model="modalFlag1"
      title="新增导演"
      @on-ok="saveAddDirector"
      footer-hide
      :mask-closable="false"
    >
      <Form
        ref="addForm"
        :label-width="200"
        class="form"
        style="width: 80%"
        :rules="addRules1"
        :model="director"
      >
        <FormItem label="导演名称" prop="name">
          <Input v-model="director.name" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveAddDirector">确定</Button>
          <Button style="margin-left: 20px" @click="modalFlag1 = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :width="50"
      v-model="modalFlag2"
      title="新增演员"
      @on-ok="saveAddActor"
      footer-hide
      :mask-closable="false"
    >
      <Form
        ref="addForm"
        :label-width="200"
        class="form"
        style="width: 80%"
        :rules="addRules2"
        :model="actor"
      >
        <FormItem label="演员名称" prop="name">
          <Input v-model="actor.name" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveAddActor">确定</Button>
          <Button style="margin-left: 20px" @click="modalFlag2 = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      :width="50"
      v-model="modalFlag3"
      title="新增电影"
      @on-ok="saveAddMovie"
      footer-hide
      :mask-closable="false"
    >
      <Form
        ref="addForm"
        :label-width="200"
        class="form"
        style="width: 80%"
        :rules="addRules3"
        :model="movie"
      >
        <FormItem label="电影名称" prop="name">
          <Input v-model="movie.name" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="saveAddMovie">确定</Button>
          <Button style="margin-left: 20px" @click="modalFlag3 = false">取消</Button>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="modalFlag4" title="提示" @on-ok="cleanAllDataHandle">
      <p>确定要删除所有节点和关系吗？</p>
    </Modal>
    <Modal v-model="modalFlag5" title="预览" @on-ok="submitCsv" ok-text="确认上传">
      <pre
        >{{ content }}
      </pre>
    </Modal>

    <div id="neo4jd3"></div>
  </div>
</template>
<script>
import Neo4jD3 from '@/libs/neo4jd3'
import {
  getRelationshipList,
  neo4jRestRxCommit,
  neo4jDataUrl,
  addDirector,
  addMovie,
  addActor,
  cleanAllData,
  queryByNode,
  searchNodeName,
  uploadCsv
} from '@/api/kg/kg-browser'
export default {
  name: 'kg-browser',
  data() {
    return {
      spinShow: true,
      relationshipList: [],
      req: {
        relationship: null
      },
      modalFlag1: false,
      modalFlag2: false,
      modalFlag3: false,
      modalFlag4: false,
      modalFlag5: false,
      director: {},
      actor: {},
      movie: {},
      addRules1: {
        name: [
          {
            required: true,
            message: '请输入导演名称',
            trigger: 'blur'
          }
        ]
      },
      addRules2: {
        name: [
          {
            required: true,
            message: '请输入演员名称',
            trigger: 'blur'
          }
        ]
      },
      addRules3: {
        name: [
          {
            required: true,
            message: '请输入电影名称',
            trigger: 'blur'
          }
        ]
      },
      keywords: '',
      remoteOptions: [],
      graphData: {},
      neo4jData: {},
      file: null,
      loadingStatus: false,
      isPreview: true,
      content: ''
    }
  },
  methods: {
    saveAddDirector() {
      addDirector(this.director)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success('添加成功')
            this.modalFlag1 = false
            this.spinShow = true
            this.init()
            this.spinShow = false
          }
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
    },
    saveAddActor() {
      addActor(this.actor)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success('添加成功')
            this.modalFlag2 = false
            this.spinShow = true
            this.init()
            this.spinShow = false
          }
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
    },
    saveAddMovie() {
      addMovie(this.movie)
        .then(res => {
          if (res.data.code == 200) {
            this.$Message.success('添加成功')
            this.modalFlag3 = false
            this.spinShow = true
            this.graphData = res.data
            this.init(this.graphData)
            this.spinShow = false
          }
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
    },
    cleanAllDataHandle() {
      cleanAllData()
        .then(res => {
          this.spinShow = true
          this.graphData = res.data
          this.init(this.graphData)
          this.spinShow = false
          this.$Message.success('删除成功')
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
    },
    searchHandle() {
      this.spinShow = true
      if (this.req.relationship == undefined) {
        this.req.relationship = null
      }
      neo4jRestRxCommit(this.req.relationship)
        .then(res => {
          this.graphData = res.data
          this.init(this.graphData)
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
      this.spinShow = false
    },
    autocompleteSearch(value) {
      searchNodeName(value)
        .then(res => {
          this.remoteOptions = res.data
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
    },
    searchNodeHandle() {
      this.spinShow = true
      let params = {
        labelName: '导演',
        nodeName: this.keywords
      }
      queryByNode(params)
        .then(res => {
          this.graphData = res.data
          this.init(this.graphData)
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
        })
      this.spinShow = false
    },
    handleUpload(file) {
      this.file = file
      return false
    },
    submitCsv() {
      this.isPreview = false
      this.upload()
    },
    upload() {
      this.loadingStatus = true
      let formData = new FormData()
      formData.append('file', this.file)
      formData.append('fileType', '电影')
      formData.append('isPreview', this.isPreview)
      uploadCsv(formData)
        .then(res => {
          this.loadingStatus = false
          this.spinShow = false
          if (this.isPreview) {
            this.modalFlag5 = true
            this.content = res.data
          } else {
            this.content = ''
            this.isPreview = true
            this.$Message.success('上传完成')
            neo4jRestRxCommit(this.req.relationship)
              .then(res => {
                this.graphData = res.data
                this.init(this.graphData)
              })
              .catch(err => {
                this.$Message.error('处理异常：' + err)
              })
            this.spinShow = false
          }
        })
        .catch(err => {
          this.$Message.error('处理异常：' + err)
          this.loadingStatus = false
        })
      // setTimeout(() => {
      //     this.file = null;
      //     this.loadingStatus = false;
      //     this.$Message.success('Success')
      // }, 1500);
    },
    init(graphData) {
      var neo4jd3 = new Neo4jD3('#neo4jd3', {
        highlight: [
          {
            class: 'Project',
            property: 'name',
            value: 'neo4jd3'
          },
          {
            class: 'User',
            property: 'userId',
            value: 'eisman'
          }
        ],
        icons: {
          //                        'Address': 'home',
          Api: 'gear',
          //                        'BirthDate': 'birthday-cake',
          Cookie: 'paw',
          //                        'CreditCard': 'credit-card',
          //                        'Device': 'laptop',
          Email: 'at',
          Git: 'git',
          Github: 'github',
          Google: 'google',
          //                        'icons': 'font-awesome',
          Ip: 'map-marker',
          Issues: 'exclamation-circle',
          Language: 'language',
          Options: 'sliders',
          Password: 'lock',
          Phone: 'phone',
          Project: 'folder-open',
          SecurityChallengeAnswer: 'commenting',
          User: 'user',
          zoomFit: 'arrows-alt',
          zoomIn: 'search-plus',
          zoomOut: 'search-minus'
        },
        images: {
          Address: 'img/twemoji/1f3e0.svg',
          //                        'Api': 'img/twemoji/1f527.svg',
          BirthDate: 'img/twemoji/1f382.svg',
          Cookie: 'img/twemoji/1f36a.svg',
          CreditCard: 'img/twemoji/1f4b3.svg',
          Device: 'img/twemoji/1f4bb.svg',
          Email: 'img/twemoji/2709.svg',
          Git: 'img/twemoji/1f5c3.svg',
          Github: 'img/twemoji/1f5c4.svg',
          icons: 'img/twemoji/1f38f.svg',
          Ip: 'img/twemoji/1f4cd.svg',
          Issues: 'img/twemoji/1f4a9.svg',
          Language: 'img/twemoji/1f1f1-1f1f7.svg',
          Options: 'img/twemoji/2699.svg',
          Password: 'img/twemoji/1f511.svg',
          //                        'Phone': 'img/twemoji/1f4de.svg',
          Project: 'img/twemoji/2198.svg',
          'Project|name|neo4jd3': 'img/twemoji/2196.svg',
          //                        'SecurityChallengeAnswer': 'img/twemoji/1f4ac.svg',
          User: 'img/twemoji/1f600.svg'
          //                        'zoomFit': 'img/twemoji/2194.svg',
          //                        'zoomIn': 'img/twemoji/1f50d.svg',
          //                        'zoomOut': 'img/twemoji/1f50e.svg'
        },
        minCollision: 60,
        // neo4jDataUrl: 'json/neo4jData.json',
        neo4jData: graphData,
        neo4jDataUrl: neo4jDataUrl + this.req.relationship,
        nodeRadius: 25,
        onNodeDoubleClick: function (node) {
          // console.log("node" + JSON.stringify(node));
          switch (node.id) {
            case '25':
              // Google
              window.open(node.properties.url, '_blank')
              break
            default:
              var maxNodes = 5
              // var data = neo4jd3.randomD3Data(node, maxNodes);
              // neo4jd3.updateWithD3Data(data);
              break
          }
        },
        onRelationshipDoubleClick: function (relationship) {
          // console.log('double click on relationship: ' + JSON.stringify(relationship));
        },
        zoomFit: true
      })
    }
  },
  mounted() {
    getRelationshipList()
      .then(res => {
        this.relationshipList = res.data
      })
      .catch(err => {
        this.$Message.error('处理异常：' + err)
      })
    this.init()
    this.spinShow = false
  }
}
</script>

<style scoped>
body,
html,
.index {
  height: 100%;
  overflow: hidden;
}

.neo4jd3 {
  height: 98%;
  overflow: hidden;
}
</style>

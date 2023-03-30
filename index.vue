<template>
  <el-row class="main_content">
    <el-col>
      <template v-if="page && page.noticeComponentList">
        <component
          :is="item.component"
          v-for="item in page.noticeComponentList"
          :key="item.id"
          v-bind="item"
        />
      </template>
      <template v-if="page && page.headerComponentList">
        <component
          :is="item.component"
          v-for="item in page.headerComponentList"
          :key="item.id"
          v-bind="item"
        />
      </template>
    </el-col>
    <el-col class="main">
      <template v-if="page && page.mainComponentList">
        <component
          :is="item.component"
          v-for="item in page.mainComponentList"
          :key="item.id"
          v-bind="item"
        />
      </template>
    </el-col>
    <el-col class="footer">
      <template v-if="page && page.footerComponentList">
        <component
          :is="item.component"
          v-for="item in page.footerComponentList"
          :key="item.id"
          v-bind="item"
        />
      </template>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: 'IndexPage',
  // middleware: 'auth',
  auth: true,
  async asyncData ({ $auth, params, $request, error }) {
    const requestParams = {
      type: params.type || 'home',
      preview: params.preview || false,
      objectId: params.objectId || 0
    }
    return await $request.page.getPage(requestParams).then((res) => {
      const page = res.data
      return {
        page: page || {}
      }
    }).catch((err) => {
      const { data } = err
      error({ statusCode: data.code, message: data.msg })
    })
  },

  data () {
    return {
      page: {}
    }
  },

  head () {
    return {
      title: this.page.name || '首页',
      meta: [
        {
          hid: 'keywords',
          name: 'keywords',
          content: this.page.seoKeyWords
        },
        {
          hid: 'description',
          name: 'description',
          content: this.page.seoDescription
        }
      ]
    }
  },
  mounted () {

  }
}
</script>
<style lang="scss" scope>
.container {
  @include center;
}
</style>

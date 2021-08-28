<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="group" placeholder="组" clearable style="width: 300px" value-key="id" class="filter-item" @change="getObjecPermtList">
        <el-option v-for="item in group_list" :key="item.id" :label="item.name" :value="item" />
      </el-select>
      <el-select v-model="model" placeholder="模型" clearable style="width: 300px" value-key="id" class="filter-item" @change="getObjectList">
        <el-option v-for="item in model_list" :key="item.content_type.id" :label="item.title" :value="item" />
      </el-select>
      <el-input v-model="listQuery.inside_ip" :placeholder="placeholder" style="width: 400px;" class="filter-item" @keyup.enter.native="getObjectList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getObjectList">
        搜索
      </el-button>
    </div>
    <el-table :key="tableKey" :data="object_list" border fit highlight-current-row style="width:100%">
      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getObjectList" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getGroupName } from '@/api/authperm/group'
import { getL2MenuContentType } from '@/api/authperm/l2menu'
import { getHosts } from '@/api/project/host'
import waves from '@/directive/waves'

export default {
  name: 'GroupObjPerm',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 10,
      group: null,
      model: null,
      group_list: null,
      model_list: null,
      object_list: [],
      total: 0,
      placeholder: null,
      temp: {
        username: null,
        password: null,
        confirm_password: null,
        is_superuser: false,
        email: null,
        is_staff: false,
        date_joined: new Date(),
        groups: [],
        phone: null
      },
      listQuery: {
        page: 1,
        limit: 10,
        value: ''
      },
      dialogVisible: false,
      dialogStatus: null,
      textMap: {
        create: '新增',
        edit: '编辑'
      }
    }
  },
  created() {
    this.getGroupList()
  },
  methods: {
    getGroupList() {
      getGroupName().then(response => {
        this.group_list = response
        if (this.group_list.length > 0) {
          this.group = this.group_list[0]
          this.getModelList()
        }
      })
    },
    getModelList() {
      getL2MenuContentType().then(response => {
        this.model_list = response
        if (this.model_list.length > 0) {
          this.model = this.model_list[0]
          this.getObjectList()
        }
      })
    },
    getObjectList() {
      if (this.model.content_type.model === 'host') {
        this.placeholder = '主机内网 IP'
        var tempQueryList = { page: this.listQuery.page, limit: this.listQuery.limit, inside_ip: this.listQuery.value }
        getHosts(tempQueryList).then(response => {
          this.total = response.count
          this.object_list = response.results
          // for (var i = 0; i < response.results.length; i++) {
          //   this.object_list[i] = { id: response.results[i].id, name: response.results[i].inside_ip }
          // }
          console.log(this.object_list)
        })
      }
      // if (this.model.content_type.model === 'mysql') {
      //   this.placeholder = 'MySQL 地址'
      //   this.listQuery.inside_ip = this.listQuery.value
      //   getHosts(this.listQuery).then(response => {
      //     this.object_list = response
      //   })
      // }
      this.getObjecPermtList()
    },
    getObjecPermtList() {
      console.log(this.group)
      console.log(this.model)
    }
  }
}
</script>

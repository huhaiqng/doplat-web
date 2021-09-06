<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="group" placeholder="组" style="width: 300px" value-key="id" class="filter-item" @change="getObjectList">
        <el-option v-for="item in group_list" :key="item.id" :label="item.name" :value="item" />
      </el-select>
      <el-select v-model="model" placeholder="模型" style="width: 300px" value-key="id" class="filter-item" @change="getObjectList">
        <el-option v-for="item in model_list" :key="item.content_type.id" :label="item.title" :value="item" />
      </el-select>
      <el-input v-model="listQuery.value" :placeholder="placeholder" style="width: 400px;" class="filter-item" @keyup.enter.native="getObjectList" />
      <el-button v-waves class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="getObjectList">
        搜索
      </el-button>
    </div>
    <div style="background-color: white;padding-top:20px;padding-bottom:20px;padding-left:20px;">
      <el-row v-for="(r, i) in row_num" :key="i" :gutter="20">
        <el-col v-for="(o, j) in obj_num > (i+1)*num ? num : obj_num - i*num" :key="j" :span="12">
          <el-row>
            <el-col :span="8">
              <el-checkbox-group v-model="object_list[num*i + j].perms" style="margin-bottom:10px;">
                <el-checkbox v-for="perm in perm_list" :key="perm.codename" :label="perm.id" @change="checked=>updateObjectPerm(checked, object_list[num*i + j].id, object_list[num*i + j].perms_detail, perm.id)">
                  {{ permName(perm.codename) }}
                </el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col :span="16">
              <span>{{ object_list[num*i + j].name }}</span>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getObjectList" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getGroupName } from '@/api/authperm/group'
import { getL2MenuContentType } from '@/api/authperm/l2menu'
import { getHosts } from '@/api/project/host'
import { getMySQL } from '@/api/project/mysql'
import { getProjectPerm } from '@/api/project/project'
import { getMiddlewarePerm } from '@/api/project/middleware'
import { getPermissionList } from '@/api/authperm/permission'
import { getL2Menu } from '@/api/authperm/l2menu'
import { getProjectmodulePerm } from '@/api/project/module'
import { getConfig } from '@/api/project/config'
import { getAccounts } from '@/api/account'
import { getUrl } from '@/api/project/url'
import waves from '@/directive/waves'
import { addGroupObjectPerm, deleteGroupObjectPerm } from '@/api/authperm/group'

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
      perm_list: [],
      total: 0,
      placeholder: null,
      row_num: 0,
      obj_num: 0,
      num: 2,
      listQuery: {
        page: 1,
        limit: 40,
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
        this.placeholder = '内网 IP'
        var hostQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          inside_ip: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.id,
          with_perms: true
        }
        getHosts(hostQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'mysql') {
        this.placeholder = '内网地址'
        var mysqlQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          inside_addr: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id,
          with_perms: true
        }
        getMySQL(mysqlQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'middleware') {
        this.placeholder = '连接地址'
        var middlewareQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          conn_addr: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id
        }
        getMiddlewarePerm(middlewareQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'project') {
        this.placeholder = '名称'
        var projectQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          name: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id
        }
        getProjectPerm(projectQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'projectmodule') {
        this.placeholder = '项目名'
        var projectmoduleQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          name: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id
        }
        getProjectmodulePerm(projectmoduleQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'url') {
        this.placeholder = '项目名'
        var urlQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          name: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id,
          with_perms: true
        }
        getUrl(urlQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'config') {
        this.placeholder = '项目名'
        var configQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          name: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id,
          with_perms: true
        }
        getConfig(configQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'account') {
        this.placeholder = '名称'
        var accountQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          name: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id,
          with_perms: true
        }
        getAccounts(accountQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      if (this.model.content_type.model === 'l2menu') {
        this.placeholder = '名称'
        var l2menutQuery = {
          page: this.listQuery.page,
          limit: this.listQuery.limit,
          title: this.listQuery.value,
          group: this.group.id,
          content_type: this.model.content_type.id,
          with_perms: true
        }
        getL2Menu(l2menutQuery).then(response => {
          this.total = response.count
          this.object_list = response.results
          this.obj_num = this.object_list.length
          this.row_num = Math.ceil(this.obj_num / this.num)
        })
      }
      getPermissionList({ content_type: this.model.content_type.id }).then(response => {
        this.perm_list = response.filter(p => p.codename.indexOf('add_') === -1)
      })
    },
    updateObjectPerm(checked, object_pk, perms_detail, permission) {
      var object_perm_temp = { group: this.group.id, content_type: this.model.content_type.id, permission: permission, object_pk: object_pk }
      if (checked) {
        addGroupObjectPerm(object_perm_temp).then(() => {
          this.getObjectList()
        })
      } else {
        var group_perm_id = perms_detail.filter(gop => (gop.object_pk === object_pk.toString() && gop.permission === permission && gop.group === this.group.id)).map(rm => { return rm.id })
        deleteGroupObjectPerm(group_perm_id).then(() => {
          this.getObjectList()
        })
      }
    },
    permName(codename) {
      var permType = codename.split('_')[0]
      if (permType === 'add') {
        return '新增'
      } else if (permType === 'view') {
        return '查看'
      } else if (permType === 'change') {
        return '编辑'
      } else if (permType === 'delete') {
        return '删除'
      } else {
        return permType
      }
    }
  }
}
</script>

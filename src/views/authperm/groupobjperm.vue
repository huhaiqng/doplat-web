<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="group" placeholder="组" clearable style="width: 300px" value-key="id" class="filter-item" @change="getObjectList">
        <el-option v-for="item in group_list" :key="item.id" :label="item.name" :value="item" />
      </el-select>
      <el-select v-model="model" placeholder="模型" clearable style="width: 300px" value-key="id" class="filter-item" @change="getObjectList">
        <el-option v-for="item in model_list" :key="item.content_type.id" :label="item.title" :value="item" />
      </el-select>
      <el-input v-model="listQuery.value" :placeholder="placeholder" style="width: 400px;" class="filter-item" @keyup.enter.native="getObjectList" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="getObjectList">
        搜索
      </el-button>
    </div>
    <div style="background-color: white;padding-top: 20px;padding-bottom: 20px;">
      <div v-for="item in object_list" :key="item.id" style="margin-left:30px;margin-right:30px;background-color: white">
        <el-row style="margin-top:10px;">
          <el-col :span="3">
            <span>{{ item.inside_ip }}</span>
          </el-col>
          <el-col :span="12">
            <el-checkbox-group v-model="item.perms">
              <el-checkbox v-for="perm in perm_list" :key="perm.codename" :label="perm.id" @change="checked=>updateObjectPerm(checked, item.id, item.perms_detail, perm.id)">
                {{ permName(perm.codename) }}
              </el-checkbox>
            </el-checkbox-group>
          </el-col>
        </el-row>
      </div>
    </div>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getObjectList" />
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getGroupName } from '@/api/authperm/group'
import { getL2MenuContentType } from '@/api/authperm/l2menu'
import { getHostsPerm } from '@/api/project/host'
import { getPermissionList } from '@/api/authperm/permission'
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
      obj_perm_list: [],
      group_obj_perm_list: [],
      obj_pk_list: [],
      placeholder: null,
      listQuery: {
        page: 1,
        limit: 20,
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
        var tempQueryList = { page: this.listQuery.page, limit: this.listQuery.limit, inside_ip: this.listQuery.value, group: this.group.id, content_type: this.model.id }
        getHostsPerm(tempQueryList).then(response => {
          this.total = response.count
          this.object_list = response.results
        })
        getPermissionList({ content_type: this.model.id }).then(response => {
          this.perm_list = response
        })
      }
    },
    updateObjectPerm(checked, object_pk, perms_detail, permission) {
      var object_perm_temp = { group: this.group.id, content_type: this.model.id, permission: permission, object_pk: object_pk.toString() }
      if (checked) {
        addGroupObjectPerm(object_perm_temp).then(() => {
          this.getObjectList()
        })
      } else {
        console.log(perms_detail)
        var group_perm_id = perms_detail.filter(gop => (gop.object_pk === object_pk.toString() && gop.permission === permission && gop.group === this.group.id)).map(rm => { return rm.id })
        console.log(group_perm_id)
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

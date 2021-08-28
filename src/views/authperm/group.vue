<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="tableKey" :data="list" border fit highlight-current-row style="width:100%;">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (listQuery.page - 1)*listQuery.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组名">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户">
        <template slot-scope="{row}">
          <span v-for="(u, i) in row.user_set" :key="u.id">{{ i === 0?u.username:", " + u.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteData(row, $index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-left:30px;margin-right:30px">
        <el-form-item label="组名" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
      </el-form>
      <el-tabs v-show="dialogStatus === 'edit'" v-model="activeName" tab-position="top" type="border-card">
        <el-tab-pane label="设置菜单权限" name="first">
          <div class="tab-pane">
            <el-scrollbar>
              <el-tree ref="tree" :data="menus" show-checkbox node-key="id" default-expand-all :props="defaultProps" :default-checked-keys="groupL2menu" @check-change="menueCheckChange" />
            </el-scrollbar>
          </div>
        </el-tab-pane>
        <el-tab-pane label="设置全局权限" name="second">
          <div class="tab-pane">
            <el-scrollbar>
              <div v-for="item in contenttype_list" :key="item.title" style="margin-left:30px;margin-right:30px">
                <el-row style="margin-top:10px;">
                  <el-col :span="3">
                    <span>{{ item.title }}</span>
                  </el-col>
                  <el-col :span="21">
                    <el-checkbox-group v-model="temp.permissions">
                      <el-checkbox v-for="perm in item.perms" :key="perm.id" :label="perm.id">
                        {{ permName(perm.codename) }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </div>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create'?createData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { getGroup, addGroup, updateGroup, deleteGroup, getGroupL2menu, setGroupObjectPerms } from '@/api/authperm/group'
import { getL1Menu } from '@/api/authperm/l1menu'
import { getL2MenuContentType } from '@/api/authperm/l2menu'
import { getPermissionList } from '@/api/authperm/permission'

export default {
  name: 'Group',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      temp: {
        name: null,
        permissions: []
      },
      listQuery: {
        page: 1,
        limit: 10
      },
      // 一级菜单，包含了二级子菜单
      menus: [],
      // 组有权限的二级菜单
      groupL2menu: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      modelMenu: [],
      dialogVisible: false,
      dialogStatus: null,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      activeName: 'first',
      permission_list: [],
      contenttype_list: [],
      // 有 conttenttype 的二级菜单
      l2wct_list: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      getGroup(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      this.dialogStatus = 'create'
    },
    createData() {
      addGroup(this.temp).then(() => {
        this.dialogVisible = false
        this.getList()
        // this.setObjectPerms()
        this.$notify({
          title: '成功',
          message: '用户组新增成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleUpdate(row) {
      this.activeName = 'first'
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      getL1Menu().then(response => {
        this.menus = response
        for (var i = 0; i < this.menus.length; i++) {
          this.menus[i].id = 'l1' + this.menus[i].id
        }
      })
      // 查询组的已有权限的二级菜单
      getGroupL2menu({ groupname: this.temp.name }).then(response => {
        this.groupL2menu = response
      })
      // 查询需要设置全局权限的 contenttype
      getL2MenuContentType().then(response => {
        this.l2wct_list = response
        // 查询 contenttype 权限
        getPermissionList().then(response => {
          this.permission_list = response
          for (var i = 0; i < this.l2wct_list.length; i++) {
            this.contenttype_list[i] = {}
            this.contenttype_list[i].id = this.l2wct_list[i].content_type.id
            this.contenttype_list[i].title = this.l2wct_list[i].title
            this.contenttype_list[i].perms = this.permission_list.filter(p => (p.content_type === this.l2wct_list[i].content_type.id))
            for (var x = 0; x < this.contenttype_list[i].perms.length; x++) {
              this.contenttype_list[i].perms[x].checked = false
              for (var y = 0; y < row.permissions.length; y++) {
                if (this.contenttype_list[i].perms[x].id === row.permissions[y].id) {
                  this.contenttype_list[i].perms[x].checked = true
                }
              }
            }
            this.temp.permissions = row.permissions.map(mgp => { return mgp.id })
          }
        })
      })
    },
    updateData() {
      updateGroup(this.temp).then(() => {
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    deleteData(row, index) {
      this.$confirm(`确认删除组: ${row.name} ?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    },
    resetTemp() {
      this.temp = {
        name: null,
        permissions: []
      }
      this.activeName = 'first'
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
    },
    menueCheckChange(menu, isCheck) {
      if (!menu.children) {
        if (isCheck) {
          // 68 为 view_l2menu 的 ID
          menu.perms = [68]
        } else {
          menu.perms = []
        }
        // 更新菜单权限
        var checkedL2Menus = []
        checkedL2Menus.push(menu)
        var menuData = { groupname: this.temp.name, model: 'l2menu', objects: checkedL2Menus }
        setGroupObjectPerms(menuData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-pane{
  flex: 1;
  /deep/.el-scrollbar{
    height: calc(100vh - 600px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
}
</style>

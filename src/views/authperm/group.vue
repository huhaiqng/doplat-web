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
          <el-button type="danger" size="mini" @click="deleteData(row.id,$index)">删除</el-button>
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
      <el-tabs v-if="dialogStatus === 'edit'" v-model="activeName" tab-position="top" type="border-card" style="margin-left:30px;margin-right:30px">
        <el-tab-pane label="设置菜单权限" name="first">
          <div class="tab-pane">
            <el-scrollbar>
              <el-tree ref="tree" :data="menus" show-checkbox node-key="id" default-expand-all :props="defaultProps" :default-checked-keys="groupL2menu" @check-change="checkChange" />
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
      contentType: [],
      allContentType: [],
      labelMap: {
        host: 'ip'
      },
      permTemp: {
        model: '',
        selectedObjectsId: [],
        permissions: []
      },
      objects: [],
      selectedObjects: [],
      selectedObjectsWithPerms: [],
      objectPermOptions: [],
      checkedModels: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCreate() {
      this.dialogVisible = true
      this.resetTemp()
      this.dialogStatus = 'create'
    },
    handleUpdate(row) {
      this.checkedModels = []
      this.permTemp.model = null
      this.selectedObjects = []
      this.selectedObjectsWithPerms = []
      this.activeName = 'first'
      this.temp = Object.assign({}, row)
      this.dialogVisible = true
      this.dialogStatus = 'edit'
      this.contentType = []
      var data = { groupname: this.temp.name }
      // 查询一级菜单，一级菜单自带二级子菜单
      getL1Menu().then(response => {
        this.menus = response
        for (var i = 0; i < this.menus.length; i++) {
          this.menus[i].id = 'l1' + this.menus[i].id
        }
      })
      // 查询已有权限的二级菜单
      getGroupL2menu(data).then(response => {
        this.groupL2menu = response
      })
    },
    getList() {
      getGroup(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
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
    updateData() {
      updateGroup(this.temp).then(() => {
        this.dialogVisible = false
        // this.setObjectPerms()
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.getList()
      })
    },
    deleteData(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGroup(id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    resetTemp() {
      this.temp = {
        name: null,
        permissions: []
      }
      this.permTemp.model = null
      this.selectedObjects = []
      this.selectedObjectsWithPerms = []
      this.activeName = 'first'
    },
    checkChange(menu, isCheck) {
      if (!menu.children) {
        if (isCheck) {
          menu.perms = [104]
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

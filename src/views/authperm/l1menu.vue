<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="名称" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-if="permStatus.add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="序号" align="center" width="60px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (listQuery.page - 1)*listQuery.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="显示名称">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="URI">
        <template slot-scope="{row}">
          <span>{{ row.path }}</span>
        </template>
      </el-table-column>
      <el-table-column label="定向">
        <template slot-scope="{row}">
          <span>{{ row.redirect }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="{row}">
          <span>{{ row.icon }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="{row}">
          <span>{{ row.order }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二级菜单" width="200px">
        <template slot-scope="{row}">
          <span v-for="c in row.children" :key="c.id">
            <div>{{ c.title }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-dropdown type="primary">
            <el-button size="mini" split-buttion type="primary">操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="permStatus.change" @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="permStatus.delete" @click.native="handleDelete(row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" style="width:60%" />
        </el-form-item>
        <el-form-item label="显示名称" prop="title">
          <el-input v-model="temp.title" style="width:60%" />
        </el-form-item>
        <el-form-item label="URI" prop="path">
          <el-input v-model="temp.path" style="width:60%" />
        </el-form-item>
        <el-form-item label="定向" prop="redirect">
          <el-input v-model="temp.redirect" style="width:60%" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-input v-model="temp.icon" style="width:60%" />
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input v-model="temp.order" style="width:60%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getL1Menu, addL1Menu, updateL1Menu, deleteL1Menu } from '@/api/authperm/l1menu'
import Pagination from '@/components/Pagination'
import store from '@/store'
import waves from '@/directive/waves'

export default {
  name: 'L1menu',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      dialogStatus: '',
      dialogVisible: false,
      listQuery: {
        page: 1,
        limit: 10,
        title: ''
      },
      temp: {
        name: undefined,
        title: undefined,
        path: undefined,
        redirect: undefined,
        order: undefined,
        children: undefined
      },
      textMap: {
        update: '编辑',
        create: '添加'
      },
      permStatus: {
        add: false,
        change: false,
        delete: false
      },
      is_superuser: false,
      my_perms: []
    }
  },
  created() {
    this.getPermStstus()
    this.getList()
  },
  methods: {
    getList() {
      getL1Menu(this.listQuery).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    getPermStstus() {
      this.is_superuser = store.getters.is_superuser
      this.my_perms = store.getters.my_perms
      if (this.is_superuser) {
        this.permStatus.add = true
        this.permStatus.change = true
        this.permStatus.delete = true
      }
      if (this.my_perms.indexOf('add_l1menu') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_l1menu') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_l1menu') > -1) {
        this.permStatus.delete = true
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: undefined,
        title: undefined,
        path: undefined,
        redirect: undefined,
        order: undefined,
        children: undefined
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addL1Menu(this.temp).then(() => {
            this.getList()
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '主机新增成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateL1Menu(this.temp).then(() => {
            this.getList()
            this.dialogVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功！',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row) {
      this.$confirm(`确认删除一级菜单：${row.title}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteL1Menu(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功！',
            type: 'success',
            duration: 2000
          })
          this.getList()
        })
      })
    }
  }
}
</script>

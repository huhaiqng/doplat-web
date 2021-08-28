<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryList.project" placeholder="项目" filterable clearable class="filter-item" style="width: 400px" @change="getList">
        <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-if="permStatus.add" class="filter-item" icon="el-icon-edit" type="primary" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="0" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (queryList.page - 1)*queryList.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" width="300px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址">
        <template slot-scope="{row}">
          <span class="link-type"><el-link type="primary" :underline="false" :href="row.url" target="_blank">{{ row.url }}</el-link></span>
        </template>
      </el-table-column>
      <el-table-column label="环境" width="200">
        <template slot-scope="{row}">
          <span>{{ row.env.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="常用的" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag size="small" :type="row.popular?'success':'info'">
            {{ row.popular?"是":"否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="80px" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-dropdown type="primary">
            <el-button size="mini" split-buttion type="primary">操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="permStatus.change" @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="permStatus.delete" @click.native="handleDelete(row.id)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="queryList.page" :limit.sync="queryList.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-form-item label="项目" prop="project">
          <el-select v-model="temp.project" class="filter-item" filterable style="width:40%">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="环境" prop="env">
          <el-select v-model="temp.env" class="filter-item" style="width:40%">
            <el-option v-for="item in envList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称" prop="cluster">
          <el-input v-model="temp.name" style="width:40%" />
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="temp.url" style="width:80%" />
        </el-form-item>
        <el-form-item label="常用的" prop="popular">
          <el-checkbox v-model="temp.popular" />
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
import { addUrl, deleteUrl, updateUrl, getUrl } from '@/api/project/url'
import { getProjectName } from '@/api/project/project'
import { getEnv } from '@/api/project/env'
import Pagination from '@/components/Pagination'
import store from '@/store'

export default {
  name: 'Url',
  components: { Pagination },
  data() {
    return {
      list: null,
      projectList: [],
      envList: [],
      total: 0,
      temp: {
        project: null,
        name: null,
        env: null,
        url: null,
        popular: false
      },
      queryList: {
        project: '',
        page: 0,
        limit: 10
      },
      dialogStatus: 'create',
      dialogVisible: false,
      textMap: {
        create: '新增',
        edit: '编辑'
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
    this.getList()
    getProjectName().then(response => {
      this.projectList = response
    })
    getEnv().then(response => {
      this.envList = response
    })
    this.getPermStstus()
  },
  methods: {
    getList() {
      getUrl(this.queryList).then(response => {
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
      if (this.my_perms.indexOf('add_url') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_url') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_url') > -1) {
        this.permStatus.delete = true
      }
    },
    restTemp() {
      this.temp = {
        project: null,
        name: null,
        env: null,
        url: null,
        popular: false
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.restTemp()
    },
    createData() {
      addUrl(this.temp).then(response => {
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '新增成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUrl(id).then(() => {
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.project = this.temp.project.id
      this.temp.env = this.temp.env.id
      this.dialogStatus = 'edit'
      this.dialogVisible = true
    },
    updateData() {
      updateUrl(this.temp).then(() => {
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
  }
}
</script>

<style lang="scss" scoped>
.tab-pane{
  flex: 1;
  /deep/.el-scrollbar{
    height: calc(100vh - 400px);
    .el-scrollbar__wrap{
      overflow-x: hidden;
    }
  }
  border-style: solid;
  border-radius: 3px;
  border-width:1px;
}
.conf-text{
  padding: 15px;
}
</style>

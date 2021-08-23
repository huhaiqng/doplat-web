<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.conn_addr" placeholder="连接地址" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.type" placeholder="类别" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in type_options" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.env" placeholder="环境" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in env_list" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="permStatus.add" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="middleware_list"
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
      <el-table-column label="连接地址">
        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row)">{{ row.conn_addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Web 地址">
        <template slot-scope="{row}">
          <span class="link-type"><el-link type="primary" :underline="false" :href="row.web_addr" target="_blank">{{ row.web_addr }}</el-link></span>
        </template>
      </el-table-column>
      <el-table-column label="类别" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="集群" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.cluster }}</span>
        </template>
      </el-table-column>
      <el-table-column label="环境" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.env.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" width="150px">
        <template slot-scope="{row}">
          <span v-for="p in row.project" :key="p.id">
            <div>{{ p.name }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="100px" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}">
          <el-dropdown type="primary">
            <el-button size="mini" split-buttion type="primary">操作<i class="el-icon-arrow-down el-icon--right" /></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-if="permStatus.change" @click.native="handleUpdate(row)">编辑</el-dropdown-item>
              <el-dropdown-item v-if="permStatus.delete" @click.native="handleDelete(row.id, $index)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="60%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="类别" prop="type">
              <el-select v-model="temp.type" class="filter-item">
                <el-option v-for="item in type_options" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境" prop="env">
              <el-select v-model="temp.env" class="filter-item">
                <el-option v-for="item in env_list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="project">
              <el-select v-model="temp.project" class="filter-item" multiple style="width:80%">
                <el-option v-for="item in project_list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="集群" prop="cluster">
              <el-input v-model="temp.cluster" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="temp.username" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="连接地址" prop="conn_addr">
              <el-input v-model="temp.conn_addr" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="Web 地址" prop="web_addr">
              <el-input v-model="temp.web_addr" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-drawer title="详情" :visible.sync="drawerVisible" :with-header="false">
      <middleware-drawer :instance="tempDetail" />
    </el-drawer>
  </div>
</template>

<script>
import { getMiddlewareList, addMiddleware, updateMiddleware, deleteMiddleware } from '@/api/project/middleware'
import { getEnv } from '@/api/project/env'
import { getProjectForConfig } from '@/api/project/index'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import { encrypt, decrypt } from '@/utils/aes'
import { getIsSuperuser, getMyPerms } from '@/utils/auth'
import MiddlewareDrawer from '@/components/Drawer/middleware'

export default {
  name: 'Middleware',
  components: { Pagination, MiddlewareDrawer },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      middleware_list: null,
      env_list: null,
      project_list: null,
      total: 0,
      listQuery: {
        conn_ip: '',
        type: '',
        env: '',
        page: 1,
        limit: 10
      },
      type_options: ['redis', 'activemq', 'rabbitmq', 'zookeeper'],
      temp: {
        conn_addr: '',
        web_addr: undefined,
        username: undefined,
        password: undefined,
        type: '',
        project: '',
        env: undefined,
        cluster: '单节点'
      },
      tempCopy: undefined,
      tempDetail: undefined,
      dialogVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加',
        detail: '详情'
      },
      permStatus: {
        add: false,
        change: false,
        delete: false
      },
      drawerVisible: false,
      is_superuser: false,
      my_perms: []
    }
  },
  created() {
    this.getPermStstus()
    this.getList()

    getEnv().then(response => {
      this.env_list = response
    })
    getProjectForConfig().then(response => {
      this.project_list = response
    })
  },
  methods: {
    getList() {
      getMiddlewareList(this.listQuery).then(response => {
        this.middleware_list = response.results
        this.total = response.count
      })
    },
    getPermStstus() {
      this.is_superuser = getIsSuperuser()
      this.my_perms = getMyPerms()
      if (this.is_superuser === 'true') {
        this.permStatus.add = true
        this.permStatus.change = true
        this.permStatus.delete = true
      }
      if (this.my_perms.indexOf('add_host') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_host') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_host') > -1) {
        this.permStatus.delete = true
      }
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        conn_addr: undefined,
        web_addr: undefined,
        username: undefined,
        password: undefined,
        type: undefined,
        project: undefined,
        env: undefined,
        cluster: '单节点'
      }
      this.passwordType = 'password'
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogVisible = true
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.tempCopy = Object.assign({}, this.temp)
          this.tempCopy.password = encrypt(this.tempCopy.password)
          addMiddleware(this.tempCopy).then(() => {
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
      this.temp.project = row.project.map(s => { return s.id })
      this.temp.env = row.env.id
      this.temp.password = decrypt(this.temp.password)
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.tempCopy = Object.assign({}, this.temp)
          this.tempCopy.password = encrypt(this.tempCopy.password)
          updateMiddleware(this.tempCopy).then(() => {
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
    handleDelete(id, index) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMiddleware(id).then(() => {
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
    showDetail(row) {
      this.tempDetail = Object.assign({}, row)
      this.tempDetail.password = decrypt(this.tempDetail.password)
      this.drawerVisible = true
    }
  }
}
</script>

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="queryList.inside_addr" placeholder="内网地址" style="width:200px" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="queryList.env" placeholder="环境" clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in env_list" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="queryList.project" placeholder="项目" filterable clearable class="filter-item" style="width: 200px">
        <el-option v-for="item in project_list" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-button class="filter-item" size="medium" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-if="permStatus.add" size="medium" class="filter-item" icon="el-icon-edit" type="primary" @click="handleCreate">
        新增
      </el-button>
    </div>
    <el-table :key="0" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (queryList.page - 1)*queryList.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="内网地址">
        <template slot-scope="{row}">
          <span class="link-type" @click="showDetail(row)">{{ row.inside_addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="外网地址">
        <template slot-scope="{row}">
          <span>{{ row.outside_addr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数据库路径">
        <template slot-scope="{row}">
          <span>{{ row.data_dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="版本号" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目">
        <template slot-scope="{row}">
          <span v-for="p in row.project" :key="p.id">
            <div>{{ p.name }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="环境" width="150px">
        <template slot-scope="{row}">
          <span v-if="row.env">{{ row.env.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{ row.cluster }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.created | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogVisible" width="60%">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="margin-right:30px; margin-left:30px;">
        <el-row>
          <el-col :span="12">
            <el-form-item label="内网地址" prop="inside_addr">
              <el-input v-model="temp.inside_addr" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外网地址" prop="outside_addr">
              <el-input v-model="temp.outside_addr" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="角色" prop="role">
              <el-select v-model="temp.role" style="width:60%">
                <el-option value="master">master</el-option>
                <el-option value="slave">slave</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据库路径" prop="data_dir">
              <el-input v-model="temp.data_dir" style="width:60%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理员" prop="manger">
              <el-input v-model="temp.manager" style="width:60%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="temp.password" style="width:60%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署方式" prop="method">
              <el-select v-model="temp.method" class="filter-item" style="width:60%">
                <el-option value="normal">normal</el-option>
                <el-option value="docker">docker</el-option>
                <el-option value="docker-compose">docker-compose</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="版本号" prop="version">
              <el-input v-model="temp.version" style="width:60%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="来源" prop="origin">
              <el-select v-model="temp.origin" class="filter-item" style="width:60%">
                <el-option value="自建">自建</el-option>
                <el-option value="阿里云">阿里云</el-option>
                <el-option value="华为云">华为云</el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注" prop="cluster">
              <el-input v-model="temp.cluster" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目" prop="project">
              <el-select v-model="temp.project" class="filter-item" filterable clearable multiple style="width:80%">
                <el-option v-for="item in project_list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="环境" prop="env">
              <el-select v-model="temp.env" class="filter-item" style="width:80%">
                <el-option v-for="item in env_list" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogVisible = false">
          取消
        </el-button>
        <el-button size="medium" type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
    <el-drawer title="详情" :visible.sync="drawerVisible" :with-header="false">
      <mysql-drawer :instance="instance" />
    </el-drawer>
  </div>
</template>

<script>
import { addMySQL, deleteMySQL, updateMySQL, getMySQL } from '@/api/project/mysql'
import Pagination from '@/components/Pagination'
import MysqlDrawer from '@/components/Drawer/mysql'
import { getProjectName } from '@/api/project/project'
import { getEnv } from '@/api/project/env'
import { encrypt, decrypt } from '@/utils/aes'
import store from '@/store'

export default {
  name: 'MySQL',
  components: { Pagination, MysqlDrawer },
  data() {
    return {
      list: null,
      project_list: null,
      env_list: null,
      total: 0,
      temp: {
        inside_addr: undefined,
        outside_addr: undefined,
        role: 'master',
        data_dir: '/var/lib/mysql',
        version: '5.7',
        manager: 'root',
        password: undefined,
        method: 'normal',
        origin: '自建',
        cluster: undefined,
        project: '',
        env: '',
        created: new Date()
      },
      tempCopy: undefined,
      queryList: {
        inside_addr: '',
        project: '',
        env: '',
        page: 0,
        limit: 10
      },
      dialogStatus: 'create',
      dialogVisible: false,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      drawerVisible: false,
      instance: undefined,
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
    this.getPermStstus()

    getEnv().then(response => {
      this.env_list = response
    })
    getProjectName().then(response => {
      this.project_list = response
    })
  },
  methods: {
    getList() {
      getMySQL(this.queryList).then(response => {
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
      if (this.my_perms.indexOf('add_mysql') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_mysql') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_mysql') > -1) {
        this.permStatus.delete = true
      }
    },
    restTemp() {
      this.temp = {
        inside_addr: undefined,
        outside_addr: undefined,
        role: 'master',
        data_dir: '/var/lib/mysql',
        version: '5.7',
        manager: 'root',
        password: undefined,
        method: 'normal',
        origin: '自建',
        cluster: undefined,
        project: '',
        env: '',
        created: new Date()
      }
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogVisible = true
      this.restTemp()
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.temp.project = row.project.map(s => { return s.id })
      if (this.temp.env) {
        this.temp.env = row.env.id
      }
      this.temp.password = decrypt(this.temp.password)
      this.dialogStatus = 'edit'
      this.dialogVisible = true
    },
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteMySQL(id).then(() => {
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
    createData() {
      this.tempCopy = Object.assign({}, this.temp)
      this.tempCopy.password = encrypt(this.tempCopy.password)
      addMySQL(this.tempCopy).then(response => {
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
    updateData() {
      this.tempCopy = Object.assign({}, this.temp)
      this.tempCopy.password = encrypt(this.tempCopy.password)
      updateMySQL(this.tempCopy).then(() => {
        this.getList()
        this.dialogVisible = false
        this.$notify({
          title: '成功',
          message: '更新成功！',
          type: 'success',
          duration: 2000
        })
      })
    },
    handleFilter() {
      this.queryList.page = 1
      this.getList()
    },
    showDetail(row) {
      this.instance = Object.assign({}, row)
      this.instance.password = decrypt(this.instance.password)
      this.drawerVisible = true
    }
  }
}
</script>

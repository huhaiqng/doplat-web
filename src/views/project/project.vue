<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="名称" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-if="permStatus.add" size="medium" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      :data="project_list"
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
      <el-table-column label="名称" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="简称" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理用户" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.user }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部署路径">
        <template slot-scope="{row}">
          <span>{{ row.deploy_dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志路径">
        <template slot-scope="{row}">
          <span>{{ row.log_dir }}</span>
        </template>
      </el-table-column>
      <el-table-column label="主机" width="200px">
        <template slot-scope="{row}">
          <span v-for="h in row.hosts" :key="h.id">
            <div>{{ h.env }} - {{ h.inside_ip }}</div>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="使用中" width="80px" align="center">
        <template slot-scope="{row}">
          <el-tag size="small" :type="row.used?'success':'info'">
            {{ row.used?"是":"否" }}
          </el-tag>
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
            <el-form-item label="名称" prop="name">
              <el-input v-model="temp.name" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="简称" prop="alias">
              <el-input v-model="temp.alias" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="主机" prop="hosts">
              <el-select v-model="temp.hosts" class="filter-item" filterable clearable multiple style="width:80%">
                <el-option v-for="item in host_list" :key="item.id" :label="item.inside_ip" :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="管理用户" prop="user">
              <el-input v-model="temp.user" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部署路径" prop="deploy_dir">
              <el-input v-model="temp.deploy_dir" style="width:80%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日志路径" prop="log_dir">
              <el-input v-model="temp.log_dir" style="width:80%" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item label="使用中" prop="used">
              <el-checkbox v-model="temp.used" />
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
  </div>
</template>

<script>
import { getProjectList, addProject, updateProject, deleteProject } from '@/api/project/project'
import { getHostsSimple } from '@/api/project/host'
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import store from '@/store'

export default {
  name: 'Project',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      project_list: null,
      host_list: null,
      total: 0,
      listQuery: {
        name: '',
        page: 1,
        limit: 10
      },
      temp: {
        name: '',
        alias: undefined,
        hosts: undefined,
        deploy_dir: '/data',
        user: 'www',
        log_dir: '/data/log',
        used: true
      },
      tempCopy: undefined,
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
      is_superuser: false,
      my_perms: []
    }
  },
  created() {
    this.getPermStstus()
    this.getList()

    getHostsSimple().then(response => {
      this.host_list = response
    })
  },
  methods: {
    getList() {
      getProjectList(this.listQuery).then(response => {
        this.project_list = response.results
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
      if (this.my_perms.indexOf('add_project') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_project') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_project') > -1) {
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
        name: '',
        alias: undefined,
        hosts: undefined,
        deploy_dir: '/data',
        user: 'www',
        log_dir: '/data/log',
        used: true
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
          addProject(this.temp).then(() => {
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
      this.temp.hosts = row.hosts.map(s => { return s.id })
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateProject(this.temp).then(() => {
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
        deleteProject(id).then(() => {
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
    }
  }
}
</script>

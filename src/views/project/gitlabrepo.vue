<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="queryList.project" placeholder="项目" filterable clearable class="filter-item" @change="getList">
        <el-option v-for="item in projectList" :key="item.name" :label="item.name" :value="item.id" />
      </el-select>
      <el-input v-model="queryList.path_with_namespace" placeholder="路径" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" size="medium" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button v-if="permStatus.add" size="medium" class="filter-item" :loading="btnLoading" type="primary" @click="createGitlabRepo">同步仓库</el-button>
    </div>
    <el-table :key="0" :data="list" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" align="center" width="50px">
        <template slot-scope="{$index}">
          <span>{{ $index + 1 + (queryList.page - 1)*queryList.limit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目">
        <template slot-scope="{row}">
          <span v-if="row.project">{{ row.project.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="路径">
        <template slot-scope="{row}">
          <span>{{ row.path_with_namespace }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" width="500px">
        <template slot-scope="{row}">
          <span class="link-type"><el-link type="primary" :underline="false" :href="row.http_url_to_repo" target="_blank">{{ row.http_url_to_repo }}</el-link></span>
        </template>
      </el-table-column>
      <el-table-column label="备注" width="300pxsc">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.created_at | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
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
          <el-select v-model="temp.project" class="filter-item" filterable clearable="" style="width:40%">
            <el-option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="路径" prop="cluster">
          <el-input v-model="temp.path_with_namespace" style="width:40%" />
        </el-form-item>
        <el-form-item label="地址" prop="url">
          <el-input v-model="temp.http_url_to_repo" style="width:80%" />
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="temp.description" style="width:80%" />
        </el-form-item>
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
import { getProjectName } from '@/api/project/project'
import { getGitlabRepo, addGitlabRepo, updateGitlabRepo, deleteGitlabRepo } from '@/api/project/gitlabrepo'
import { getGitLabProjects } from '@/api/project/gitlab'
import Pagination from '@/components/Pagination'
import store from '@/store'
import waves from '@/directive/waves'

export default {
  name: 'GitlabRepo',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      gitlabrepo_list: [],
      projectList: [],
      total: 0,
      total_page: 0,
      temp: {
        project: null,
        path_with_namespace: null,
        http_url_to_repo: null,
        description: null,
        created_at: null,
        last_activity_at: null
      },
      queryList: {
        path_with_namespace: '',
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
      my_perms: [],
      btnLoading: false
    }
  },
  created() {
    this.getList()
    getProjectName().then(response => {
      this.projectList = response
    })
    this.getPermStstus()
  },
  methods: {
    getList() {
      getGitlabRepo(this.queryList).then(response => {
        this.list = response.results
        this.total = response.count
      })
    },
    handleFilter() {
      this.queryList.page = 1
      getGitlabRepo(this.queryList).then(response => {
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
      if (this.my_perms.indexOf('add_gitlabrepo') > -1) {
        this.permStatus.add = true
      }
      if (this.my_perms.indexOf('change_gitlabrepo') > -1) {
        this.permStatus.change = true
      }
      if (this.my_perms.indexOf('delete_gitlabrepo') > -1) {
        this.permStatus.delete = true
      }
    },
    restTemp() {
      this.temp = {
        project: null,
        path_with_namespace: null,
        http_url_to_repo: null,
        description: null,
        created_at: null,
        last_activity_at: null
      }
    },
    createGitlabRepo() {
      getGitLabProjects({ per_page: 100, page: 1 }).then(response => {
        this.btnLoading = true
        this.total_page = parseInt(response.headers['x-total-pages'])
        for (var i = 0; i < this.total_page; i++) {
          getGitLabProjects({ per_page: 100, page: i + 1 }).then(response => {
            this.gitlabrepo_list = response.data
            addGitlabRepo(this.gitlabrepo_list).then(() => {
              this.btnLoading = false
              this.getList()
              this.$notify({
                title: '成功',
                message: '同步完成！',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.btnLoading = false
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      if (this.temp.project) {
        this.temp.project = row.project.id
      }
      if (this.temp.env) {
        this.temp.env = row.env.id
      }
      this.dialogStatus = 'update'
      this.dialogVisible = true
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateGitlabRepo(this.temp).then(() => {
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
    handleDelete(id) {
      this.$confirm('确认删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGitlabRepo(id).then(() => {
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

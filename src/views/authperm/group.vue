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
        <el-tab-pane label="全局权限" name="first">
          <div class="tab-pane">
            <el-scrollbar>
              <div v-for="item in l2wct_list" :key="item.title" style="margin-left:30px;margin-right:30px">
                <el-row style="margin-top:10px;">
                  <el-col :span="6">
                    <span>{{ item.title }} - {{ item.content_type.model }}</span>
                  </el-col>
                  <el-col :span="18">
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
import { getGroup, addGroup, updateGroup, deleteGroup } from '@/api/authperm/group'
import { getL2MenuContentType } from '@/api/authperm/l2menu'

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
      dialogVisible: false,
      dialogStatus: null,
      textMap: {
        create: '新增',
        edit: '编辑'
      },
      activeName: 'first',
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
      getL2MenuContentType().then(response => {
        this.l2wct_list = response
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

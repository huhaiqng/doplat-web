<template>
  <div>
    <el-scrollbar class="elsc">
      <div class="drawer-container">
        <div>
          <h3 class="drawer-title">详情</h3>
          <div class="drawer-item">
            <el-row>
              <el-col :span="8">连接地址：</el-col>
              <el-col :span="16">{{ instance.conn_addr }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">Web 地址：</el-col>
              <el-col :span="16">{{ instance.web_addr }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">用户名：</el-col>
              <el-col :span="16">{{ instance.username }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">密码：</el-col>
              <el-col :span="16">{{ instance.password }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">类别：</el-col>
              <el-col :span="16">{{ instance.type }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">项目：</el-col>
              <el-col :span="16">
                <span v-for="p in instance.project" :key="p.id">
                  <div>{{ p.name }}</div>
                </span>
              </el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">环境：</el-col>
              <el-col :span="16">{{ instance.env.name }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">集群：</el-col>
              <el-col :span="16">{{ instance.cluster }}</el-col>
            </el-row>
          </div>

          <div class="drawer-item">
            <el-row>
              <el-col :span="8">创建时间：</el-col>
              <el-col :span="16">{{ instance.created | parseTime('{y}-{m}-{d} {h}:{m}') }}</el-col>
            </el-row>
          </div>

        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  name: 'MiddlewareDrawer',
  props: {
    instance: { type: Object, default: null }
  }
}
</script>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.show-pwd {
  position: absolute;
  right: 41%;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}
.drawer-container {
  padding: 60px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }
}
/deep/.elsc{
  height: 100vh;
  .el-scrollbar__wrap{
    overflow-x: hidden;
  }
}
</style>

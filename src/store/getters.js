const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  permission_add_routes: state => state.permission.addRoutes,
  my_perms: state => state.permission.my_perms,
  is_superuser: state => state.permission.is_superuser
}
export default getters

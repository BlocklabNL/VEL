var routes = [
  require('/burn'),
  require('/device_info'),
  require('/register_device'),
  require('/standard_login')
  require('/update')
  require('/uport_login')
]

// Add access to the app and db objects to each route
module.exports = function routes(app, db) {
  return routes.forEach((route) => {
    route(app, db);
  })
}

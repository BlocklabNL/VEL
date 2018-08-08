var routes = [
  require('/standard_login'),
  require('/uport_login')
]

// Add access to the app and db objects to each route
module.exports = function routes(app, db) {
  return routes.forEach((route) => {
    route(app, db);
  })
}

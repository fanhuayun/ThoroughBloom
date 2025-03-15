import { request } from '../request';


export function fetchGetConstantRoutes() {
  // return request<Api.Route.MenuRoute[]>({ url: '/route/getConstantRoutes' });
  return request({
    url: 'iotapi/constantroutes',
    method: 'get',
  });
}
/** get constant routes */
// export function fetchGetConstantRoutes() {
//   return request<Api.Route.MenuRoute[]>({ url: '/route/getConstantRoutes' });
// }

/** get user routes */
export function fetchGetUserRoutes() {
  return request<Api.Route.UserRoute>({ url: '/route/getUserRoutes' });
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
export function fetchIsRouteExist(routeName: string) {
  return request<boolean>({ url: '/route/isRouteExist', params: { routeName } });
}

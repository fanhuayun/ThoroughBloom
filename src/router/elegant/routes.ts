/* eslint-disable */
/* prettier-ignore */
// Generated by elegant-router
// Read more: https://github.com/soybeanjs/elegant-router

import type { GeneratedRoute } from '@elegant-router/types';

export const generatedRoutes: GeneratedRoute[] = [
  {
    name: '403',
    path: '/403',
    component: 'layout.blank$view.403',
    meta: {
      title: '403',
      i18nKey: 'route.403',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '404',
    path: '/404',
    component: 'layout.blank$view.404',
    meta: {
      title: '404',
      i18nKey: 'route.404',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: '500',
    path: '/500',
    component: 'layout.blank$view.500',
    meta: {
      title: '500',
      i18nKey: 'route.500',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'about',
    path: '/about',
    component: 'layout.base$view.about',
    meta: {
      title: 'about',
      i18nKey: 'route.about',
      icon: 'fluent:book-information-24-regular',
      order: 10,
      hideInMenu: true
    }
  },
  {
    name: 'carouselmanage',
    path: '/carouselmanage',
    component: 'layout.base$view.carouselmanage',
    meta: {
      title: 'carouselmanage',
      i18nKey: 'route.carouselmanage'
    }
  },
  {
    name: 'devicemanagement',
    path: '/devicemanagement',
    component: 'layout.base',
    meta: {
      title: 'devicemanagement',
      i18nKey: 'route.devicemanagement'
    },
    children: [
      {
        name: 'devicemanagement_devicechannel',
        path: '/devicemanagement/devicechannel',
        component: 'view.devicemanagement_devicechannel',
        meta: {
          title: 'devicemanagement_devicechannel',
          i18nKey: 'route.devicemanagement_devicechannel'
        }
      },
      {
        name: 'devicemanagement_devicedata',
        path: '/devicemanagement/devicedata',
        component: 'view.devicemanagement_devicedata',
        meta: {
          title: 'devicemanagement_devicedata',
          i18nKey: 'route.devicemanagement_devicedata'
        }
      },
      {
        name: 'devicemanagement_devicehistorydata',
        path: '/devicemanagement/devicehistorydata/:equipId',
        component: 'view.devicemanagement_devicehistorydata',
        meta: {
          title: 'devicemanagement_devicehistorydata',
          i18nKey: 'route.devicemanagement_devicehistorydata'
        }
      },
      {
        name: 'devicemanagement_devicemanage',
        path: '/devicemanagement/devicemanage',
        component: 'view.devicemanagement_devicemanage',
        meta: {
          title: 'devicemanagement_devicemanage',
          i18nKey: 'route.devicemanagement_devicemanage'
        }
      },
      {
        name: 'devicemanagement_devicetopo',
        path: '/devicemanagement/devicetopo',
        component: 'view.devicemanagement_devicetopo',
        meta: {
          title: 'devicemanagement_devicetopo',
          i18nKey: 'route.devicemanagement_devicetopo'
        }
      },
      {
        name: 'devicemanagement_devicetype',
        path: '/devicemanagement/devicetype',
        component: 'view.devicemanagement_devicetype',
        meta: {
          title: 'devicemanagement_devicetype',
          i18nKey: 'route.devicemanagement_devicetype'
        }
      },
      {
        name: 'devicemanagement_devicetypehistorydata',
        path: '/devicemanagement/devicetypehistorydata/:equipId',
        component: 'view.devicemanagement_devicetypehistorydata',
        meta: {
          title: 'devicemanagement_devicetypehistorydata',
          i18nKey: 'route.devicemanagement_devicetypehistorydata'
        }
      }
    ]
  },
  {
    name: 'function',
    path: '/function',
    component: 'layout.base',
    meta: {
      title: 'function',
      i18nKey: 'route.function',
      icon: 'icon-park-outline:all-application',
      order: 6,
      hideInMenu: true
    },
    children: [
      {
        name: 'function_hide-child',
        path: '/function/hide-child',
        meta: {
          title: 'function_hide-child',
          i18nKey: 'route.function_hide-child',
          icon: 'material-symbols:filter-list-off',
          order: 2
        },
        redirect: '/function/hide-child/one',
        children: [
          {
            name: 'function_hide-child_one',
            path: '/function/hide-child/one',
            component: 'view.function_hide-child_one',
            meta: {
              title: 'function_hide-child_one',
              i18nKey: 'route.function_hide-child_one',
              icon: 'material-symbols:filter-list-off',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_three',
            path: '/function/hide-child/three',
            component: 'view.function_hide-child_three',
            meta: {
              title: 'function_hide-child_three',
              i18nKey: 'route.function_hide-child_three',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          },
          {
            name: 'function_hide-child_two',
            path: '/function/hide-child/two',
            component: 'view.function_hide-child_two',
            meta: {
              title: 'function_hide-child_two',
              i18nKey: 'route.function_hide-child_two',
              hideInMenu: true,
              activeMenu: 'function_hide-child'
            }
          }
        ]
      },
      {
        name: 'function_multi-tab',
        path: '/function/multi-tab',
        component: 'view.function_multi-tab',
        meta: {
          title: 'function_multi-tab',
          i18nKey: 'route.function_multi-tab',
          icon: 'ic:round-tab',
          multiTab: true,
          hideInMenu: true,
          activeMenu: 'function_tab'
        }
      },
      {
        name: 'function_request',
        path: '/function/request',
        component: 'view.function_request',
        meta: {
          title: 'function_request',
          i18nKey: 'route.function_request',
          icon: 'carbon:network-overlay',
          order: 3
        }
      },
      {
        name: 'function_super-page',
        path: '/function/super-page',
        component: 'view.function_super-page',
        meta: {
          title: 'function_super-page',
          i18nKey: 'route.function_super-page',
          icon: 'ic:round-supervisor-account',
          order: 5,
          roles: ['R_SUPER']
        }
      },
      {
        name: 'function_tab',
        path: '/function/tab',
        component: 'view.function_tab',
        meta: {
          title: 'function_tab',
          i18nKey: 'route.function_tab',
          icon: 'ic:round-tab',
          order: 1
        }
      },
      {
        name: 'function_toggle-auth',
        path: '/function/toggle-auth',
        component: 'view.function_toggle-auth',
        meta: {
          title: 'function_toggle-auth',
          i18nKey: 'route.function_toggle-auth',
          icon: 'ic:round-construction',
          order: 4
        }
      }
    ]
  },
  {
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: 'home',
      i18nKey: 'route.home'
    }
  },
  {
    name: 'iframe-page',
    path: '/iframe-page/:url',
    component: 'layout.base$view.iframe-page',
    props: true,
    meta: {
      title: 'iframe-page',
      i18nKey: 'route.iframe-page',
      constant: true,
      hideInMenu: true,
      keepAlive: true
    }
  },
  {
    name: 'login',
    path: '/login/:module(pwd-login|code-login|register|reset-pwd|bind-wechat)?',
    component: 'layout.blank$view.login',
    props: true,
    meta: {
      title: 'login',
      i18nKey: 'route.login',
      constant: true,
      hideInMenu: true
    }
  },
  {
    name: 'manage',
    path: '/manage',
    component: 'layout.base',
    meta: {
      title: 'manage',
      i18nKey: 'route.manage'
    },
    children: [
      {
        name: 'manage_menu',
        path: '/manage/menu',
        component: 'view.manage_menu',
        meta: {
          title: 'manage_menu',
          i18nKey: 'route.manage_menu'
        }
      },
      {
        name: 'manage_role',
        path: '/manage/role',
        component: 'view.manage_role',
        meta: {
          title: 'manage_role',
          i18nKey: 'route.manage_role'
        }
      },
      {
        name: 'manage_user',
        path: '/manage/user',
        component: 'view.manage_user',
        meta: {
          title: 'manage_user',
          i18nKey: 'route.manage_user'
        }
      }
    ]
  },
  {
    name: 'questionmanage',
    path: '/questionmanage',
    component: 'layout.base$view.questionmanage',
    meta: {
      title: 'questionmanage',
      i18nKey: 'route.questionmanage'
    }
  },
  {
    name: 'resourceallocation',
    path: '/resourceallocation',
    component: 'layout.base$view.resourceallocation',
    meta: {
      title: 'resourceallocation',
      i18nKey: 'route.resourceallocation'
    }
  },
  {
    name: 'tools',
    path: '/tools',
    component: 'layout.base',
    meta: {
      hideInMenu: true,
      title: 'tools',
      i18nKey: 'route.tools'
    },
    children: [
      {
        name: 'tools_erorrqusetiondata',
        path: '/tools/erorrqusetiondata',
        component: 'view.tools_erorrqusetiondata',
        meta: {
          title: 'tools_erorrqusetiondata',
          i18nKey: 'route.tools_erorrqusetiondata'
        }
      },
      {
        name: 'tools_log',
        path: '/tools/log',
        component: 'view.tools_log',
        meta: {
          title: 'tools_log',
          i18nKey: 'route.tools_log'
        }
      },
      {
        name: 'tools_questinfo',
        path: '/tools/questinfo',
        component: 'view.tools_questinfo',
        meta: {
          title: 'tools_questinfo',
          i18nKey: 'route.tools_questinfo'
        }
      },
      {
        name: 'tools_topo',
        path: '/tools/topo',
        component: 'view.tools_topo',
        meta: {
          title: 'tools_topo',
          i18nKey: 'route.tools_topo'
        }
      }
    ]
  },
  {
    name: 'user-center',
    path: '/user-center',
    component: 'layout.base$view.user-center',
    meta: {
      title: 'user-center',
      i18nKey: 'route.user-center'
    }
  }
];

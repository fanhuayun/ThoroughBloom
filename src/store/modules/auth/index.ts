import { computed, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import { defineStore } from 'pinia';
import { useLoading } from '@sa/hooks';
import { SetupStoreId } from '@/enum';
import { useRouterPush } from '@/hooks/common/router';
import {gettoken, fetchLogin, fetchGetinstitution} from '@/service/api';
import { localStg } from '@/utils/storage';
import { $t } from '@/locales';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { clearAuthStorage, getToken } from './shared';

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
  const route = useRoute();
  const routeStore = useRouteStore();
  const tabStore = useTabStore();
  const { toLogin, redirectFromLogin } = useRouterPush(false);
  const { loading: loginLoading, startLoading, endLoading } = useLoading();

  const token = ref(getToken());

  const userInfo: Api.Auth.UserInfo = reactive({
    userId: '',
    title: '',
    userName: '',
    roles: [],
    buttons: []
  });

  /** is super role in static route */
  const isStaticSuper = computed(() => {
    const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env;
    console.log('VITE_STATIC_SUPER_ROLE',VITE_STATIC_SUPER_ROLE)
    console.log('VITE_AUTH_ROUTE_MODE',VITE_AUTH_ROUTE_MODE)
    console.log('roles.includes',userInfo.roles.includes(VITE_STATIC_SUPER_ROLE))
    console.log('userInfo',userInfo)


    return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE);
  });

  /** Is login */
  const isLogin = computed(() => Boolean(token.value));

  /** Reset auth store */
  async function resetStore() {
    const authStore = useAuthStore();

    clearAuthStorage();

    authStore.$reset();

    if (!route.meta.constant) {
      await toLogin();
    }

    tabStore.cacheTabs();
    routeStore.resetStore();
  }

  /**
   * Login
   *
   * @param userName User name
   * @param password Password
   * @param [redirect=true] Whether to redirect after login. Default is `true`
   */
  async function login(userName: string, password: string, redirect = true) {
    startLoading();

    const { data, error } = await fetchLogin(userName, password);
    if (!error){
      const { sessionToken, name, tag, objectId, roles, nick,phone } = data

      if (tag.userinfo && tag.userinfo.parse_deviceid) {
        localStg.set('parse_deviceid', tag.userinfo.parse_deviceid)
      } else {
        localStg.remove('parse_deviceid')
      }
      localStg.set('avatar', tag.userinfo.avatar)
      localStg.set('title', tag.companyinfo.title)
      localStg.set('name', name)
      localStg.set('nick', nick)
      localStg.set('phone', phone)
      localStg.set('userobjectId', objectId)
      localStg.set('roles', roles)
      localStg.set('deptId', roles[0].objectId)
      localStg.set('rolename', roles[0].name)
      localStg.set('sessionToken', sessionToken)
      localStg.set('token', sessionToken)
      if (!error) {
        const pass = await loginByToken(roles[0].name);
        if (pass) {
          await routeStore.initAuthRoute();
          if (redirect) {
            await redirectFromLogin();
          }
          if (routeStore.isInitAuthRoute) {
            window.$notification?.success({
              title: $t('page.login.common.loginSuccess'),
              content: $t('page.login.common.welcomeBack', { userName: userInfo.userName }),
              duration: 4500
            });
          }
        }
      } else {
        resetStore();
      }
      endLoading();
    }else {
      window.$message?.error("密码错误")
      resetStore()
      endLoading();
    }

    // let {sessionToken,tag,nick,objectId} =data

  }

  async function loginByToken(name:string) {
    // 1. stored in the localStorage, the later requests need it in headers
    // localStg.set('token', loginToken.token);
    // localStg.set('refreshToken', loginToken.refreshToken);

    // 2. get user info
    const pass = await getUserInfo(name);

    if (pass) {
      // token.value = loginToken.token;

      return true;
    }

    return false;
  }

  async function getUserInfo(name:string) {
    const { data, error } = await gettoken( localStg.get('deptId'));

    console.log('title',localStg.get('title'))
      // update store
      const info= {
        "userId": localStg.get('userobjectId'),
        "userName":  localStg.get('title'),
        "title":  localStg.get('title'),
        "roles": [
          "R_SUPER"
        ],
        "buttons": [
          "B_CODE1",
          "B_CODE2",
          "B_CODE3"
        ]
      }

      Object.assign(userInfo, info);

      return true;

  }

  async function initUserInfo() {
    const hasToken = getToken();
    const rolename=localStg.get('rolename')
    if (hasToken) {
      const pass = await getUserInfo(rolename);

      if (!pass) {
        resetStore();
      }
    }
  }

  return {
    token,

    userInfo,
    isStaticSuper,
    isLogin,
    loginLoading,
    resetStore,
    login,
    //gin,
    // initUserInfo
  };
});

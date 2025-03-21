/**
 * Create service config by current env
 *
 * @param env The current env
 */
export function createServiceConfig(env: Env.ImportMeta) {
  const { VITE_SERVICE_BASE_URL = '/', VITE_OTHER_SERVICE_BASE_URL } = env;

  let other = {} as Record<App.Service.OtherBaseURLKey, string>;
  try {
    other = JSON.parse(VITE_OTHER_SERVICE_BASE_URL);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid JSON string');
  }

  const httpConfig: App.Service.SimpleServiceConfig = {
    baseURL: VITE_SERVICE_BASE_URL,
    other
  };

  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    return {
      key,
      baseURL: httpConfig.other[key],
      proxyPattern: createProxyPattern(key)
    };
  });

  const config: App.Service.ServiceConfig = {
    baseURL: httpConfig.baseURL,
    proxyPattern: createProxyPattern(),
    other: otherConfig
  };

  return config;
}

/**
 * get backend service base url
 *
 * @param env - the current env
 * @param isProxy - if use proxy
 */
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  const { baseURL, other } = createServiceConfig(env);

  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  other.forEach(item => {
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
  });

  return {
    // baseURL: isProxy ? createProxyPattern() : baseURL,

    baseURL: isProxy ?   '/' : baseURL,
    otherBaseURL
  };
}

/**
 * Get proxy pattern of backend service base url
 *
 * @param key If not set, will use the default key
 */
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  console.log("key",key)
  if (!key) {
    return '/proxy-default';
    // return '/';
  }

  return `/proxy-${key}`;
  // return `/`;
}

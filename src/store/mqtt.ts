import * as mqtt from "mqtt/dist/mqtt.min.js";
// import  mqtt from "mqtt/dist/mqtt.min.js";
import bus from '@/utils/bus'
import { reactive, ref, onMounted, onUnmounted, nextTick } from "vue";
function useMqtt(options: any) {
  const data = ref();
  const connection = reactive({
    // ws or wss
    protocol: options.protocol,
    host: options.host,
    // ws -> 8083; wss -> 8084
    port: options.port,
    clientId: options.clientId,
    username: options.username,
    password: options.password,
    clean: options.clean,
    connectTimeout: options.connectTimeout, // ms
    reconnectPeriod: options.reconnectPeriod // ms
  });
  // //订阅信息设置
  // const subscription = ref({
  //   topic: options.subscription.topic, //需要动态配置
  //   qos: options.subscription.qos as mqtt.QoS
  // });
  let client = ref({
    connected: false
  } as mqtt.MqttClient);
  const receivedMessages = ref("");
  const subscribedSuccess = ref(false);
  const btnLoadingType = ref("");
  const retryTimes = ref(0);
  // const data = ref(); //接收的数据值
  // //初始化
  const initData = () => {
    client.value = {
      connected: false
    } as mqtt.MqttClient;
    retryTimes.value = 0;
    btnLoadingType.value = "";
    subscribedSuccess.value = false;
  };
  const handleOnReConnect = () => {
    retryTimes.value += 1;
    if (retryTimes.value > 5) {
      try {
        client.value.end();
        initData();
        console.log("connection maxReconnectTimes limit, stop retry");
      } catch (error) {
        console.log("handleOnReConnect catch error:", error);
      }
    }
  };
  // // 创建连接
  const createConnection = () => {
    try {
      btnLoadingType.value = "connect";
      const { protocol, host, port, ...options } = connection;
      const connectUrl = `${protocol}://${host}:${port}/mqtt`;
      console.log('connectUrl',connectUrl)
      client.value = mqtt.connect(connectUrl, options);

      if (client.value.on) {
        client.value.on("connect", () => {
          btnLoadingType.value = "";
          console.log("connection successful");
        });
        client.value.on("reconnect", handleOnReConnect);
        client.value.on("error", (error: any) => {
          console.log("connection error:", error);
        });
        client.value.on("message", (topic: string, message: any) => {


          const uint8Array: Uint8Array = new Uint8Array(message);
          const numberArray: number[] = Array.from(uint8Array);

          message = String.fromCharCode.apply(null, numberArray);


          console.log('topic',topic)
          const sendtopic = topic.split('/')

          let sendTopic:any = `/${sendtopic[sendtopic.length - 3]}/${
              sendtopic[sendtopic.length - 2]
          }/${sendtopic[sendtopic.length - 1]}`

          if (topic.indexOf('$dg/user/devicestate') >= 0) {
            sendTopic = '$dg/user/devicestate'
            message=JSON.parse(decodeURIComponent(escape(atob(message))));
          } else if (topic.indexOf('$dg/user/realtimecard') >= 0) {
            sendTopic = `$dg/user/realtimecard/${
                sendtopic[sendtopic.length - 2]
            }`
            message=JSON.parse(decodeURIComponent(escape(atob(message))));
            // console.log("实时数据", sendTopic);
          } else if (topic.indexOf('$dg/user/channel/') >= 0) {
            sendTopic = `$dg/user/channel/${
                sendtopic[3]
            }`
          } else if (topic.indexOf('$dg/user/konva') >= 0) {
            sendTopic = '$dg/user/konva'
            message=JSON.parse(decodeURIComponent(escape(atob(message))));
          } else if (topic.indexOf('allrealdata') >= 0) {
            sendTopic = '$dg/user/allrealdata'
            message=JSON.parse(decodeURIComponent(escape(atob(message))));
          } else if (topic.indexOf('realdata') >= 0) {
            sendTopic = '$dg/user/realdata'
            message=JSON.parse(decodeURIComponent(escape(atob(message))));
          }
          // eventBus
          // new Vue().$emit('message',e)
          bus.emit(sendTopic, message);
        });
      }
    } catch (error) {
      btnLoadingType.value = "";
      console.log("mqtt.connect error:", error);
    }
  };
  //订阅消息
  // const doSubscribe = () => {
  //   btnLoadingType.value = "subscribe";
  //   const { topic, qos } = subscription.value;
  //   client.value.subscribe(topic, { qos }, (error: Error, granted: mqtt.ISubscriptionGrant[]) => {
  //     btnLoadingType.value = "";
  //     if (error) {
  //       console.log("subscribe error:", error);
  //       return;
  //     }
  //     subscribedSuccess.value = true;
  //     console.log("subscribe successfully:", granted);
  //   });
  // };
  //关闭连接
  const destroyConnection = () => {
    if (client.value.connected) {
      btnLoadingType.value = "disconnect";
      try {
        client.value.end(false, () => {
          initData();
          console.log("disconnected successfully");
        });
      } catch (error) {
        btnLoadingType.value = "";
        console.log("disconnect error:", error);
      }
    }
  };
  onMounted(() => {
    nextTick(() => {
      createConnection();
      // doSubscribe();
    });
  });
  // //组件销毁前断开连接
  onUnmounted(() => {
    console.log("页面销毁前断开连接------");
    destroyConnection();
  });
  return { data, connection };
}

export default useMqtt;

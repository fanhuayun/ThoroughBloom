import mitt from 'mitt'

type Events = {
  sendMsg: string
  sendNum: object
}

const bus = mitt<Events>()
export default bus

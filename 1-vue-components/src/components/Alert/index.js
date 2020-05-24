import create from '@/helper/create'
import Alert from './Alert.vue'

export default function alertPop (...args) {
  return create(Alert, ...args)
}

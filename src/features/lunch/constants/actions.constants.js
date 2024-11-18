
export const LUNCH_CALLBACKS = {
  RESPONSE_SIMPLE_LUNCH: 'response_simple_lunch',
}

export const SIMPLE_LUNCH_BUTTONS = {
  CONFIRM: 'confirm',
  RETRY: 'retry',
  CANCEL: 'cancel'
}

export const SIMPLE_LUNCH_ACTION = {
  callbackId: LUNCH_CALLBACKS.RESPONSE_SIMPLE_LUNCH,
  actions: [
    {
      type: 'button',
      text: '좋아요 😊',
      name: 'confirm-btn',
      value: SIMPLE_LUNCH_BUTTONS.CONFIRM,
      style: 'primary'
    },
    {
      type: 'button',
      text: '맘에 안 들어요 😡',
      name: 'retry-btn',
      value: SIMPLE_LUNCH_BUTTONS.RETRY,
      style: 'default'
    },
    {
      type: 'button',
      text: '취소 할래요 🫠',
      value: SIMPLE_LUNCH_BUTTONS.CANCEL,
      style: 'default'
    }
  ]
}

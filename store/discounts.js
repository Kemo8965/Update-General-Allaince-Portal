export const state = () => ({
  all: [
    {
      value: {
        discountType: 'No Claims Discount',
      },
      text: 'No Claims Discount',
    },
    {
      value: {
        discountType: 'Loyalty Discount',
      },
      text: 'Loyalty Discount',
    },
    {
      value: {
        discountType: 'Valued Client Discount',
      },
      text: 'Valued Client Discount',
    },
    {
      value: {
        discountType: 'Low Term Agreement Discount',
      },
      text: 'Low Term Agreement Discount',
    },
  ],
})

export const getters = {
  discounts(state) {
    return state.all
  },
}

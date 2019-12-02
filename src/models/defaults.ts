export const defaults = {
  _id: {
    type: String,
    required: true
  },
  createdAt: {
    type: Number,
    default: Date.now()
  },
  updatedAt: {
    type: Number,
    default: Date.now()
  }
}
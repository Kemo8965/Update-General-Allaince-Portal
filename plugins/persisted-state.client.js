import createPersistedState from 'vuex-persistedstate'

export default ({ store }) => {
  createPersistedState({
    key: 'insportal',
    paths: [
      'policies',
      'quotations',
      'auth',
      'classes',
      'external-services',
      'users',
    ],
  })(store)
}

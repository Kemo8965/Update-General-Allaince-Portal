export default function ({ app, store, redirect }) {
  const token = app.$cookies.get('token')

  // If user is authenticated
  if (store.state.auth.currentUser || token) {
    return redirect('/')
  }
}

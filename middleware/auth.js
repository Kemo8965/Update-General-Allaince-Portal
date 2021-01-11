export default function ({ app, store, redirect }) {
  const token = app.$cookies.get('token')

  // If the user is not authenticated
  if (!store.state.auth.currentUser || !token) {
    return redirect('/auth/login')
  }
}

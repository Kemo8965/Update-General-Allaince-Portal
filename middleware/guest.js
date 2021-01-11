export default function ({ store, redirect }) {
  // If user is authenticated
  if (store.state.auth.currentUser) {
    return redirect('/')
  }
}

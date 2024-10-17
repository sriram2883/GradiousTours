function protectedroute({ route }) {
  if (JSON.parse(localStorage.getItem("user")).usertype == "user") {
    return <Navigate to={"/login"} />;
  }
  return route;
}
export default protectedroute
export default function authHeader() {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.verificationToken) {
      return { Authorization: 'Bearer ' + user.verificationToken };
      // return { "x-auth-token" : user.accessToken}
    } else {
      return {};
    }
  }
import io from 'socket.io-client';

const apiHost = process.env.REACT_APP_API_HOST  || 'http://localhost:3001';

class Socket {
  constructor() {
    this.users = null;
  }
  connect(fn) {
    if (this.users == null) {
      this.users = io(`${apiHost}/users`);
      this.users.on('connect', () => {
        console.log("Socket connected: ", this.users.id);
        fn(this.users);
      })
      this.users.on('error', () => {
        fn(null);
      })
    } else {
      fn(this.users);
      window.io = this.users;
    }
  }
  
  reconnect(fn) {
    if (this.users) {
      this.users.on("reconnect", () => {
        fn(this.users);
      })
    }
}
}

const instance = new Socket();

export default instance;
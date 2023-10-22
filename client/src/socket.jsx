import io from "socket.io-client";

const SocketIO = io.connect("http://localhost:5001");

export default SocketIO;

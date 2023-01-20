import {server} from './app/HttpServer'
import './app/WebSocketServer'


server.listen(process.env.PORT, () => {
    console.log(`⚡️[server]: Server is running at port ${process.env.PORT}`);
});
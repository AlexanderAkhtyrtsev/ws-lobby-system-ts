import {app} from './app/HttpServer'
import './app/WebSocketServer'

app.listen(process.env.PORT, () => {
    console.log(`⚡️[server]: Server is running at port ${process.env.PORT}`);
});
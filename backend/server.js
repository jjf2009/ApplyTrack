require('dotenv').config();
const app=("./app");
const {connectDB,disconnectDB} = require('./config/db');

const Port = process.env.PORT || 5000;

const start= async () => {
    await connectDB();
    const server = app.listen(Port,()=>{
        console.log(`Server is running on port ${Port}`);
    })

    const  shutdown = async (signal) => {
        console.log(`Received ${signal}, shutting down gracefully...`);
        server.close(async()=>{
            console.log('Server closed');
            disconnectDB();
            process.exit(0);
    })
}

process.on('SIGTERM',()=>shutdown('SIGTERM'));
process.on('SIGINT',()=>shutdown('SIGINT'));


  process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    server.close(() => process.exit(1));
  });
}


start();
import mongoose from "mongoose";
import config from "config";
import log from './logger';

async function connect(){
    const dbURI =config.get<string>("DBURI");
    
    try {
        await mongoose
        .connect(dbURI)
        log.info('Connected to DB!');
    } catch (error) {
        log.error(error);
        process.exit(1); 
    }
   
    
}


export default connect;
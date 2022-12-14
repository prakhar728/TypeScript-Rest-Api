import {Request,Response} from 'express';
import config from "config";
import { createSession, findSession, updateSession } from '../service/session.service';
import { validatePassword } from '../service/user.service';
import { signJwt } from '../utils/jwt.utils';
export async function createUserSessionHandler(req:Request,res:Response){

    //Validate the user's password
    const user = await validatePassword(req.body);

    if(!user){
        return res.status(401).send("Invalid email or password");
    }
    //create a session
    const session = await createSession(user._id,req.get("user-agent")|| "");
    //create an access token
    const accessToken = signJwt({
        ...user,session:session.user },
    {expiresIn:config.get<string>("accessTokenTtl")}
    );
    //create a refresh token

    const refreshToken = signJwt({
        ...user,session:session.user },
    {expiresIn:config.get<string>("accessTokenTtl")}
    );


    //return access & refresh tokens
    res.locals.user=user;
    
    res.send({accessToken,refreshToken});
}

export async function getUserSessionsHandler(req:Request,res:Response) {
    const userId = res.locals.user._id;

    const sessions = await findSession({user:userId,valid:true});

    return res.send(sessions);
}

export async function deleteUserSession(req:Request,res:Response){
    const sessionId= res.locals.user.session;
    console.log(sessionId,"and",res.locals.user);
    
    await updateSession({user:sessionId},{valid:false});
    return res.send({
        accessToken:null,
        refreshToken:null
    })
}
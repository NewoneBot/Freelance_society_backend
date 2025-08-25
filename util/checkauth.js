import jwt from 'jsonwebtoken'
import { GraphQLError } from 'graphql'
import dotenv from 'dotenv'
dotenv.config();

const checkauth = async (authHeader) => {
     if (authHeader){
        const token = authHeader.split('Bearer ')[1]
        if(token){
            try{
                const user = await jwt.verify(token, process.env.SECRET_KEY);
                return user;
            }
            catch(err){
                throw new GraphQLError('Login expired, please login again');
            }
        }else{
            throw new GraphQLError("Athentication must be \'Bearer [token]'");
        }
     }
     throw new GraphQLError("Authorization header must be provided");
}

export default checkauth;
import { MikroORM } from '@mikro-orm/core'
import 'reflect-metadata';
import microConfig from './mikro-orm.config';
import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from "type-graphql";
import {HelloResolver} from "./resolvers/helloResolver";
import {PostResolver} from "./resolvers/postResolver";
import {UserResolver} from "./resolvers/userResolver";

import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import {__prod__} from "./constats";

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    // const post = orm.em.create(Post, {title: 'my first post'});
    // await orm.em.persistAndFlush(post);

    const app = express()

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
        session({
            name: 'qid',
            store: new RedisStore({
                client: redisClient,
                disableTouch: true,
            }),
            cookie: {
                maxAge: 1000 * 60 * 24 * 365 * 1, //1 year
                httpOnly: true,
                sameSite: 'lax', //csrf
                secure: __prod__, //https
            },
            saveUninitialized: false,
            secret: 'keyboard cat',
            resave: false
        })
    );

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver, UserResolver],
            validate: false,
        }),
        context: ({req, res}) => ({ em: orm.em, req, res })
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4000, () => {
        console.log('server started on localhost:4000')
    })
}

main().catch(err => {
    console.error(err);
});


/**
 * This file contains all npm/ 3rd party dependencies
 */
import express, { Express, Request, Response } from "express";
import cors from "cors";

import dotenv from "dotenv";

import { Seeder } from "mongo-seeding";

import path from "path";

import {
    MongoClient, ObjectId,

    //types
    MongoClientOptions, Db, Filter, Document, CollationOptions, Sort, ClientSession,
    InsertOneOptions, UpdateOptions, UpdateResult, BulkWriteOptions, InsertManyResult
} from "mongodb";

import * as yup from "yup";

import {
    merge,
    isEqual,
    has, isArray,
    set
} from "lodash";

import {
    Client as RedisOmClient,
    Entity as RedisEntity,
    Schema as RedisSchema
} from "redis-om";

import {
    createClient as nodeRedisCreateClient,
    //types
    RedisClientType, RedisModules, RedisFunctions, RedisScripts
} from "redis";


import crypto from "crypto";

const lodashGroup = {
    merge,
    isEqual,
    has, isArray,
    set
};

type CstNodeRedisClient = RedisClientType<unknown & RedisModules, RedisFunctions, RedisScripts>

type CstObjectIdType = ObjectId | string | number;


export {
    express,
    cors,
    dotenv,
    MongoClient, ObjectId,
    lodashGroup,
    Seeder,
    path,
    yup,
    RedisOmClient, RedisEntity, RedisSchema,
    nodeRedisCreateClient,
    crypto
};

export type {
    //mongodb
    MongoClientOptions, Db, Filter, Document, CollationOptions, Sort, ClientSession,
    InsertOneOptions, UpdateOptions, UpdateResult, BulkWriteOptions, InsertManyResult,

    //express
    Express, Request, Response,

    CstNodeRedisClient,

    //custom
    CstObjectIdType
};
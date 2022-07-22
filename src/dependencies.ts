import express, { Express, Request, Response } from "express";

import dotenv from "dotenv";


import {
    MongoClient, ObjectId,

    //types
    MongoClientOptions, Db, Filter, Document, CollationOptions, Sort, ClientSession,
    InsertOneOptions, UpdateOptions, UpdateResult, BulkWriteOptions, InsertManyResult
} from "mongodb";


type CstObjectIdType = ObjectId | string | number;


export {
    express,
    dotenv,
    MongoClient, ObjectId,
};

export type {
    //mongodb
    MongoClientOptions, Db, Filter, Document, CollationOptions, Sort, ClientSession,
    InsertOneOptions, UpdateOptions, UpdateResult, BulkWriteOptions, InsertManyResult,

    //express
    Express, Request, Response,

    //custom
    CstObjectIdType
};
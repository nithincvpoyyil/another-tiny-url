
const MONGO_DEV_USER = process.env.MONGO_DEV_USER;
const MONGO_DEV_PASSWORD = process.env.MONGO_DEV_PASSWORD;
const MONGO_INITDB_DATABASE = process.env.MONGO_INITDB_DATABASE;

if (!MONGO_DEV_USER || !MONGO_DEV_PASSWORD || !MONGO_INITDB_DATABASE) {
    throw new Error('Environment variables MONGO_DEV_USER, MONGO_DEV_PASSWORD, and MONGO_INITDB_DATABASE must be set.');
}

db = db.getSiblingDB(MONGO_INITDB_DATABASE);


db.createUser({
    user: MONGO_DEV_USER,
    pwd: MONGO_DEV_PASSWORD,
    roles: [{ role: 'readWrite', db: MONGO_INITDB_DATABASE }],
});

db.createCollection('tinyurls', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['url', 'shortUrl'],
            properties: {
                url: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                shortUrl: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                },
                createdAt: {
                    bsonType: 'date',
                    description: 'must be a date and is required',
                },
            },
        },
    },
});

db.tinyurls.createIndex({ shortUrl: 1 }, { unique: true });

db.tinyurls.createIndex({ createdAt: 1 }, { expireAfterSeconds: 2592000 }); // 30 days
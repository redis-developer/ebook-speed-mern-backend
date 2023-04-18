# Gears Recipe for a single write through

# import redis gears & mongo db libs
from rgsync import RGJSONWriteBehind, RGJSONWriteThrough
from rgsync.Connectors import MongoConnector, MongoConnection

# change mongodb connection
# MongoConnection(user, password, host, authSource (optional), fullConnectionUrl (optional) )
# connection = MongoConnection('ADMIN_USER','ADMIN_PASSWORD','ADMIN_HOST', "admin")
connection = MongoConnection("", "", "", "", "MONGODB_CONNECTION_URL")

# change MongoDB database
db = 'dbSpeedMernDemo'

# change MongoDB collection & it's primary key
movieConnector = MongoConnector(connection, db, 'movies', 'movieId')

# change redis keys with prefix that must be synced with mongodb collection
RGJSONWriteThrough(GB,  keysPrefix='MovieEntity',
                  connector=movieConnector, name='MoviesWriteThrough',
                  version='99.99.99')

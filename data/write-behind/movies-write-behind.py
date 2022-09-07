# Gears Recipe for a single write behind

# import redis gears & mongo db libs
from rgsync import RGJSONWriteBehind, RGJSONWriteThrough
from rgsync.Connectors import MongoConnector, MongoConnection

# change mongodb connection
connection = MongoConnection('ADMIN_USER',
                             'ADMIN_PASSWORD',
                             'ADMIN_HOST')
# change MongoDB database
db = 'dbSpeedMernDemo'

# change MongoDB collection & it's primary key
movieConnector = MongoConnector(connection, db, 'movies', 'movieId')

# change redis keys with prefix that must be synced with mongodb collection
RGJSONWriteBehind(GB,  keysPrefix='MovieEntity',
                  connector=movieConnector, name='MoviesWriteBehind',
                  version='99.99.99')

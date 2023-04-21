from rgsync import RGWriteThrough
from rgsync.Connectors import PostgresConnector, PostgresConnection

'''
Create Postgres connection object
'''
connection = PostgresConnection('root', 'password', 'postgres:5432/example')

'''
Create Postgres users connector
'''
usersConnector = PostgresConnector(connection, 'users', 'id')

usersMappings = {
    'username': 'username',
    'email': 'email',
    'pwhash': 'password_hash',
    'first': 'first_name',
    'last': 'last_name',
    'dob': 'date_of_birth',
    'created_at': 'created_at',
    'updated_at': 'updated_at',
}

RGWriteThrough(GB, keysPrefix='__',     mappings=usersMappings,
               connector=usersConnector, name='UsersWriteThrough', version='99.99.99')
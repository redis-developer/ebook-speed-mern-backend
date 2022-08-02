## Indexes

Create following indexes in MongoDB Atlas

### Index 1 (For movie update)

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "movieId": {
        "type": "string"
      }
    }
  }
}
```

### Index 2 (For text search)

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "statusCode": {
        "type": "number"
      },
      "title": {
        "type": "string"
      },
      "tagline": {
        "type": "string"
      },
      "plot": {
        "type": "string"
      },
      "imdbVotes.low": {
        "type": "number"
      }
    }
  }
}
```

### Index 3 (For basic form search)

```json
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "statusCode": {
        "type": "number"
      },
      "imdbRating": {
        "type": "number"
      },
      "languages": {
        "type": "string"
      },
      "countries": {
        "type": "string"
      },
      "year.low": {
        "type": "number"
      },
      "title": {
        "type": "string"
      },
      "imdbVotes.low": {
        "type": "number"
      }
    }
  }
}
```

## Screenshots

Steps to create index in Atlas

- Navigate to "Search" tab -> click on "Create Search Index"
  ![create-index](./images/01-create-index.png)

- Choose "JSON editor"
  ![choose-json-editor](./images/02-choose-json-editor.png)

- Choose collection, provide index name & index json configuration
  ![sample-index](./images/03-sample-index.png)

- Review & create
  ![index-review](./images/04-index-review.png)

- Verify status
  ![list-page](./images/05-list-page.png)

## References

- [MongoDB Docs](https://www.mongodb.com/docs/atlas/atlas-search/create-index/#create-an-fts-index-using-the-service-ui)
  - [video](https://youtu.be/o2ss2LJNZVE)

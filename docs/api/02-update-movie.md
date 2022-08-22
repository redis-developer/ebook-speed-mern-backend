# UpdateMovie

## Request

```json
POST localhost:3001/api/updateMovie
{
    "movieId":"62e7a394d93370f523bdfd7c", //mandatory primary key

    //fields to update
    "title": "RRR (2022)",
    "countries":["INDIA"]
}
```

## Response

```json
{
 "data": {
    "movieId": "62e7a394d93370f523bdfd7c"
    //... all fields
  }
  "error": null
}
```

# UpdateMovie

## Request

```json
POST localhost:3000/api/updateMovie
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
  "data": "62e7a394d93370f523bdfd7c",
  "error": null
}
```

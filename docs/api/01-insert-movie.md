# InsertMovie

## Request

```json
POST localhost:3001/api/insertMovie
{
    "title": "RRR",
    "plot": "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s",
    "url": "https://www.themoviedb.org/movie/579974-rrr",
    "poster":"https://www.themoviedb.org/t/p/w600_and_h900_bestv2/wE0I6efAW4cDDmZQWtwZMOW44EJ.jpg",
    "imdbRating":"8",
    "released": "2022-03-25",
    "duration": 180,
    "languages": [
        "HINDI",
        "ENGLISH"
    ],
    "countries": [
        "INDIA",
        "USA"
    ]
}
```

## Response

```json
{
  "data": {
    "movieId": "62e7a394d93370f523bdfd7c"
    //... all fields
  },
  "error": null
}
```

# GetMoviesByText

## Request

```json
POST localhost:3001/api/getMoviesByText
{
    "searchText":"doll" //empty to get all movies
}
```

## Response

```json
{
  "data": [
    {
      "_id": "62e94558dba7175f112f5487",
      "languages": ["English"],
      "movieId": "1",
      "countries": ["USA"],
      "title": "Toy Story",
      "url": "https://themoviedb.org/movie/862",
      "plot": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
      "released": "1995-11-22",
      "tagline": "A cowboy doll is profoundly threatened and jealous when a new spaceman figure supplants him as top toy in a boy's room.",
      "duration": 81
    }
  ],
  "error": null
}
```

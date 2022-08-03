# GetMoviesByBasicFilters

## Request

```json
POST localhost:3000/api/getMoviesByBasicFilters
{
    "imdbRating":1,
    "countries":["USA"],
    "releaseYear":1995,
    "title":"dead"
}
```

## Response

```json
{
  "data": [
    {
      "_id": "62e94558dba7175f112f54b0",
      "languages": ["English"],
      "movieId": "42",
      "countries": ["USA"],
      "title": "Dead Presidents",
      "url": "https://themoviedb.org/movie/11443",
      "plot": "A Vietnam vet adjusts to life after the war while trying to support his family, but the chance of a better life may involve crime and bloodshed.",
      "released": "1995-10-06",
      "tagline": "A Vietnam vet adjusts to life after the war while trying to support his family, but the chance of a better life may involve crime and bloodshed.",
      "duration": 119
    },
    {
      "_id": "62e94558dba7175f112f54aa",
      "languages": ["English"],
      "movieId": "36",
      "countries": ["UK", "USA"],
      "title": "Dead Man Walking",
      "url": "https://themoviedb.org/movie/687",
      "plot": "A nun, while comforting a convicted killer on death row, empathizes with both the killer and his victim's families.",
      "released": "1996-02-02",
      "tagline": "A nun, while comforting a convicted killer on death row, empathizes with both the killer and his victim's families.",
      "duration": 122
    },
    {
      "_id": "62e94558dba7175f112f5493",
      "languages": ["English", "German"],
      "movieId": "12",
      "countries": ["USA", " France"],
      "title": "Dracula: Dead and Loving It",
      "url": "https://themoviedb.org/movie/12110",
      "plot": "Mel Brooks' parody of the classic vampire story and its famous film adaptations.",
      "released": "1995-12-22",
      "tagline": "Mel Brooks' parody of the classic vampire story and its famous film adaptations.",
      "duration": 88
    }
  ],
  "error": null
}
```

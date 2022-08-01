# InsertMovie

## Request

```json
POST localhost:3000/api/insertMovie
{
    "title": "RRR",
    "tagline": "Rise Roar Revolt",
    "plot": "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s",
    "url": "https://www.imdb.com/title/tt8178634/",
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
  "data": "62e7a394d93370f523bdfd7c",
  "error": null
}
```

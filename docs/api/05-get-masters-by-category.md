# GetMastersByCategory

## Request

```json
//categories = COUNTRY, LANGUAGE
POST localhost:3001/api/getMastersByCategory
{
    "categories":["LANGUAGE"]
}
```

## Response

```json
{
  "data": [
    {
      "_id": "62e94558dba7175f112f5476",
      "category": "LANGUAGE",
      "code": "ALGONQUIN",
      "name": "Algonquin"
    },
    {
      "_id": "62e94558dba7175f112f5477",
      "category": "LANGUAGE",
      "code": "CANTONESE",
      "name": "Cantonese"
    }
    //...so on
  ],
  "error": null
}
```

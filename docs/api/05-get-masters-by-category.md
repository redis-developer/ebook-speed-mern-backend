# GetMastersByCategory

## Request

```json
//categories = COUNTRY, LANGUAGE
POST localhost:3001/api/getMastersByCategory
{
    "categories":["COUNTRY","LANGUAGE"]
}
```

## Response

```json
{
  "data": {
    "LANGUAGE": [
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
      },
      {
        "_id": "62e94558dba7175f112f547a",
        "category": "LANGUAGE",
        "code": "FRENCH",
        "name": "French"
      }
      //..so on
    ],
    "COUNTRY": [
      {
        "_id": "62e94558dba7175f112f546b",
        "category": "COUNTRY",
        "code": "AUSTRALIA",
        "name": "Australia"
      },
      {
        "_id": "62e94558dba7175f112f5473",
        "category": "COUNTRY",
        "code": "UK",
        "name": "UK"
      }
      //..so on
    ]
  },
  "error": null
}
```

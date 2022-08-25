# GetMasterCategories

## Request

```json
//categories = COUNTRY, LANGUAGE
POST localhost:3001/api/getMasterCategories
{
    "categories":["COUNTRY","LANGUAGE"]
}
```

## Response

```json
{
  "data": [
      {
        "category": "LANGUAGE",
        "code": "ALGONQUIN",
        "name": "Algonquin"
      },
      {
        "category": "LANGUAGE",
        "code": "CANTONESE",
        "name": "Cantonese"
      },
      //..so on
      {
        "category": "COUNTRY",
        "code": "AUSTRALIA",
        "name": "Australia"
      },
      {
        "category": "COUNTRY",
        "code": "UK",
        "name": "UK"
      }
      //..so on
    ],
  "error": null
},
```

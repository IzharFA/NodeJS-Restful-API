# User API Spec

## Register User API

Endpoint :  POST /api/users 

Request Body :

```json
{
  "Id" : 8606,
  "NIK" : 21221,
  "name" : "Izanami Nathan"
}
```

Response Body Success :

```json
{
  "data" : {
    "ID" : 8606,
    "name" : "Izanami Nathan"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Username already registered"
}
```

## Login User API

Endpoint : POST /api/users/login

Request Body :

```json
{
  "ID" : 8606,
  "NIK" : 21221
}
```

Response Body Success : 

```json
{
  "data" : {
    "token" : "unique-token"
  }
}
```

Response Body Error :

```json
{
  "errors" : "Username or password wrong"
}
```

## Update User API

Endpoint : PATCH /api/users/current

Headers :
- Authorization : token 

Request Body :

```json
{
  "ID" : 8606, // optional
  "NIK" : "new NIK" // optional
}
```

Response Body Success : 

```json
{
  "data" : {
    "ID" : 8606,
    "NIK" : "Programmer Zaman Now Lagi"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Name length max 100"
}
```

## Get User API

Endpoint : GET /api/users/current

Headers :
- Authorization : token

Response Body Success:

```json
{
  "data" : {
    "ID" : 8606,
    "name" : "Izanami Nathan"
  }
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```

## Logout User API

Endpoint : DELETE /api/users/logout

Headers :
- Authorization : token

Response Body Success : 

```json
{
  "data" : "OK"
}
```

Response Body Error : 

```json
{
  "errors" : "Unauthorized"
}
```

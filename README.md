
# Stubhub Project With Microsrvices Architecture




## API Reference

#### Get all items

```http
  POST /api/users/singin
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `null` | `JSON` | **Required** Email and Password |

#### Create a user

```http
  POST /api/users/singup
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `JSON` | **Required** Email and Password |

#### Login into your account

```http
  GET /api/tickets
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `JSON` | **Required** authentication |

#### Return all tickets that you have

```http
  GET /api/tickets/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ID` | **Required** authentication |

#### Return a ticket with that Id

```http
  POST /api/tickets
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `JSON` | **Required** title and price also authentication |

#### Create a Ticket

```http
  PUT /api/tickets/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `ID` | **Required** title and price also authentication |

#### Update ticket with that Id

```http
  GET /api/orders/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `null`      | `JSON` | **Required** authentication |

#### Returns all orders that you have

```http
  GET /api/orders/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `JSON` | **Required** orderId also authentication |

#### Returns order with that Id

```http
  POST /api/orders/
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `JSON` | **Required** ticketId also authentication |

#### Create order

```http
  DELETE /api/orders/{id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `JSON` | **Required** orderId also authentication |

#### Cancel Order

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file in each repo

`JWT_KEY`

`MONGO_URI`


## 🛠 Skills
[![My Skills](https://skillicons.dev/icons?i=ts,nodejs,express,mongodb,docker,kubernetes,rabbitmq,redis,jest,&perline=12)](https://skillicons.dev)



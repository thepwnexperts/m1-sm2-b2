# API Endpoints

This repository contains the implementation of API endpoints using Node.js and Express.js. These endpoints provide functionality related to sending and verifying OTP (One-Time Password) via email using Nodemailer and otplib libraries.

## Prerequisites

Before running the API, make sure you have the following prerequisites installed:

- Node.js
- Nodemailer
- otplib

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Change into the project directory:

   ```bash
   cd your-repository
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the required environment variables:

   - `host`: SMTP server host
   - `port`: SMTP server port
   - `user`: SMTP server username
   - `pass`: SMTP server password
   - `waf`: Enable/disable Web Application Firewall (true/false)

5. Start the server:

   ```bash
   npm start
   ```

## Endpoints

### Send OTP

**URL:** `/`

**Method:** `POST`

**Description:** Sends a 6-digit OTP (One-Time Password) to the specified email address.

**Request Body:**

| Parameter | Type   | Description            |
|-----------|--------|------------------------|
| `to`      | String | Email address to send OTP to |

**Example Request:**

```json
{
  "to": "example@example.com"
}
```

**Example Response:**

```json
{
  "message": "success",
  "status": 200
}
```

### Verify OTP

**URL:** `/verify`

**Method:** `POST`

**Description:** Verifies the OTP (One-Time Password) provided by the user.

**Request Body:**

| Parameter | Type   | Description            |
|-----------|--------|------------------------|
| `from`    | String | Email address to verify |
| `otp`     | String | OTP to verify          |

**Example Request:**

```json
{
  "from": "example@example.com",
  "otp": "123456"
}
```

**Example Response:**

```json
{
  "message": "success: login successfully",
  "status": 200
}
```

## Error Handling

In case of errors, the API will return an appropriate HTTP status code along with an error message.

- `400 Bad Request`: Invalid request parameters or too many OTP requests (if WAF is enabled).
- `406 Not Acceptable`: OTP not found or OTP is not valid.
- `500 Internal Server Error`: Internal server error occurred.

## Contributing

Contributions are welcome! If you find any issues or want to enhance the functionality of the API, feel free to open a pull request.

## License

This project is licensed under the [GPL-3.0 license].

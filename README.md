# Movie Rent - Restful API

### This is a work in progress

Node.js app which has the purpose to set a movie rental business

I developed this project as part of my learning path the purpose of the app is to integrate Node.js using express to build an REST API that communicates with MongoDB to store and retrieve data.

---

## 1. How to use this repo

- <code>git clone https://github.com/Diogo-Menezes/movie-rent.git movie-rent</code>
- <code>cd movie-rent</code>
- <code>yarn install / npm install</code>
- <code>Set a .env file with the same values of the .env.example</code>
- <code>Run yarn dev to start server</code>
- To be able to use the app and store data you have to create a local MongoDB or set a MongoDB in the cloud

### 1.1 Testing live version

- Use Insomnia or Postman or other client
- Use the endpoints listed below with the url: <code>https://morning-cove-01041.herokuapp.com</code>
- Be aware that some endpoints require authentication

---

## 2. Endpoints

Precede the endpoints with the base url <code>http://localhost:3333</code>

- Customer <pre><code>/api/customers</pre></code>
- Users <pre><code>/api/users</pre></code>
- Genres <pre><code>/api/genres</pre></code>
- Movies <pre><code>/api/movies</pre></code>
- Rentals<pre><code>/api/rentals</pre></code>
- Returns<pre><code>/api/returns</pre></code>

---

# 3. Techs/modules used 🚀

- Node.js
- Express
- Moongose
- MongoDB
- JWT
- Bcrypt
- Joi
- Winston
- Jest
- Supertest

# BookCourier API Endpoints

## Base URL

Configured via environment variable: `VITE_API_URL`
Expected: `https://bookcourier-server-two.vercel.app/api`

## Authentication Endpoints

- Firebase Authentication handles user registration/login
- ID tokens sent via Authorization header: `Bearer <token>`

## User Endpoints

### GET /users/me

Get current user data

- **Used in**: `AuthContext.jsx`
- **Response**: User object with role and profile data

### PUT /users/profile

Update user profile

- **Used in**: `AuthContext.jsx`, `MyProfilePage.jsx`
- **Body**: `{ name, photoURL, phoneNumber }`
- **Response**: Updated user data

### PATCH /users/:userId/role

Update user role (Admin only)

- **Used in**: `AllUsersPage.jsx`
- **Body**: `{ role: "user" | "librarian" | "admin" }`
- **Response**: Success message

## Book Endpoints

### GET /books (via useFetch)

Get all books with filters

- **Used in**: `AllBooksPage.jsx`, `HomePage.jsx`, `LatestBooks.jsx`
- **Query params**: `search`, `category`, `sortBy`, `page`, `limit`
- **Response**: `{ data: { books: [], total: number, totalCount: number } }`

### GET /books/:id (via useFetch)

Get book details by ID

- **Used in**: `BookDetailsPage.jsx`
- **Response**: `{ data: { book: {} } }`

### GET /books/all-books-for-admin (via useFetch)

Get all books for admin management

- **Used in**: `ManageBooksPage.jsx`
- **Response**: `{ data: { books: [] } }`

### POST /books/add

Add new book (Librarian/Admin)

- **Used in**: `AddBookPage.jsx`
- **Body**: Book object with all fields
- **Response**: Created book data

### PUT /books/:id

Update book (Librarian/Admin)

- **Used in**: `EditBookPage.jsx`
- **Body**: Updated book data
- **Response**: Updated book data

### PATCH /books/:bookId/status

Toggle book status (Admin only)

- **Used in**: `ManageBooksPage.jsx`
- **Body**: `{ status: "active" | "inactive" }`
- **Response**: Success message

### DELETE /books/:bookId

Delete book (Admin only)

- **Used in**: `ManageBooksPage.jsx`
- **Response**: Success message

## Order Endpoints

### GET /orders/my-orders (via useFetch)

Get current user's orders

- **Used in**: `MyOrdersPage.jsx`
- **Response**: `{ data: { orders: [] } }`

### GET /orders/all-orders (via useFetch)

Get all orders (Librarian/Admin)

- **Used in**: `OrdersPage.jsx`
- **Response**: `{ data: { orders: [] } }`

### GET /orders/can-review/:bookId

Check if user can review a book

- **Used in**: `ReviewsSection.jsx`
- **Response**: `{ canReview: boolean }`

### POST /orders

Create new order

- **Used in**: `OrderModal.jsx`
- **Body**: `{ bookId, userName, userEmail, phoneNumber, address }`
- **Response**: Created order data

### PATCH /orders/:orderId/status

Update order status (Librarian/Admin)

- **Used in**: `OrdersPage.jsx`
- **Body**: `{ status: "pending" | "processing" | "delivered" | "cancelled" }`
- **Response**: Success message

### PATCH /orders/:orderId/cancel

Cancel order

- **Used in**: `MyOrdersPage.jsx`, `OrdersPage.jsx`
- **Response**: Success message

### PATCH /orders/:orderId/payment-status

Update payment status

- **Used in**: `PaymentPage.jsx`
- **Body**: `{ paymentStatus: "paid" | "pending" }`
- **Response**: Success message

## Review Endpoints

### GET /reviews/book/:bookId (via useFetch)

Get reviews for a specific book

- **Used in**: `ReviewsSection.jsx`
- **Response**: `{ data: { reviews: [] } }`

### POST /reviews

Submit a review

- **Used in**: `ReviewsSection.jsx`
- **Body**: `{ bookId, rating, comment }`
- **Response**: Created review data

## Wishlist Endpoints

### POST /wishlist

Add book to wishlist

- **Used in**: `BookDetailsPage.jsx`
- **Body**: `{ bookId }`
- **Response**: Success message

## Payment Endpoints

### POST /payments

Process payment (Mock)

- **Used in**: `PaymentPage.jsx`
- **Body**: `{ orderId, amount, paymentMethod, cardDetails }`
- **Response**: Payment confirmation

## Response Format

All endpoints return data in the format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Actual response data
  }
}
```

## Error Format

```json
{
  "success": false,
  "message": "Error message"
}
```

## Authentication

- All protected routes require Firebase ID token
- Token automatically added via Axios interceptor
- Header: `Authorization: Bearer <firebase_id_token>`

## Notes

- `useFetch` hook extracts `response.data` automatically
- Direct API calls (post, put, patch, del) return full response
- Pagination: Use `page` and `limit` query params
- Sorting: Use `sortBy` query param
- Filtering: Use `search` and `category` query params

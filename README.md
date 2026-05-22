# order-service

Orchestrates the full order lifecycle. The most cross-linked service in the platform — calls user-service, payment-service, product-catalog, and notification-service.

## Port: 3004

## API Endpoints
- `POST /orders` — create a new order (orchestrates 5 services)
- `GET /orders/:id` — get order details
- `PATCH /orders/:id/status` — update order status
- `DELETE /orders/:id` — cancel order (within 2-hour window)
- `GET /cart/:userId` — get user's cart
- `POST /cart` — add item to cart
- `DELETE /cart/:userId` — clear cart

## Outbound Service Calls
1. **user-service** — validate user exists and is not suspended
2. **product-catalog** — get product details and reserve inventory
3. **product-catalog** — get price with user-role discounts applied
4. **payment-service** — authorise payment
5. **notification-service** — send order confirmation

See `BUSINESS_RULES.md` for order management rules.
# accuracy test trigger
# reindex
# desc fix

const _carts = new Map<string, Array<{ productId: string; quantity: number }>>();

export async function getCart(userId: string) {
  return _carts.get(userId) ?? [];
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  const cart = _carts.get(userId) ?? [];
  const existing = cart.find(i => i.productId === productId);
  if (existing) existing.quantity += quantity;
  else cart.push({ productId, quantity });
  _carts.set(userId, cart);
  return cart;
}

export async function clearCart(userId: string) {
  _carts.delete(userId);
}

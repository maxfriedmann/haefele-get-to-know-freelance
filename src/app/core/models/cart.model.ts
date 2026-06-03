// this differs from the actual documentation, see README.md for more details
export interface CartProduct {
	productId: number;
	quantity: number;
}

export interface Cart {
	id: number;
	userId: number;
	date: string;
	products: CartProduct[];
}

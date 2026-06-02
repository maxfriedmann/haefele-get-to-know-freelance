export interface Product {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: {
		// undocumented in fakestoreapi docs, but present in the data
		rate: number;
		count: number;
	};
}

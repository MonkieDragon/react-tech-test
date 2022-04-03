import "../AdditionalFiles/App.css";
import { useState, useEffect } from "react";

//This is the API url to fetch from
const API_URL = "https://matchesfashion.com/api/products";
const TAX_RATE = 0.08;

const formCur = (money) => {
	return money.toLocaleString("en-US", {
		style: "currency",
		currency: "GBP",
	});
};

const calculateProfit = (prod) => {
	const taxFreeQuan = Math.min(prod.quantitySold, 10);
	const taxableQuan = Math.max(prod.quantitySold - 10, 0);
	const taxFreeProf = taxFreeQuan * (prod.soldPrice - prod.costToBusiness);
	const taxableProf =
		taxableQuan * (prod.soldPrice - prod.costToBusiness) * (1 - TAX_RATE);
	return formCur(taxFreeProf + taxableProf);
};

function YourSolution() {
	const [products, setProducts] = useState([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(0);
	const [isError, setIsError] = useState(false);

	useEffect(() => {
		setIsError(false);
		fetch(API_URL + `?page=${page}`)
			.then((response) => response.json())
			.then((data) => {
				setProducts(data.products);
				setTotal(data.count);
				console.log(data);
			})
			.catch(() => {
				setIsError(true);
			});
	}, [page]);

	return (
		<div className="App">
			<table id="products">
				<thead>
					<tr>
						<th>Id</th>
						<th>Brand</th>
						<th>Name</th>
						<th>Quantity Sold</th>
						<th>Sold Price</th>
						<th>Cost To Business</th>
						<th>Profit after Tax</th>
					</tr>
				</thead>
				<tbody>
					{isError
						? null
						: products.map((product, index) => {
								return (
									<tr key={index}>
										<td>{product.id}</td>
										<td>{product.brand}</td>
										<td>{product.name}</td>
										<td>{product.quantitySold}</td>
										<td>{formCur(product.soldPrice)}</td>
										<td>{formCur(product.costToBusiness)}</td>
										<td>{calculateProfit(product)}</td>
									</tr>
								);
						  })}
				</tbody>
			</table>
			<button
				disabled={page === 0}
				onClick={() => {
					setPage(0);
				}}
			>
				First Page
			</button>
			<button
				disabled={page === 0}
				onClick={() => {
					setPage((currPage) => currPage - 1);
				}}
			>
				Previous Page
			</button>
			<button
				onClick={() => {
					setPage((currPage) => currPage + 1);
				}}
				disabled={10 * (page + 1) >= total}
			>
				Next Page
			</button>
			<button
				disabled={10 * (page + 1) >= total}
				onClick={() => {
					setPage(Math.floor(total / 10) - 1);
				}}
			>
				Last Page
			</button>
		</div>
	);
}

export default YourSolution;

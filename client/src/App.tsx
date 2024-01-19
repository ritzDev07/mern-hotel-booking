import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import Layout from "./layouts/Layout";
import Register from "./pages/Register";

const App = () => {

	return (
		<Router>
			<Routes>

				<Route path="/" element={
					<Layout>
						<p>HomePage</p>
					</Layout>
				} />

				<Route path="/sign-in" element={
					<Layout>
						<p>SignIn page</p>
					</Layout>
				} />

				<Route path="/register" element={
					<Layout>
						<Register />
					</Layout>
				} />

			</Routes>
		</Router>
	)
}

export default App

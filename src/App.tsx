import { ExternalLink } from 'lucide-react';
import './App.css';
import Home from './components/pages/Home';
// import { NoMatch } from './components/pages/NoMatch';
import WorkflowBuilder from './components/workflow';
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
	return (
		<>
			<div>
				{/* Routes nest inside one another. Nested route paths build upon
            parent route paths, and nested route elements render inside
            parent route elements. See the note about <Outlet> below. */}
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<Home />} />
						<Route path="builder" element={<WorkflowBuilder />} />
						<Route path="*" element={<Home />} />
					</Route>
				</Routes>
			</div>
		</>
	);
}

function Layout() {
	return (
		<div>
			<nav className="bg-slate-200 h-14">
				<ul className="flex py-3 justify-center items-center gap-8">
					<li className="font-bold flex gap-2 items-center">
						<img src="/vite.svg" className="h-8" alt="SVG Image" />
						Nano Agent Builder
					</li>
					<li>
						<Link className="hidden md:block text-blue-800" to="/">
							home
						</Link>
					</li>
					<li>
						<Link className="hidden md:block text-blue-800" to="/builder">
							builder
						</Link>
						<Link
							target="_blank"
							className="md:hidden text-blue-800 flex items-center"
							to="/index.html"
						>
							<ExternalLink className="h-4 w-4" />
						</Link>
					</li>
				</ul>
			</nav>
			<hr />
			{/* An <Outlet> renders whatever child route is currently active,
			so you can think about this <Outlet> as a placeholder for
			the child routes we defined above. */}
			<Outlet />
		</div>
	);
}

export default App;

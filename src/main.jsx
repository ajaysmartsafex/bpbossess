import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store, { persistor } from "./store/store.js";
import { PersistGate } from "redux-persist/integration/react";
// import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/Home.jsx'
import { AuthLayout, Login } from './components/index.js'


import AddGame from "./pages/AddGame";
import Signup from './pages/Signup'
import EditPost from "./pages/EditPost";
import Post from "./pages/Post";
import AllGames from "./pages/AllGames.jsx";
import EditResultDetail from "./pages/EditResultDetail.jsx";
import AddGameResult from './pages/AddGameResult.jsx'
import ResultDetail from './pages/ResultDetail.jsx'
import EditResult from './pages/EditResult.jsx'


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/login",
                element: (
                    <AuthLayout authentication={false}>
                        <Login />
                    </AuthLayout>
                ),
            },
            {
                path: "/signup",
                element: (
                    <AuthLayout authentication={false}>
                        <Signup />
                    </AuthLayout>
                ),
            },
            {
                path: "/all-games",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AllGames />
                    </AuthLayout>
                ),
            },
            {
                path: "/add-game",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AddGame />
                    </AuthLayout>
                ),
            },
            {
                path: "/edit-post/:slug",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <EditPost />
                    </AuthLayout>
                ),
            },
            {
                path: "/post/:slug",
                element: <Post />,
            },
            {
                path: "/edit-result",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <EditResult />
                    </AuthLayout>
                ),
            },
            {
                path: "/add-result",
                element: (
                    <AuthLayout authentication>
                        {" "}
                        <AddGameResult />
                    </AuthLayout>
                ),
            },
            {
                path: "result/:gameName",
                // element: <EditResultDetail />
                element: <ResultDetail />,
            },
        ],
    },
])

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    </React.StrictMode>,
)

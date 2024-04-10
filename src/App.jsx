/* eslint-disable */
import React, { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import { CssBaseline } from '@mui/material'

import Register from './components/pages/Register'
import Login from './components/pages/Login'
import AdminRoute from './routes/AdminRoute'
import UserRoute from './routes/UserRoute'
import NotFound from './components/pages/NotFound'

import HomeUser from './components/pages/user/UserHome'
import HomeAdmin from './components/pages/admin/AdminHome'

import ProductStock from './components/pages/admin/ProductStock'
import CustomerOrder from './components/pages/admin/CustomerOrder'
import DailyStock from './components/pages/admin/DailyStock'
import AdminSale from './components/pages/admin/AdminSale'
import AdminSearch from './components/pages/admin/AdminSearch'
import AdminSearchOrder from './components/pages/admin/AdminSearchOrder'
import ManageUser from './components/pages/admin/ManageUser'
import AdminCheckout from './components/pages/admin/AdminCheckout'

import ResponsiveAppBar from './components/layout/ResponsiveAppBar'
import UserOrder from './components/pages/user/UserOrderID'

import { useDispatch } from 'react-redux'
import { login } from './redux/userSlice'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import ExpressList from './components/pages/admin/ExpressList'
import ExpressCreate from './components/pages/admin/ExpressCreate'
import ExpressDelete from './components/pages/admin/ExpressDelete'
import EditProduct from './components/pages/admin/ProductEdit'
import ProductCreate from './components/pages/admin/ProductCreate'
import DailyEdit from './components/pages/admin/DailyEdit'

export const baseURL = 'https://vercel-server-weliveapp.vercel.app'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userToken = localStorage.getItem('token')

    if (userToken) {
      const axiosFetch = (authToken) =>
        axios
          .post(
            `${baseURL}/api/current-user`,
            {},
            {
              headers: { authToken },
            }
          )
          .then((result) => {
            dispatch(
              login({
                username: result.data.username,
                role: result.data.role,
                name: result.data.name,
                email: result.data.email,
                picture: result.data.picture,
                token: authToken,
              })
            )
            setLoading(false)
          })
          .catch((err) => {
            alert(err)
            setLoading(false)
          })

      axiosFetch(userToken)
    } else {
      setLoading(false)
    }
  }, [dispatch])

  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading..</span>
        </div>
      </div>
    )
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ToastContainer position="top-center" autoClose={1000} />

      {/* Public */}
      <Routes>
        <Route
          path="*"
          element={
            <NotFound text="The page you are looking for does not exist." />
          }
        />
        <Route path="/" element={[<ResponsiveAppBar />, <HomeUser />]} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Customer */}
        <Route
          path="/user/home"
          element={
            <UserRoute>
              <HomeUser />
            </UserRoute>
          }
        />
        <Route path="/order/:id" element={<UserOrder />} />

        {/* Admin */}
        <Route
          path="/admin/home"
          element={
            <AdminRoute>
              <HomeAdmin />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/stock"
          element={
            <AdminRoute>
              <ProductStock />
            </AdminRoute>
          }
        />
        <Route
          path="/product/create"
          element={
            <AdminRoute>
              <ProductCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/product/edit/:id"
          element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock"
          element={
            <AdminRoute>
              <DailyStock />
            </AdminRoute>
          }
        />
        <Route
          path="/daily-stock/edit/:id"
          element={
            <AdminRoute>
              <DailyEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/search"
          element={
            <AdminRoute>
              <AdminSearch />
            </AdminRoute>
          }
        />
        <Route
          path="/search/order"
          element={
            <AdminRoute>
              <AdminSearchOrder />
            </AdminRoute>
          }
        />
        <Route
          path="/express"
          element={
            <AdminRoute>
              <ExpressList />
            </AdminRoute>
          }
        />
        <Route
          path="/express/create"
          element={
            <AdminRoute>
              <ExpressCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/express/delete"
          element={
            <AdminRoute>
              <ExpressDelete />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/checkout"
          element={
            <AdminRoute>
              <AdminCheckout />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/sales"
          element={
            <AdminRoute>
              <AdminSale />
            </AdminRoute>
          }
        />
        {/* Manage User */}
        <Route
          path="/admin/manage"
          element={
            <AdminRoute>
              <ManageUser />
            </AdminRoute>
          }
        />

        {/* --------------- */}
        <Route
          path="/order"
          element={
            <AdminRoute>
              <CustomerOrder />
            </AdminRoute>
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default App

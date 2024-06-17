/* eslint-disable */
import React, { createContext, useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import axios from 'axios'

import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Register from './components/pages/Register'
import Login from './components/pages/Login'
import AdminRoute from './routes/AdminRoute'
import UserRoute from './routes/UserRoute'

import HomePage from './components/pages/HomePage'
import NotFound from './components/pages/NotFound'

import HomeUser from './components/pages/user/HomeUser'
import HomeAdmin from './components/pages/admin/HomeAdmin'
import ManageUser from './components/pages/admin/ManageUser'

import ProductStock from './components/pages/admin/product/ProductStock'
import DailyStock from './components/pages/admin/daily/DailyStock'
import DailyCreate from './components/pages/admin/daily/DailyCreate'
import DailyEdit from './components/pages/admin/daily/DailyEdit'
import ProductGraph from './components/pages/admin/product/ProductGraph'

import AdminSale from './components/pages/admin/AdminSale'
import AdminCheckout from './components/pages/admin/AdminCheckout'
import CustomerOrder from './components/pages/admin/customer/CustomerOrder'
import CustomerByOrder from './components/pages/admin/customer/CustomerByOrder'
import CustomerEdit from './components/pages/admin/customer/CustomerEdit'
import SearchCustomer from './components/pages/admin/customer/SearchCustomer'
import SearchOrder from './components/pages/admin/customer/SearchOrder'

import ResponsiveAppBar from './components/layout/ResponsiveAppBar'
import UserOrder from './components/pages/customer/CustomerOrderID'

import ExpressList from './components/pages/admin/ExpressList'
import ExpressCreate from './components/pages/admin/ExpressCreate'
import ExpressDelete from './components/pages/admin/ExpressDelete'
import AnalysisReport from './components/pages/admin/AnalysisReport'
import Info from './components/pages/admin/Info'
import LoadingFn from './components/functions/LoadingFn'

import { useDispatch } from 'react-redux'
import { login } from './redux/userSlice'
import DailyStockHistory from './components/pages/admin/daily/DailyStockHistory'

// export const baseURL = 'https://vercel-server-weliveapp.vercel.app'
export const baseURL = 'http://localhost:8000'

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const userToken = localStorage.getItem('token')

  useEffect(() => {
    if (userToken) {
      axiosFetch(userToken)
    } else {
      setLoading(false)
    }
  }, [dispatch])

  const axiosFetch = async (authToken) => {
    return await axios
      .post(
        `${baseURL}/api/current-user`,
        {},
        {
          headers: {
            Authorization: 'Bearer ' + authToken,
          },
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
        console.error(err)
        setLoading(false)
      })
  }

  if (loading) {
    return <LoadingFn />
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ToastContainer position="top-center" autoClose={3000} />
      {/* Public */}
      <Routes>
        <Route
          path="*"
          element={
            <NotFound text="The page you are looking for does not exist." />
          }
        />
        <Route
          path="/"
          element={
            <>
              <ResponsiveAppBar />
              <HomePage />
            </>
          }
        />
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
        <Route path="/order/:id" element={<CustomerByOrder />} />

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
          path="/admin/product-graph/:id"
          element={
            <AdminRoute>
              <ProductGraph />
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
          path="/admin/daily-stock/create"
          element={
            <AdminRoute>
              <DailyCreate />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock/edit/:id"
          element={
            <AdminRoute>
              <DailyEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/daily-stock/history"
          element={
            <AdminRoute>
              <DailyStockHistory />
            </AdminRoute>
          }
        />
        <Route
          path="/search/customer"
          element={
            <AdminRoute>
              <SearchCustomer />
            </AdminRoute>
          }
        />
        <Route
          path="/customer/edit/:id"
          element={
            <AdminRoute>
              <CustomerEdit />
            </AdminRoute>
          }
        />
        <Route
          path="/search/order"
          element={
            <AdminRoute>
              <SearchOrder />
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
        <Route
          path="/analysis"
          element={
            <AdminRoute>
              <AnalysisReport />
            </AdminRoute>
          }
        />
        <Route
          path="/info"
          element={
            <AdminRoute>
              <Info />
            </AdminRoute>
          }
        />
      </Routes>
    </React.Fragment>
  )
}

export default App

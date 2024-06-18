import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { json, useParams } from 'react-router-dom'
import { baseURL } from '../../../../App'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Editor from './Editer'
import Quill from 'quill'
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
export default function CustomerByOrder() {
  const Delta = Quill.import('delta');
  const [range, setRange] = useState();
  let { user } = useSelector((store) => store.user)
  console.log("USER : ", user)
  const dispatch = useDispatch()
  const [lastChange, setLastChange] = useState();
  const [readOnly, setReadOnly] = useState(false);
  const quillRef = useRef();
  const { id } = useParams()
  const [image, setImage] = useState(new Delta().insert(''));
  const [orders, setOrders] = useState({
    data: { name: 'loading', orders: [] },
  })
  const token = localStorage.getItem('token')
  const [formData, setFormData] = useState([])

  const confirmpayment = async () => {
    try {
      const response = await axios.put(`${baseURL}/api/sale-order/complete/${id}`, {
        orders: orders.data.orders.map(order => ({
          order_id: order._id,
          quantity: order.quantity
        }))
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
  
      alert("อัพเดตสถานะแล้ว");
      window.location.reload();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };
  const confirmsended = async () => {
    try {
      const response = await axios.put(`${baseURL}/api/sale-order/sended/${id}`, {
        express: formData.express,  // Add this line to send the express value
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("อัพเดตสถานะแล้ว");
      window.location.reload();
    } catch (error) {
      console.error('There was an error!', error);
    }
  };

  const fetchSaleOrder = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/sale-order/read/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      console.log('oo', response.data)
      setOrders({ data: response.data })
      setFormData(response.data)
      setImage(JSON.parse(response.data.picture_payment))

    } catch (error) {
      console.error('There was an error!', error)
    }
  }

  useEffect(() => {
    if (token) {
      fetchSaleOrder()
    }
  }, [token, id])

  console.log('1.', orders, "DATE ORDER : ", orders)

  const calculateTotalQuantity = () => {
    return orders.data.orders.reduce(
      (total, order) => total + order.quantity,
      0
    )
  }

  const calculateTotalPrice = () => {
    return orders.data.orders.reduce(
      (total, order) => total + order.price * order.quantity,
      0
    )
  }

  const calculateTotalExpressPrice = () => {
    const totalQuantity = calculateTotalQuantity()

    if (totalQuantity > 5 && totalQuantity <= 10) {
      return 100
    } else if (totalQuantity > 10) {
      return 200
    } else {
      return 50
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(name, value)
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      picture_payment: e.target.files[0],
    }))
  }

  const handleSubmit = async (e) => {
    console.log(orders)
    console.log(formData)
    e.preventDefault()
    const formDataToSend = new FormData()
    formDataToSend.append('picture_payment', JSON.stringify(quillRef.current?.getContents()))
    formDataToSend.append('name', formData.name)
    formDataToSend.append('address', formData.address)
    formDataToSend.append('sub_district', formData.sub_district)
    formDataToSend.append('sub_area', formData.sub_area)
    formDataToSend.append('district', formData.district)
    formDataToSend.append('postcode', formData.postcode)
    formDataToSend.append('tel', formData.tel)
    formDataToSend.append('express', formData.express)
    formDataToSend.append('date_added', formData.date_added)
    formDataToSend.append('_id', id)

    const formEnt = Object.fromEntries(formDataToSend.entries())
    console.log('SEND THIS : ', formEnt)
    try {
      const response = await axios.put(
        `${baseURL}/api/sale-order`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      console.error('There was an error!', error)
    }

  }

  const buffer = orders

  let dt = new Date(Date.parse(orders.data.date_added))
  const a = (month) => {
    if (month < 10) return '0' + month
    else return '' + month
  }
  let df =
    '' + dt.getFullYear() + '-' + a(dt.getMonth() + 1) + '-' + dt.getDate()
  console.log(df)


  return (
    <div className="container position-relative mt-3 mx-auto">
      <h3 className="text-start mb-3">
        <span>We Live App</span>
        <span className="text-success ms-2">
          | รายการสั่งซื้อของคุณ {orders.data.name}{' '}
          {orders.data.complete == true &&
            <>
              <p className='mt-3 text-success'>
                <CreditScoreIcon /> ชำระเงินแล้ว
              </p>
              {orders.data.sended == true &&
                <>
                  <p className='mt-3 text-warning'>
                    <LocalShippingIcon /> จัดส่งแล้ว
                  </p>
                </>
              }
            </>}
        </span>
      </h3>
      <div className="mt-3 mb-3">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="text-center">รายการที่</TableCell>
                <TableCell className="text-center">ชื่อสินค้า</TableCell>
                <TableCell className="text-center">จำนวน</TableCell>
                <TableCell className="text-center">ราคา</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.data.orders && orders.data.orders.length > 0 ? (
                orders.data.orders.map((order, index) => (
                  <TableRow key={order._id}>
                    <TableCell className="text-center">{index + 1}</TableCell>
                    <TableCell className="text-center">{order.name}</TableCell>
                    <TableCell className="text-center">
                      {order.quantity} ชิ้น
                    </TableCell>
                    <TableCell className="text-center">
                      {order.price} บาท
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="text-center" colSpan={4}>
                    กำลังโหลดข้อมูล
                  </TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell className="text-end"> </TableCell>
                <TableCell className="text-end">จำนวนสินค้ารวม </TableCell>
                <TableCell className="text-end">
                  {calculateTotalQuantity()}
                </TableCell>
                <TableCell className="text-end">ชิ้น</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-end"> </TableCell>
                <TableCell className="text-end">ราคาสินค้ารวม </TableCell>
                <TableCell className="text-end">
                  {calculateTotalPrice()}
                </TableCell>
                <TableCell className="text-end">บาท</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-end"> </TableCell>
                <TableCell className="text-end">ค่าขนส่ง</TableCell>
                <TableCell className="text-end">
                  {calculateTotalExpressPrice()}
                </TableCell>
                <TableCell className="text-end">บาท</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="text-end"> </TableCell>
                <TableCell className="text-end">ที่ต้องชำระ </TableCell>
                <TableCell className="text-end">
                  {calculateTotalPrice() + calculateTotalExpressPrice()}
                </TableCell>
                <TableCell className="text-end">บาท</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="card shadow">
        <div className="text-center">
          <br />
          <span> Order :</span>
          <span className="text-danger">#{id}</span> <br />
          --------------------------------------------
          <br />
          <br />
          พร้อมเพย์ 012-345-6789
          <br />
          KBANK 012-345-6789
          <br />
          ชื่อบัญชี นายเจษฎากร คุ้มเดช
          <br />
          <br />
          --------------------------------------------
          <br />
          🙏 รบกวนขอความกรุณาลูกค้า 💢 โอนยอดบิลต่อบิลนะคะ
          แล้วค่อยเอฟใหม่ได้คะ💢
          <br /> 💢หากมียอดค้างหักลบยอดเอง โอนได้เลยคะ
          รบกวนแนบรูปยอดค้างไว้ได้เลยคะ ขอบคุณมากค่ะ🙏
          <br /> 🙏 ถ้าสินค้ามีตำหนิกรุณารีบแจ้ง รับเปลี่ยน
          หรือคืนสินค้ามีตำหนิจากร้าน ส่งผิดสีผิดแบบ ผิดไซส์ เท่านั้นคะ
          ขอบพระคุณมากคะ🙏
          <br />
          <br />
        </div>
      </div>

      {orders.data.address == null ? (
        <>
          <div className="mt-4">
            <Paper elevation={3} className="p-4">
              <Typography variant="h6" gutterBottom>
                แบบฟอร์มสำหรับกรอกข้อมูล
              </Typography>
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="date"
                      name="date_added"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name="address"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="ตำบล"
                      fullWidth
                      name="district"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="อำเภอ"
                      fullWidth
                      name="sub_area"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="จังหวัด"
                      fullWidth
                      name="sub_district"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="รหัสไปรษณีย์"
                      fullWidth
                      name="postcode"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="เบอร์โทรศัพท์"
                      fullWidth
                      name="tel"
                      defaultValue={formData.date_added}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageChange}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="contained"
                        color="warning"
                        component="span"
                        className="m-lg-2"
                      >
                        อัปโหลดรูปภาพ
                      </Button>
                      {formData.picture_payment &&
                        formData.picture_payment.name}
                    </label>
                  </Grid>
                  <Grid item xs={4}>
                    <Button type="submit" variant="contained" color="primary">
                      ยืนยันการชำระเงิน
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </div>
        </>
      ) : (
        <>
          <p hidden>{orders.data.address}</p>
          <div className="mt-4">
            <Paper elevation={3} className="p-4">
              <Typography variant="h6" gutterBottom>
                แบบฟอร์มสำหรับกรอกข้อมูล
              </Typography>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="date"
                      name="date_added"
                      defaultValue={df}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={4}>
                    {buffer.data.address != null ? (
                      <>
                        <TextField
                          label="ชื่อ-นามสกุล"
                          fullWidth
                          name="name"
                          defaultValue={'' + orders.data.name}
                          onChange={handleChange}
                          required
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid item xs={8}>
                    {buffer.data.address != null ? (
                      <>
                        <TextField
                          fullWidth
                          name="address"
                          defaultValue={buffer.data.address}
                          onChange={handleChange}
                          required
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    {buffer.data.address != null ? (
                      <>
                        <TextField
                          label="ตำบล"
                          fullWidth
                          name="district"
                          defaultValue={'' + orders.data.district}
                          onChange={handleChange}
                          required
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>

                  <Grid item xs={4}>
                    {buffer.data.address != null ? (
                      <>
                        <TextField
                          label="อำเภอ"
                          fullWidth
                          name="sub_area"
                          defaultValue={'' + orders.data.sub_area}
                          onChange={handleChange}
                          required
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      label="จังหวัด"
                      fullWidth
                      name="sub_district"
                      defaultValue={'' + orders.data.sub_district}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="รหัสไปรษณีย์"
                      fullWidth
                      name="postcode"
                      defaultValue={'' + orders.data.postcode}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="เบอร์โทรศัพท์"
                      fullWidth
                      name="tel"
                      defaultValue={'' + orders.data.tel}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Editor
                      ref={quillRef}
                      readOnly={readOnly}
                      // JSON.parse(orders.data.picture_payment)
                      onSelectionChange={setRange}
                      onTextChange={setLastChange}
                      defaultValue={image}
                    />
                  </Grid>

                  {user.role == "admin" ? <>



                    {orders.data.complete == false ?
                      <>
                        <Grid item xs={6}>
                          <Button type="onSubmit" variant="contained" color="primary"
                            onClick={confirmpayment}
                          >
                            ส่งแบบฟอร์มการชำระเงิน
                          </Button>
                        </Grid>
                        <Grid item xs={6}>
                          <Button type="button" variant="contained" color="warning"
                            onClick={confirmpayment}
                          >
                            ยืนยันการชำระเงิน
                          </Button>
                        </Grid>

                      </>
                      :
                      <>
                        <Grid item xs={6}>
                          <Button type="button" variant="contained" color="error"
                            onClick={confirmpayment}
                          >
                            ปฎิเสธการชำระเงิน
                          </Button>
                        </Grid>
                        {orders.data.sended == false ?
                          <>
                            <Grid item xs={12}>
                              <TextField
                                label="express"
                                fullWidth
                                name="express"
                                defaultValue={'' + orders.data.express}
                                onChange={handleChange}
                                required
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Button type="button" variant="contained" color="warning"
                                onClick={confirmsended}
                              >
                                ยืนยันการส่งสินค้า
                              </Button>
                            </Grid>
                          </>
                          :
                          <>
                            <Grid item xs={12}>
                              <TextField
                                label="expressID"
                                fullWidth
                                name="expressID"
                                defaultValue={'' + orders.data.express}
                                onChange={handleChange}
                                disabled
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <Button type="button" variant="contained" color="error"
                                onClick={confirmsended}
                              >
                                ยกเลิกสถานะการจัดส่ง
                              </Button>
                            </Grid>
                          </>}
                      </>}
                  </> :
                    <>
                      <Grid item xs={12}>
                        <TextField
                          label="expressID"
                          fullWidth
                          name="expressID"
                          defaultValue={'' + orders.data.express}
                          onChange={handleChange}
                          disabled
                        />
                      </Grid>

                    </>}

                </Grid>
              </form>
            </Paper>
          </div>
          <div>

          </div>
        </>
      )}
    </div>

  )
}

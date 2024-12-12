import {useFormik} from "formik"
import * as Yup from "yup"
import axios from "axios"
import {toast} from "react-toastify"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faHome
 } from "@fortawesome/free-solid-svg-icons"

const ForgotPwd = () => {

    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email address").required("Email Required"),
        }),
        onSubmit: async (values, {resetForm}) => {
                setIsLoading(true)
                try {
                    const response = await axios.post(
                "http://localhost:3500/auth/forgotPwd", values
                    )
                    resetForm()
                    toast.success("Email sent successfully")
                }
                catch(error) {
                    console.log(error.response)
                    if (error.response?.status === 404){
                        toast.error("Email not found")
                        resetForm()
                    } else {
                        toast.error("Server error")
                        resetForm()
                    }
                } finally {
                    setIsLoading(false)
                    navigate('/emailSent')
                }
        }
    })

  return (
    <>
            <form className="forgotPwd" onSubmit = {formik.handleSubmit}>
            <label 
            className={`forgotPwd__form__label ${formik.touched.email && formik.errors.email
            ? "form__input--incomplete" : ""
            }`}
            htmlFor="email">
                {formik.touched.email && formik.errors.email ? formik.errors.email : "Enter Your Email"}
            </label>

            <input 
            type="email"
            placeholder="Email"
            className={`forgotPwd__form__input ${
                formik.touched.email && formik.errors.email
            ? "form__input--incomplete" : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
            name="email"
            id="email"
             />

             <button
                type="submit"
                className="forgotPwd__form__button"
                disabled={isLoading}
             >
                {isLoading ? " Sending... " : "Send Email"}
             </button>

                <div className="forgotPwd__form__buttonContainer">
                    <Link to='/' value='Home'>
                        <FontAwesomeIcon className="forgotPwd__form__button-Home" icon={faHome}/>
                    </Link>
                </div>

        </form>

    </>

  )
}

export default ForgotPwd
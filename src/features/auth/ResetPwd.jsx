import {useFormik} from "formik"
import * as Yup from "yup"
import axios from "axios"
import {toast} from "react-toastify"
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { 
  faHome
 } from "@fortawesome/free-solid-svg-icons"

 import "./authCSS/ResetPwd.css"

const ResetPwd = () => {
    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            newPassword: Yup.string().required("Required").min(6, "Too Short!"),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword"), null], "Passwords must match").required("Required"),
        }),
        onSubmit: (values) => {
            const {newPassword} = values;
            const token = window.location.pathname.split("/").pop()

            axios
                .post(`https://taskmanagerx-api.onrender.com/auth/resetPwd/${token}`, {newPassword})
                .then((response) => {
                    toast.success(response.data.message)
                    setTimeout(() => {
                        window.location.href = "/login"
                    }, 3000)
                })
                .catch((error) => {
                    toast.error("Your link has expired")
                })
        }
    })
  return (
    <div className="resetPwd">
        <h1>Reset Password</h1>

        <form className="resetPwd__form" onSubmit={formik.handleSubmit}>
        <label htmlFor="newPassword"
            className={` resetPwd__form__label
            ${formik.touched.newPassword && formik.errors.newPassword 
            ? "errMsg" : ""}
            `}
        >
        {formik.touched.newPassword && formik.errors.newPassword 
            ? formik.errors.newPassword 
            : "New Password"}
        </label>

        <input 
            className={`
            resetPwd__form__input
            ${formik.touched.newPassword && formik.errors.newPassword
            ? "errMsg" : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            type="password" 
            name="newPassword" 
            id="newPassword"
        />

        <label htmlFor="confirmPassword"
            className={`resetPwd__form__label
            ${formik.touched.confirmPassword && formik.errors.confirmPassword 
            ? "errMsg" : ""}
            `}
        >
        {formik.touched.confirmPassword && formik.errors.confirmPassword 
            ? formik.errors.confirmPassword 
            : "Confirm Password"}
        </label>

        <input 
            className={`resetPwd__form__input ${formik.touched.confirmPassword && formik.errors.confirmPassword
            ? "errMsg" : ""
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            type="password" 
            name="confirmPassword" 
            id="confirmPassword"
        />
        <div >
            <button
            type="submit"
            className="resetPwd__form__buttonContainer"
            >
            Reset Password
            </button>
        </div>

         <footer className="resetPwd__form__button-Home">
        <Link 
        to='/'>
            <FontAwesomeIcon  icon={faHome}/>
        </Link>
      </footer>
        </form>
    </div>
  )
}

export default ResetPwd
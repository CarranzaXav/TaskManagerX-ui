import { Link } from "react-router-dom"

const EmailSent = () => {
  return (
    <div className="emailSent">
      <div className="emailSent__form__label">Email Sent!
      </div>
      <div className="emailSent__form__link">
        <Link to="/login">
        Return to Login
        </Link>
      </div>
    </div>
  )
}

export default EmailSent
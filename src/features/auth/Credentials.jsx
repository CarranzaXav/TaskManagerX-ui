import "./authCSS/Credentials.css"
import CredentialBtn from "../../icons/CredentialBtn.svg"
import { useEffect, useState } from "react"


export default function Credentials() {
    const [showHelp, setShowHelp] = useState("")

    useEffect(() => {
        setShowHelp('')
    }, [setShowHelp])

    function showCred() {
        setShowHelp(!showHelp)
    }

    const display = showHelp ? "credBlock" : "none"

    return (
        <div className="cred">
            <img
                className="credBtn"
                src={CredentialBtn}
                alt="Login Info"
                onClick={showCred}
            />
            <div className={display}>
                <div className="credInfo">
                    <h2>For Viewing Purposes:<br /> use theses credentials to view a <i>Admin</i> profile and a basic <i>Common</i> account:</h2>
                </div>
                <div className="adminCred">
                    <h3>Username: Admin</h3>
                    <h4>Password: admin</h4>
                </div>
                <div className="commonCred">
                    <h3>Username: Common</h3>
                    <h4>Password: common</h4>
                </div>
            </div>
        </div>
    )
}
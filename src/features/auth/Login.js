import { useRef, useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "./authApiSlice"

import usePersist from "../../hooks/usePersist"
import useTitle from "../../hooks/useTitle"
import PulseLoader from "react-spinners/PulseLoader"

const Login = () => {
  useTitle("User Login")

  const userRef = useRef()
  const errRef = useRef()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const [persist, setPersist] = usePersist()

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [login, {isLoading}] = useLoginMutation()

  useEffect(() => {
    userRef.current.focus()
  },[])

  useEffect(() => {
    setErrMsg('');
    }, [username,password])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try{
      const {accessToken} = await login({username,password}).unwrap()
      dispatch(setCredentials({accessToken}))
      setUsername('')
      setPassword('')
      navigate('/dash', {replace: true})

      // window.location.reload(); //Fix this later seems lagey

    } catch (err) {
      if(!err.status){
        setErrMsg('No Server Response');
      } else if(err.status === 400){
        setErrMsg('Missing Username or Password')
      } else if(err.status === 401){
        setErrMsg('Unauthorized')
      } else {
        setErrMsg(err.data?.message)
      }

      if(errRef.current) {
      errRef.current.focus();    
      }
    }
  }

  const handleUserInput = (e) => setUsername(e.target.value)
  const handlePwdInput = (e) => setPassword(e.target.value)

  const handleToggle = () => setPersist(prev => !prev)

  const errClass = errMsg ? 'errmsg' : 'offscreen'

  if(isLoading) return <PulseLoader className="loader" color={'#FFF'}/>

  const content = (
    <section className="login">
      <header className="login__header">
        <h1 className="login__header__title">User Login</h1>
      </header>
      <main className="login__main">
        <p ref={errRef} className={errClass} aria-live="assertive">{errMsg}</p>

        <form onSubmit={handleSubmit} className="login__form">

          <label className="login__form__label" htmlFor="username">Username:</label>
          <input 
            type="text" 
            className="login__form__input"
            id="username"
            ref={userRef}
            value={username}
            onChange={handleUserInput}
            autoComplete="off"
            required
          />

          <label className="login__form__label"  htmlFor="password">Password:</label>
          <input 
            type="password" 
            className="login__form__input"
            id="password"
            onChange={handlePwdInput}
            value={password}
            required
          />

          <button className="login__form__submit-button">Sign In</button>

          <div className="login__form__bottomRow">
          <label htmlFor="persist" className="form__persist">
          Trust This Device:
          <input 
            type="checkbox" 
            className="login__form__checkbox" 
            id="persist"
            onChange={handleToggle}
            checked={persist}
          />
          </label>
          <div className="login__form__forgotPass">
          <Link to='/forgotPwd'>Forgot Password?</Link>
          </div>
          </div>

        </form>
      </main>    
      
      <footer className="login__button-container">
        <Link 
        className="login__button"
        to='/'>Back to Home</Link>
      </footer>
    </section>
  )

  return content
}

export default Login
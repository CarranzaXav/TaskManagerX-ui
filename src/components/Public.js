import { faEnvelope, faUserTie } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { Link } from "react-router-dom";

const Public = () => {
    const content = (
        <section className="public">
            <header className="public__title">
               <h1>Welcome to Task Manager X </h1> 
            </header>
            <main className="public__main">
            <p>Created by: Xavier W. Carranza 2024</p>
            <div className="public__addr">
                <p>Contact info:</p>

                <br />

                <div className="public__addr-buttons">
                
                <div className="public__addr-button">
                    <a href="https://xaviercarranza.com/">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faUserTie}/>
                            <i className="public__icon-title">Portfolio</i>
                        </div>
                    </a>
                </div>

                <br />

                <div className="public__addr-button">
                    <a href="mailto:carranzax7@gmail.com">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <i className="public__icon-title">             
                            carranzax7@gmail.com
                            </i>
                    </div>
                    </a>
                </div>
                
                <br />
                
                <div className="public__addr-button">
                    <a href="https://github.com/CarranzaXav">
                        <div className="icon-container">
                            <FontAwesomeIcon icon={faGithub} />
                            <i className="public__icon-title">Github</i>
                        </div>
                    </a>
                </div>
                </div>
            </div>
            <br />
            </main>
            <footer className="public__login">
            <Link to="/login">User Login</Link>
            </footer>
        </section>
    )
  return content
}

export default Public
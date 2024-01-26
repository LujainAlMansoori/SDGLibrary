// This file is the navigation bar, there is links in the logo, which takes you to the home page, 
// and links to all other pages 
import { Link } from 'react-router-dom';
import "./style/NavBar.css"
import logo from './assets/logo.png';
export default function NavBar(){
    return (
        <div>
            <nav className="navBar">
            
            <Link to="/" exact><img src={logo} alt="Logo" className="logo" /></Link>
                <ul>
                    <li>
                        <Link to="/">
                            Home
                        </Link>
                        <Link to="/NewMaterial">
                            New Material
                        </Link>
                        <Link to="/SearchResults">
                            SearchResults
                        </Link>
                        <Link to="/About">
                            About
                        </Link>
                    </li>
                </ul>

            </nav>
        </div>
    )
}
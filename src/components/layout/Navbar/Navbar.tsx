import { ExperimentFilled } from '@ant-design/icons'
import './styles.css'
import { Searchbar } from '..'
import { Link } from 'react-router-dom'


function Navbar () {


    return (
        <div className="navbar" style={{
            padding: '0 30px',
        }}>
            <Link to='/'>
            <div style={{
                gap: '30px',
                display: 'flex',
                alignItems: 'center',

            }}>
            <ExperimentFilled size={50} />
            <span>ArNS service interface</span>
            </div>
            </Link>
            
            <Searchbar />

            <div>
                <Link to='/docs'>
                docs
                </Link>
            <button>Connect</button>
            </div>
            


        </div>
    )
}


export default Navbar
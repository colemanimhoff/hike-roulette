import React from 'react'

const Header = (props) => {
    return (
        <header>
            <h1>{props.title}</h1>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default Header
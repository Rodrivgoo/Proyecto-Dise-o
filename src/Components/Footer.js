import React from 'react';
import { FaInstagram, FaGithub } from 'react-icons/fa';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="social-icons">
                <a href="https://www.instagram.com/Rodrivgoo" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://github.com/Rodrivgoo/Proyecto-Cartelera/tree/master" target="_blank" rel="noopener noreferrer"><FaGithub /></a>
                <a href="https://www.instagram.com/br0wed_" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
            </div>
        </footer>
    );
};

export default Footer;

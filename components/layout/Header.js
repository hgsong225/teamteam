import React, { Component } from 'react';
import Link from 'next/link';

import fb from '../../config/firebase';

class Header extends Component {
    state = {
        user: {},
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        fb.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({
                    user,
                });
            } else {
                this.setState({
                    user: null,
                });
            }
        })
    }

    toggleMenu = () => {
        const sidebar = "sidebar-left-container";
        const mask = "mask";
        let toggle_sidebar = document.getElementById(sidebar);
        let toggle_mask = document.getElementById(mask);
        console.log(toggle_sidebar.className);
        console.log(toggle_mask.className);
        if (toggle_sidebar.className === `${toggle_sidebar.className.split(' ')[0]} ${sidebar} toggle`) {
            toggle_sidebar.className = `${toggle_sidebar.className.split(' ')[0]} ${sidebar}`;
            toggle_mask.className = `${toggle_sidebar.className.split(' ')[0]} ${mask}`;
          } else {
            toggle_sidebar.className += " toggle";
            toggle_mask.className += " toggle";
          }
    }

    render() {
        return (
            <div className="navbar">
                    <style jsx>{`
                        .toggle {
                            display: none;
                        }
                        .active {
                            display: block;
                        }
                        .navbar {
                            overflow: hidden;
                            background-color: #fff;
                            border-bottom:1px solid #f1f1f1;
                            position: fixed;
                            width: 100%;
                            height: 64px;
                            z-index: 998;
                            box-shadow: 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.2);
                        }
                        .menu-box {
                            position: absolute;
                            box-sizing: border-box;
                            visibility: hidden;
                            opacity: 0;
                        }
                        .menu {
                            box-sizing: border-box;
                            padding: 20px 20px;
                            font-size: 24px;
                            cursor: pointer;
                        }
                        ul {
                            display: flex;
                            justify-content: flex-start;
                            width: 100%;
                            height: 100%;
                            list-style-type: none;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        li {
                            padding: 0 16px;
                        }
                        li:last-child {
                            padding-right: 40px;
                        }
                        .logo {
                            display: flex !important;
                            align-items: center;
                            margin-left: 40px;
                            padding: 0 !important;
                            height: 64px;
                            cursor: pointer;
                            transform: translateX(0px);
                            transition: all .8s ease-out;
                        }
                        .logo img {
                            height: 40px;
                            text-align: center;
                        }
                        .logo, .header-list a, .create a{
                            display: block;
                            padding: 21.5px 16px;
                            text-decoration: none;
                        }
                        .header-list {
                            display: flex !important;
                            justify-content: flex-end;
                            width: 100%;
                            display: inline-block;
                        }
                        .header-list li a:hover:not(.active) {
                            color: #2196f3;
                            font-weight: bold;
                        }
                        .create a{
                            background-color: #2196f3;
                            color: #fff;
                        }
                        .create a:hover {
                            color: #fff !important;
                            font-weight: bold !important;
                        }
                        @media screen and (max-width: 992px) {
                            .header-list {
                                display: none !important;
                            }
                            .logo {
                                margin: auto;
                                transition: all .8s ease-out;
                            }
                            .menu-box {
                                visibility: visible;
                                opacity: 1;
                            }
                        }
                        @media screen and (max-width: 1200px) and (min-width: 993px) {
                            .logo {
                            }
                        }
                    `}</style>
                <ul>
                    <div className="menu-box">
                        <i
                            className="fa fa-bars menu"
                            onClick={this.toggleMenu}
                        ></i>
                    </div>
                    <li className="logo">
                        <Link prefetch href='/'><img src={'../../static/logo.png'}/></Link>
                    </li>
                    <div className="header-list">
                        <li className="create">
                            <Link prefetch href='/match/create'><a>경기 만들기</a></Link>
                        </li>
                        <li className="">
                            <Link prefetch href='/match/me'><a>내 경기</a></Link>
                        </li>
                        {
                            this.state.user
                            ? <li className="">
                                <Link prefetch href='/profile'><a>프로필</a></Link>
                            </li>
                            : <li className="">
                                <Link prefetch href='/sign-in'><a>로그인</a></Link>
                            </li>
                        }
                    </div>
                </ul>
            </div>
        );
    }
}

export default Header;

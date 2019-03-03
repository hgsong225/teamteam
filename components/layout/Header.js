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

    render() {
        return (
            <div className="navbar">
                    <style jsx>{`
                        .navbar {
                            overflow: hidden;
                            background-color: #fff;
                            border-bottom:1px solid #f1f1f1;
                            position: fixed;
                            width: 100%;
                            height: 49px;
                            z-index: 998;
                            box-shadow: 0 2px 2px -2px rgba(0,0,0,.2);
                        }
                        ul {
                            height: 100%;
                            list-style-type: none;
                            margin: 0;
                            padding: 0;
                            overflow: hidden;
                        }
                        li {
                            margin-right: 20px;
                            float: right;
                        }
                        .logo {
                            margin-left: 20px;
                            float: left;
                        }
                        .logo, .header-list a, .create a{
                            display: block;
                            padding: 14px 16px;
                            text-decoration: none;
                        }
                        .header-list a:hover:not(.active) {
                            color: #2196f3;
                            font-weight: bold;
                        }
                        .create a{
                            background-color: #2196f3;
                            color: #fff;
                        }
                        .create a:hover {
                            font-weight: bold;
                        }
                    `}</style>
                <ul>
                    <li className="logo">
                        <Link prefetch href='http://localhost:3000/'><a>TEAMTEAM</a></Link>
                    </li>
                    <li className="header-list">
                            <Link prefetch href='/match/me'><a>내 경기</a></Link>
                    </li>
                    {
                        this.state.user
                        ? <li className="header-list">
                            <Link prefetch href='/profile'><a>내 정보</a></Link>
                        </li>
                        : <li className="header-list">
                            <Link prefetch href='/sign-in'><a>로그인</a></Link>
                        </li>
                    }
                    <li className="create">
                            <Link prefetch href='/match/create'><a>경기 만들기</a></Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Header;

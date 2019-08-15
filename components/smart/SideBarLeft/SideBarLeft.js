import React, { Component } from 'react';
import Link from 'next/link';

import LocationList from '../../dumb/SideBarLeft/LocationList';

class SideBarLeft extends Component {
    static defaultProps = {
        user: {},
        selectedLocation: {},
    }

    state = {
        locations: [],
    }

    componentDidMount() {
        console.log('SideBarLeft에서 componentDidMount 실행');
        this.getAllLocation();
    }

    getAllLocation = () => {
        fetch(`/api/location`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            this.setState({
                locations: data,
            });
        })
        .catch(err => console.error(err));
    }

    render() {
        console.log('SideBarLeft에서 render() 실행');
        const { locations } = this.state;
        const { selectedLocation } = this.props;
        return (
            <div className="sidebar-left">
                <style jsx>{`
                    .sidebar-left {
                        margin-bottom: 16rem;
                    }
                    .logo-container {
                        display: none;
                    }
                    .sidebar-header-list {
                        display: none;
                    }
                    footer {
                        width: 280px;
                    }
                    .footer-box {
                        margin: 0px 10px 24px 10px;
                        padding: 0 20px 0px 30px;
                    }
                    .sidebar-sub-title {
                        font-size: 0.8rem;
                        color: #757575;
                    }

                    @media screen and (max-width: 992px) {
                        .logo-container {
                            display: flex;
                            justify-content: center;
                            width: 100%;
                        }
                        .logo-container img {
                            height: 40px;
                            padding: 40px;
                        }
                        .sidebar-header-list {
                            font-size: 16px;
                            display: block;
                            list-style-type: none;
                            margin-left: 10px;
                            padding: 0;
                        }
                        .sidebar-header-list li {
                            padding: 10px 0px 10px 30px;
                        }
                    }
                    hr {
                        width: 240px;
                        border: .5px solid #e1e1e1;
                    }
                `}</style>
                <div className="logo-container">
                    <img src="../../../static/logo.png"/>
                </div>
                <ul className="sidebar-header-list">
                    {
                        this.props.user
                        ? <li><Link prefetch href='/profile'><a>프로필</a></Link></li>
                        : <li><Link prefetch href='/sign-in'><a>로그인</a></Link></li>
                    }
                    <li>
                        <Link prefetch href='/match/me'><a>내 경기</a></Link>
                    </li>
                    <li><Link prefetch href='/match/create'><a>경기 만들기</a></Link></li>
                <hr />
                </ul>
                <LocationList
                    selectLocation={this.props.selectLocation}
                    locations={locations}
                    selectedLocation={selectedLocation}
                />
                <hr />
                <footer>
                    <div className="footer-box">
                        <p className="sidebar-sub-title">계좌번호</p>
                        <p className="account">신한 110-439-532672 팀팀</p>
                    </div>
                    <div className="footer-box">
                        <p className="sidebar-sub-title">카카오톡 플러스친구</p>
                        <p className="account">@팀팀</p>
                    </div>
                    <div className="footer-box">
                        <p className="sidebar-sub-title">사업자 번호</p>
                        <p className="account">228-53-00472</p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default SideBarLeft;

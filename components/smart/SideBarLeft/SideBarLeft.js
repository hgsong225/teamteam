import React, { Component } from 'react';

import LocationList from '../../dumb/SideBarLeft/LocationList';

class SideBarLeft extends Component {
    state = {
        locations: [],
    }

    componentDidMount() {
        console.log('SideBarLeft에서 componentDidMount 실행');
        this.getAllLocation();

    }

    getAllLocation = () => {
        fetch('http://localhost:3333/api/location')
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
                    footer {
                        width: 280px;
                    }
                    .footer-box {
                        margin: 0px 10px 24px 10px;
                        padding: 0 20px 0px 30px;
                    }
                    .title {
                        font-size: 0.8rem;
                        color: #757575;
                    }
                    .logo-container {
                        display: none;
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
                    }
                    hr {
                        width: 260px;
                        border: .5px solid #e1e1e1;
                    }
                `}</style>
                <div className="logo-container">
                    <img src="../../../static/logo.png"/>
                </div>
                <LocationList
                    selectLocation={this.props.selectLocation}
                    locations={locations}
                    selectedLocation={selectedLocation}
                />
                <hr />
                <footer>
                    <div className="footer-box">
                        <p className="title">계좌번호</p>
                        <p className="account">신한 110-439-532672 팀팀</p>
                    </div>
                    <div className="footer-box">
                        <p className="title">카카오톡 플러스친구</p>
                        <p className="account">@팀팀</p>
                    </div>
                    <div className="footer-box">
                        <p className="title">사업자 번호</p>
                        <p className="account">00-000-0000</p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default SideBarLeft;

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
                        width: 250px;
                        margin-bottom: 2rem;
                        border-bottom: 1px solid #e0e0e0;
                    }
                    .logo-container {
                        display: none;
                    }
                    footer div {
                        width: 100%;
                    }
                    @media screen and (max-width: 1200px) {
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
                `}</style>
                <div className="logo-container">
                    <img src="../../../static/logo.png"/>
                </div>
                <LocationList
                    selectLocation={this.props.selectLocation}
                    locations={locations}
                    selectedLocation={selectedLocation}
                />
                <footer>
                    <div>
                        <p>계좌번호</p>
                        <p>신한 110-439-532672 팀팀</p>
                    </div>
                </footer>
            </div>
        )
    }
}

export default SideBarLeft;

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
        fetch('http://localhost:3333/location')
        .then(res => res.json())
        .then(data => {
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
                        margin-bottom: 4rem;
                    }
                `}</style>
                <div>
                    <LocationList
                        selectLocation={this.props.selectLocation}
                        locations={locations}
                        selectedLocation={selectedLocation}
                    />
                    <hr />
                    <footer>
                        <p>계좌번호: 신한 110-439-532672 팀팀</p>
                    </footer>
                </div>
            </div>
        )
    }
}

export default SideBarLeft;

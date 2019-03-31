import React, { Component } from 'react';

import Header from './Header';
import View from './View';
import SideBarLeft from '../smart/SideBarLeft/SideBarLeft';


class MainView extends Component {

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

    render () {
        return (
            <div>
                <style jsx>{`
                    .container{
                        display: flex;
                        flex-direction: column;
                        margin-bottom: 80px;
                    }
                    .content {
                        display: flex;
                        justify-content: center;
                        margin-top: 64px;
                    }
                    .view-container {
                        display: flex;
                        justify-content: flex-start;
                        width: 1310px;
                        max-width: 1310px;
                    }
                `}</style>
                <div className="container">
                    <div className="header">
                        <Header />
                    </div>
                    <section>
                        <nav className="sidebar-left-container" id="sidebar-left-container">
                            <SideBarLeft
                                user={this.props.user}
                                selectLocation={this.props.selectLocation}
                                selectedLocation={this.props.selectedLocation}
                            />
                        </nav>
                        <div className="content">
                            <main className="view-container">
                                <View
                                    children={this.props.children}
                                />
                            </main>
                            <div id="mask" className="mask"
                                onClick={this.toggleMenu}
                            ></div>
                        </div>

                    </section>
                </div>
            </div>
        );
    }
}

export default MainView;
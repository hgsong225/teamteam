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
                        min-height: 100vh;
                        padding-bottom: 80px;
                    }
                    .content {
                        display: flex;
                        justify-content: center;
                        margin-top: 64px;
                    }
                    .content aside {
                        border-left:1px solid gray;
                    }
                    .view-container {
                        display: flex;
                        justify-content: flex-start;
                        width: 1310px;
                        max-width: 1310px;
                    }
                    .sidebar-left-container#sidebar-left-container {
                        display: none;
                    }
                    aside {
                    }
                    main {
                    }
                    
                    @media screen and (max-width: 375px) {
                        .sidebar-left-container {
                            margin-top: 0;
                            z-index: 999;
                            transform: translateX(-304px);
                            box-shadow: 0 0 16px rgba(0,0,0,.28);
                            transition: transform .5s ease-out;
                        }
                    }
                    @media screen and (max-width: 992px) {
                        nav {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            margin-top: 65px;
                            height: 100vh;
                            position: fixed;
                            overflow-y: hidden;
                            background-color: #fff;
                        }
                        nav:hover {
                            overflow-y: scroll;
                        }
                        nav::-webkit-scrollbar-track
                        {
                            border-radius: 10px;
                            background-color: #f1f1f1;
                        }
                        nav::-webkit-scrollbar
                        {
                            width: 8px;
                            border-radius: 10px;
                        }
                        nav:hover::-webkit-scrollbar
                        {
                        }
                        nav::-webkit-scrollbar-thumb
                        {
                            border-radius: 10px;
                        }
                        nav:hover::-webkit-scrollbar-thumb {
                            background-color: #e0e0e0;
                        }
                        .sidebar-left-container {
                            z-index: 999;
                            margin-top: 0;
                            transform: translateX(-304px);
                            box-shadow: 0 0 16px rgba(0,0,0,.28);
                            transition: transform .5s ease-out;
                        }
                        .sidebar-left-container.toggle {
                            transform: translateX(0px);
                        }
                        .sidebar-left-container#sidebar-left-container {
                            display: block;
                        }
                        .content {
                            margin-left: 0;
                            margin-right: 0;
                        }
                        main {
                            padding: 0 8px;
                        }
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
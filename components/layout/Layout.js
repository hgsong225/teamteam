import React, { Component } from 'react';

import Header from './Header';
import SideBarLeft from '../smart/SideBarLeft/SideBarLeft';
import LayoutView from './LayoutView';

class Layout extends Component {
    static defaultProps = {
        selectedLocation: {},
    }

    state = {
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
        console.log('Layout에서 render() 실행');
        const { selectedLocation } = this.props;
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
                        margin-left: 304px;
                        margin-right: 80px;
                        margin-top: 65px;
                        width: auto;
                        transition: margin .5s ease-out;
                    }
                    .content aside {
                        border-left:1px solid gray;
                    }
                    nav {
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
                    aside {
                    }
                    main {
                        flex: 7;
                        padding:10px;
                    }
                    @media screen and (max-width: 375px) {
                        .sidebar-left-container {
                            margin-top: 0;
                            z-index: 999;
                            transform: translateX(-304px);
                            box-shadow: 0 0 16px rgba(0,0,0,.28);
                            transition: transform 1s ease-out;
                        }
                    }
                    @media screen and (max-width: 992px) {
                        .sidebar-left-container {
                            z-index: 999;
                            margin-top: 0;
                            transform: translateX(-304px);
                            box-shadow: 0 0 16px rgba(0,0,0,.28);
                            transition: transform 1s ease-out;
                        }
                        .sidebar-left-container.toggle {
                            transform: translateX(0px);
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
                                    selectLocation={this.props.selectLocation}
                                    selectedLocation={selectedLocation}
                                />
                        </nav>
                        <div className="content">
                            <main className="view-container">
                                <LayoutView
                                   children={this.props.children}
                                />
                            </main>
                            <aisde>
                            </aisde>
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

export default Layout;
